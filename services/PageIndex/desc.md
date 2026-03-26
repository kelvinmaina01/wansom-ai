# PageIndex Architecture and Code Structure

## Overview
PageIndex is a vectorless, reasoning-based RAG system that creates hierarchical tree structures from long documents (PDFs and Markdown) using LLM reasoning instead of vector similarity search.

## Core Architecture

### 1. **Entry Point** (`run_pageindex.py`)
Main CLI interface that handles PDF and Markdown processing.

**Key Functions:**
- `argparse` configuration for command-line arguments
- PDF validation and processing pipeline
- Markdown processing pipeline
- Output file generation in `results/` directory

**Code Snippet:**
```python
if args.pdf_path:
    # Process PDF file
    opt = config(
        model=args.model,
        toc_check_page_num=args.toc_check_pages,
        max_page_num_each_node=args.max_pages_per_node,
        max_token_num_each_node=args.max_tokens_per_node,
        if_add_node_id=args.if_add_node_id,
        if_add_node_summary=args.if_add_node_summary,
        if_add_doc_description=args.if_add_doc_description,
        if_add_node_text=args.if_add_node_text
    )
    toc_with_page_number = page_index_main(args.pdf_path, opt)
```

### 2. **PDF Processing Engine** (`pageindex/page_index.py`)
Core engine for extracting hierarchical structure from PDF documents.

**Key Components:**

#### **A. TOC Detection and Extraction**
- `check_toc()`: Detects table of contents in PDF pages
- `find_toc_pages()`: Identifies pages containing TOC
- `toc_extractor()`: Extracts TOC content from identified pages
- `toc_transformer()`: Transforms raw TOC into JSON structure

**Code Snippet - TOC Detection:**
```python
def find_toc_pages(start_page_index, page_list, opt, logger=None):
    last_page_is_yes = False
    toc_page_list = []
    i = start_page_index
    
    while i < len(page_list):
        if i >= opt.toc_check_page_num and not last_page_is_yes:
            break
        detected_result = toc_detector_single_page(page_list[i][0],model=opt.model)
        if detected_result == 'yes':
            toc_page_list.append(i)
            last_page_is_yes = True
        elif detected_result == 'no' and last_page_is_yes:
            break
        i += 1
    return toc_page_list
```

#### **B. Three Processing Modes**
1. **`process_toc_with_page_numbers()`**: PDFs with page numbers in TOC
2. **`process_toc_no_page_numbers()`**: PDFs without page numbers in TOC  
3. **`process_no_toc()`**: PDFs without any TOC

**Code Snippet - Processing Modes:**
```python
async def meta_processor(page_list, mode=None, toc_content=None, toc_page_list=None, start_index=1, opt=None, logger=None):
    if mode == 'process_toc_with_page_numbers':
        toc_with_page_number = process_toc_with_page_numbers(toc_content, toc_page_list, page_list, toc_check_page_num=opt.toc_check_page_num, model=opt.model, logger=logger)
    elif mode == 'process_toc_no_page_numbers':
        toc_with_page_number = process_toc_no_page_numbers(toc_content, toc_page_list, page_list, model=opt.model, logger=logger)
    else:
        toc_with_page_number = process_no_toc(page_list, start_index=start_index, model=opt.model, logger=logger)
```

#### **C. Structure Generation**
- `generate_toc_init()`: Creates initial tree structure
- `generate_toc_continue()`: Continues structure generation for large documents
- `add_page_number_to_toc()`: Maps sections to physical page numbers

**Code Snippet - Structure Generation:**
```python
def generate_toc_init(part, model=None):
    prompt = """
    You are an expert in extracting hierarchical tree structure...
    The response should be in the following format: 
        [
            {
                "structure": <structure index, "x.x.x"> (string),
                "title": <title of the section, keep the original title>,
                "physical_index": "<physical_index_X> (keep the format)"
            },
        ],
    Directly return the final JSON structure. Do not output anything else."""
    
    prompt = prompt + '\nGiven text\n:' + part
    response, finish_reason = ChatGPT_API_with_finish_reason(model=model, prompt=prompt)
    return extract_json(response)
```

#### **D. Verification and Correction**
- `verify_toc()`: Validates extracted TOC accuracy
- `fix_incorrect_toc()`: Corrects incorrect section mappings
- `check_title_appearance()`: Verifies sections appear on correct pages

