import os
import json
import logging
from fastapi import FastAPI, HTTPException, BackgroundTasks
from pydantic import BaseModel
from typing import List, Optional
import uvicorn
import requests
from pathlib import Path

# Import PageIndex core components
from pageindex import page_index_main, config
from pageindex.utils import ConfigLoader, ChatGPT_API_async, extract_json, remove_fields, create_node_mapping

# Initialize Logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("PageIndex-API")

app = FastAPI(title="PageIndex Microservice")

RESULTS_DIR = Path("./results")
RESULTS_DIR.mkdir(exist_ok=True)

class IndexRequest(BaseModel):
    file_url: str
    document_id: str
    model: Optional[str] = "gemini-1.5-pro"

class QueryRequest(BaseModel):
    document_id: str
    query: str
    model: Optional[str] = "gemini-1.5-pro"

# State management for indexing status
indexing_status = {}

def process_document(file_url: str, document_id: str, model_name: str):
    try:
        indexing_status[document_id] = "processing"
        
        # Download the file
        logger.info(f"Downloading file from {file_url}")
        response = requests.get(file_url)
        if response.status_code != 200:
            raise Exception("Failed to download file")
            
        temp_file = Path(f"/tmp/{document_id}.pdf")
        temp_file.parent.mkdir(exist_ok=True)
        with open(temp_file, "wb") as f:
            f.write(response.content)
            
        # Run PageIndex Cooking
        opt = ConfigLoader().load({"model": model_name})
        result = page_index_main(str(temp_file), opt)
        
        # Save result
        with open(RESULTS_DIR / f"{document_id}.json", "w") as f:
            json.dump(result, f)
            
        indexing_status[document_id] = "completed"
        logger.info(f"Indexing completed for {document_id}")
        
        # Cleanup
        if temp_file.exists():
            temp_file.unlink()
            
    except Exception as e:
        logger.error(f"Indexing failed for {document_id}: {str(e)}")
        indexing_status[document_id] = f"error: {str(e)}"

@app.post("/index")
async def start_indexing(req: IndexRequest, background_tasks: BackgroundTasks):
    background_tasks.add_task(process_document, req.file_url, req.document_id, req.model)
    return {"status": "accepted", "document_id": req.document_id}

@app.get("/status/{document_id}")
async def get_status(document_id: str):
    status = indexing_status.get(document_id, "unknown")
    if status == "unknown" and (RESULTS_DIR / f"{document_id}.json").exists():
        return {"status": "completed"}
    return {"status": status}

@app.post("/query")
async def query_document(req: QueryRequest):
    index_file = RESULTS_DIR / f"{req.document_id}.json"
    if not index_file.exists():
        raise HTTPException(status_code=404, detail="Index not found for this document")
        
    with open(index_file, "r") as f:
        data = json.load(f)
        tree = data["structure"]
        
    # 1. Traversal Step: Identify relevant nodes
    tree_for_search = remove_fields(tree, fields=["text"])
    
    search_prompt = f"""
    You are given a legal question and a hierarchical tree structure of a document.
    Your task is to identify the sections (node_ids) that likely contain the answer.
    
    Question: {req.query}
    Tree Structure: {json.dumps(tree_for_search)}
    
    Reply ONLY with JSON:
    {{
        "thinking": "<reasoning steps>",
        "node_list": ["node_id_1", "node_id_2"]
    }}
    """
    
    search_response = await ChatGPT_API_async(model=req.model, prompt=search_prompt)
    search_data = extract_json(search_response)
    
    # 2. Retrieval Step: Collect text content
    node_map = create_node_mapping(tree)
    relevant_text = []
    citations = []
    
    for nid in search_data.get("node_list", []):
        if nid in node_map:
            node = node_map[nid]
            relevant_text.append(node.get("text", ""))
            citations.append({
                "title": node.get("title"),
                "page": node.get("start_index"),
                "node_id": nid
            })
            
    # 3. Final Answer Generation
    answer_prompt = f"""
    Based on the retrieved legal context, answer the following query.
    Cite the sections provided.
    
    Context:
    {" ".join(relevant_text)}
    
    Query: {req.query}
    """
    
    final_answer = await ChatGPT_API_async(model=req.model, prompt=answer_prompt)
    
    return {
        "answer": final_answer,
        "thinking": search_data.get("thinking"),
        "citations": citations
    }

if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
