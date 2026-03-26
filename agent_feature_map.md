# Lawlify AI: Agent Output & Capability Map (PRD Blueprint)

This document maps the specific functions, inputs, and outputs for all AI agents in the Lawlify system. It integrates the **Hybrid Model Strategy** (Gemini + DeepSeek) and **Multimodal Extraction** capabilities.

---

## 🔍 1. CounselAgent: The "Deep Researcher"
**Goal**: provide 98% precise legal opinions grounded in real-time search and statutory text.

| Feature | Input | Function | Output |
| :--- | :--- | :--- | :--- |
| **Deep Legal Research** | Legal Query + Jurisdiction | Gemini Search + PageIndex RAG + DeepSeek Reasoning. | Reasoning response with verified citations & links. |
| **Video Evidence Audit** | YouTube/Uploaded Video URL | Gemini 1.5 Pro video-masking & temporal reasoning. | Summary of events with **Timecode Citations** (e.g., [12:45]). |
| **Cross-Jurisdictional Compare** | Multi-Country Query | Logic-routing to compare statutes across 8 EA countries. | Tabular comparison of legal requirements. |

---

## 📄 2. DrafterAgent: The "Document Architect"
**Goal**: Convert raw case facts into ready-to-file legal documents.

| Feature | Input | Function | Output |
| :--- | :--- | :--- | :--- |
| **Multimodal Extraction** | Scanned PDFs / Scraps of paper | Gemini Flash Vision + Docling Layout Parsing. | Structured "Case Fact Bundle" (JSON). |
| **Automated Drafting** | Case Bundle + Template ID | DeepSeek R1 for logical drafting + Template injection. | Formatted Markdown for the "Cowork Canvas". |
| **Compliance Flagging** | Drafted Document | Logic check against the specific High Court Rules. | Warning flags for missing mandatory fields. |

---

## 🎙️ 3. AmaniAgent: The "AI Mentor"
**Goal**: High-fidelity simulation for training and professional development.

| Feature | Input | Function | Output |
| :--- | :--- | :--- | :--- |
| **Socratic Mentorship** | Chat/Voice Snippet | Socratic instruction set (probing vs answering). | Probing questions to guide self-discovery. |
| **Mock Trial Simulation** | Oral Submissions | Agent acts as "Mock Judge" (Strict/Formal). | Judicial pushback and logic challenges. |
| **Performance Scorecard** | Full Session Transcript | Gemini Flash aggregate analysis (JSON). | Grades (0-100) on logic, law, and tone. |

---

## 🎨 4. UXGeneratorAgent: The "Persona Builder"
**Goal**: Infinite scalability of specialized legal associates.

| Feature | Input | Function | Output |
| :--- | :--- | :--- | :--- |
| **Persona Synthesis** | "I need a Maritime law expert" | Generating detailed system instructions and visual theme. | **Persona Manifest (JSON)**: Instructions, Practice areas, Colors. |
| **Jurisdictional Mapping** | Persona Name | Mapping specific EA countries to the specialist soul. | Correctly scoped jurisdictional metadata. |

---

## 🛠️ Global "Core Engine" Functions
1.  **Orchestrator (The Dispatcher)**: Automatically picks Gemini for research and DeepSeek for final drafting to save costs.
2.  **Safety Guardrails**: Real-time checking to ensure no generic "GPT Hallucinations" bypass the PageIndex statutory verification.
3.  **Multilingual Support**: Handling Swahili, French (DRC/Burundi), and English legal jargon across the EA region.