**Code Snippet - Verification:**
```python
async def verify_toc(page_list, list_result, start_index=1, N=None, model=None):
    sample_indices = random.sample(range(0, len(list_result)), N) if N else range(0, len(list_result))
    
    tasks = [
        check_title_appearance(item, page_list, start_index, model)
        for item in indexed_sample_list
    ]
    results = await asyncio.gather(*tasks)
    
    correct_count = sum(1 for result in results if result['answer'] == 'yes')
    accuracy = correct_count / len(results) if results else 0
    return accuracy, incorrect_results
```

#### **E. Main Processing Pipeline**
- `tree_parser()`: Main orchestration function
- `page_index_main()`: Entry point for PDF processing
- `process_large_node_recursively()`: Handles large document sections

**Code Snippet - Main Pipeline:**
```python
async def tree_parser(page_list, opt, doc=None, logger=None):
    check_toc_result = check_toc(page_list, opt)
    
    if check_toc_result.get("toc_content") and check_toc_result["toc_content"].strip() and check_toc_result["page_index_given_in_toc"] == "yes":
        toc_with_page_number = await meta_processor(
            page_list, 
            mode='process_toc_with_page_numbers', 
            start_index=1, 
            toc_content=check_toc_result['toc_content'], 
            toc_page_list=check_toc_result['toc_page_list'], 
            opt=opt,
            logger=logger)
    else:
        toc_with_page_number = await meta_processor(
            page_list, 
            mode='process_no_toc', 
            start_index=1, 
            opt=opt,
            logger=logger)
    
    toc_with_page_number = add_preface_if_needed(toc_with_page_number)
    toc_with_page_number = await check_title_appearance_in_start_concurrent(toc_with_page_number, page_list, model=opt.model, logger=logger)
    toc_tree = post_processing(valid_toc_items, len(page_list))
    return toc_tree
```

### 3. **Markdown Processing** (`pageindex/page_index_md.py`)
Handles markdown files using header-based hierarchy.

**Key Functions:**
- `extract_nodes_from_markdown()`: Parses markdown headers
- `build_tree_from_nodes()`: Creates tree structure from header hierarchy
- `tree_thinning_for_index()`: Reduces tree complexity for large documents
- `md_to_tree()`: Main markdown processing function

**Code Snippet - Markdown Parsing:**
```python
def extract_nodes_from_markdown(markdown_content):
    header_pattern = r'^(#{1,6})\s+(.+)'
    code_block_pattern = r'^```'
    node_list = []
    
    lines = markdown_content.split('\n')
    in_code_block = False
    
    for line_num, line in enumerate(lines, 1):
        if re.match(code_block_pattern, stripped_line):
            in_code_block = not in_code_block
            continue
        
        if not in_code_block:
            match = re.match(header_pattern, stripped_line)
            if match:
                title = match.group(2).strip()
                node_list.append({'node_title': title, 'line_num': line_num})
    return node_list, lines
```

### 4. **Utilities** (`pageindex/utils.py`)
Core utility functions and OpenAI API wrappers.

**Key Components:**

#### **A. LLM API Wrappers**
- `ChatGPT_API()`: Synchronous OpenAI API calls
- `ChatGPT_API_async()`: Asynchronous OpenAI API calls  
- `ChatGPT_API_with_finish_reason()`: API calls with finish reason tracking

**Code Snippet - API Wrappers:**
```python
def ChatGPT_API(model, prompt, api_key=CHATGPT_API_KEY, chat_history=None):
    max_retries = 10
    client = openai.OpenAI(api_key=api_key)
    for i in range(max_retries):
        try:
            messages = chat_history or []
            messages.append({"role": "user", "content": prompt})
            
            response = client.chat.completions.create(
                model=model,
                messages=messages,
                temperature=0,
            )
            return response.choices[0].message.content
        except Exception as e:
            if i < max_retries - 1:
                time.sleep(1)
            else:
                logging.error('Max retries reached for prompt: ' + prompt)
                return "Error"
```

#### **B. PDF Processing Utilities**
- `get_page_tokens()`: Extracts text and token counts from PDF pages
- `extract_text_from_pdf()`: Basic PDF text extraction
- `get_text_of_pdf_pages()`: Extracts text from specific page ranges

**Code Snippet - PDF Text Extraction:**
```python
def get_page_tokens(pdf_path, model="gpt-4o-2024-11-20", pdf_parser="PyPDF2"):
    enc = tiktoken.encoding_for_model(model)
    if pdf_parser == "PyPDF2":
        pdf_reader = PyPDF2.PdfReader(pdf_path)
        page_list = []
        for page_num in range(len(pdf_reader.pages)):
            page = pdf_reader.pages[page_num]
            page_text = page.extract_text()
            token_length = len(enc.encode(page_text))
            page_list.append((page_text, token_length))
        return page_list
```

#### **C. Token Management**
- `count_tokens()`: Counts tokens using tiktoken
- `page_list_to_group_text()`: Groups pages based on token limits

**Code Snippet - Token Counting:**
```python
def count_tokens(text, model=None):
    if not text:
        return 0
    enc = tiktoken.encoding_for_model(model)
    tokens = enc.encode(text)
    return len(tokens)
```

#### **D. JSON Processing**
- `extract_json()`: Extracts JSON from LLM responses
- `get_json_content()`: Cleans JSON responses
- `structure_to_list()`: Converts tree structure to flat list

**Code Snippet - JSON Extraction:**
```python
def extract_json(content):
    try:
        start_idx = content.find("```json")
        if start_idx != -1:
            start_idx += 7
            end_idx = content.rfind("```")
            json_content = content[start_idx:end_idx].strip()
        else:
            json_content = content.strip()

        json_content = json_content.replace('None', 'null')
        json_content = ' '.join(json_content.split())
        return json.loads(json_content)
    except json.JSONDecodeError as e:
        logging.error(f"Failed to extract JSON: {e}")
        return {}
```

#### **E. Tree Structure Utilities**
- `write_node_id()`: Adds sequential node IDs
- `list_to_tree()`: Converts flat list to hierarchical tree
- `format_structure()`: Reorders tree node fields
- `print_toc()`: Pretty prints tree structure

**Code Snippet - Tree Conversion:**
```python
def list_to_tree(data):
    def get_parent_structure(structure):
        if not structure:
            return None
        parts = str(structure).split('.')
        return '.'.join(parts[:-1]) if len(parts) > 1 else None
    
    nodes = {}
    root_nodes = []
    
    for item in data:
        structure = item.get('structure')
        node = {
            'title': item.get('title'),
            'start_index': item.get('start_index'),
            'end_index': item.get('end_index'),
            'nodes': []
        }
        nodes[structure] = node
        
        parent_structure = get_parent_structure(structure)
        if parent_structure:
            if parent_structure in nodes:
                nodes[parent_structure]['nodes'].append(node)
            else:
                root_nodes.append(node)
        else:
            root_nodes.append(node)
    
    return [clean_node(node) for node in root_nodes]
```

#### **F. Configuration Management**
- `ConfigLoader` class: Loads and merges configuration from YAML and user options

**Code Snippet - Configuration:**
```python
class ConfigLoader:
    def __init__(self, default_path: str = None):
        if default_path is None:
            default_path = Path(__file__).parent / "config.yaml"
        self._default_dict = self._load_yaml(default_path)
    
    def load(self, user_opt=None) -> config:
        if user_opt is None:
            user_dict = {}
        elif isinstance(user_opt, config):
            user_dict = vars(user_opt)
        elif isinstance(user_opt, dict):
            user_dict = user_opt
        else:
            raise TypeError("user_opt must be dict, config(SimpleNamespace) or None")
        
        merged = {**self._default_dict, **user_dict}
        return config(**merged)
```

### 5. **Configuration** (`pageindex/config.yaml`)
Default configuration parameters.

**Configuration:**
```yaml
model: "gpt-4o-2024-11-20"
toc_check_page_num: 20
max_page_num_each_node: 10
max_token_num_each_node: 20000
if_add_node_id: "yes"
if_add_node_summary: "yes"
if_add_doc_description: "no"
if_add_node_text: "no"
```

### 6. **Package Interface** (`pageindex/__init__.py`)
Exports main functions for package usage.

**Code:**
```python
from .page_index import *
from .page_index_md import md_to_tree
```

## **Data Flow Architecture**

### **PDF Processing Flow:**
```
1. Input PDF → get_page_tokens() → [(page_text, token_count), ...]
2. Page list → check_toc() → TOC detection result
3. Based on TOC result → meta_processor() with appropriate mode
4. LLM calls → generate_toc_init()/generate_toc_continue()
5. Raw structure → post_processing() → hierarchical tree
6. Verification → verify_toc() → accuracy check
7. Correction → fix_incorrect_toc() if needed
8. Final tree → add_node_id()/add_summaries() → output JSON
```

### **Markdown Processing Flow:**
```
1. Input MD → extract_nodes_from_markdown() → header nodes
2. Nodes → extract_node_text_content() → text extraction
3. Optional: tree_thinning_for_index() → complexity reduction
4. Nodes → build_tree_from_nodes() → hierarchical tree
5. Optional: generate_summaries_for_structure_md() → summaries
6. Final tree → output JSON
```

## **Key Design Patterns**

### **1. Strategy Pattern**
Three processing modes for different TOC scenarios:
- `process_toc_with_page_numbers`
- `process_toc_no_page_numbers` 
- `process_no_toc`

### **2. Template Method Pattern**
`meta_processor()` orchestrates the processing pipeline with fallback mechanisms.

### **3. Composite Pattern**
Tree structure representation with recursive `nodes` property.

### **4. Adapter Pattern**
`ConfigLoader` adapts between YAML config, dict, and SimpleNamespace.

### **5. Retry Pattern**
API wrappers include exponential backoff retry logic.

## **Dependencies**

### **Core Dependencies:**
- `openai==1.101.0`: LLM API client
- `pymupdf==1.26.4`: PDF text extraction (alternative)
- `PyPDF2==3.0.1`: PDF text extraction
- `python-dotenv==1.1.0`: Environment variable management
- `tiktoken==0.11.0`: Token counting (OpenAI-specific)
- `pyyaml==6.0.2`: Configuration file parsing

### **Optional Dependencies:**
- `anthropic`: For Claude API support (if modified)
- `litellm`: For multi-provider support (if modified)

## **Output Structure**

### **JSON Output Format:**
```json
{
  "doc_name": "document-name",
  "doc_description": "Optional document description",
  "structure": [
    {
      "title": "Section Title",
      "node_id": "0001",
      "start_index": 1,
      "end_index": 5,
      "summary": "Section summary...",
      "prefix_summary": "Prefix summary for parent nodes",
      "text": "Full text content (if enabled)",
      "nodes": [
        {
          "title": "Subsection Title",
          "node_id": "0002",
          "start_index": 2,
          "end_index": 3,
          "summary": "Subsection summary..."
        }
      ]
    }
  ]
}
```

## **Extension Points**

### **1. LLM Provider Replacement**
Modify `ChatGPT_API*` functions in `utils.py` to support other providers.

### **2. PDF Parser Selection**
`get_page_tokens()` supports both PyPDF2 and PyMuPDF via `pdf_parser` parameter.

### **3. Configuration System**
`ConfigLoader` allows runtime configuration overrides.

### **4. Tree Processing Hooks**
`process_large_node_recursively()` enables custom processing for large sections.

## **Performance Considerations**

### **Token Management:**
- `max_token_num_each_node`: 20,000 tokens default
- `max_page_num_each_node`: 10 pages default
- `page_list_to_group_text()`: Smart page grouping with overlap

### **Parallel Processing:**
- `asyncio.gather()` for concurrent API calls
- `check_title_appearance_in_start_concurrent()`: Parallel title verification

### **Memory Management:**
- Streaming PDF processing with page-by-page extraction
- Tree thinning for markdown files with `tree_thinning_for_index()`

## **Error Handling**

### **Retry Logic:**
- 10 retries for API calls with 1-second delays
- Exponential backoff in production scenarios

### **Fallback Mechanisms:**
- TOC detection fallback from page numbers → no page numbers → no TOC
- `fix_incorrect_toc()` for correction of mapping errors
- `validate_and_truncate_physical_indices()` for invalid page references

### **Validation:**
- `verify_toc()` for accuracy checking
- Input validation for file paths and extensions
- Bounds checking for page indices

## **Testing Structure**

### **Test Files:**
- `tests/pdfs/`: Sample PDF documents
- `tests/results/`: Expected output structures
- `tests/markdowns/`: Sample markdown files

### **Cookbooks:**
- `cookbook/pageindex_RAG_simple.ipynb`: Basic RAG example
- `cookbook/vision_RAG_pageindex.ipynb`: Vision-based RAG example
- `cookbook/agentic_retrieval.ipynb`: Agentic retrieval patterns

## **Deployment Options**

### **1. Local Execution:**
```bash
python run_pageindex.py --pdf_path document.pdf
```

### **2. API Integration:**
Import `page_index_main()` or `md_to_tree()` functions.

### **3. Cloud Service:**
PageIndex Chat Platform, MCP integration, or enterprise deployment.

## **Architecture Summary**

PageIndex implements a **reasoning-based retrieval system** that:
1. **Replaces vector similarity** with LLM reasoning
2. **Builds hierarchical indexes** from document structure
3. **Uses tree search algorithms** for document navigation
4. **Provides explainable retrieval** with page/section references
5. **Supports multiple document types** (PDF, Markdown)
6. **Offers configurable processing** for different scenarios

The architecture is **modular and extensible**, with clear separation between:
- Document parsing (PDF/Markdown)
- LLM interaction (API wrappers)
- Structure processing (tree algorithms)
- Configuration management
- Output formatting