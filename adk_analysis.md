# Google ADK: Core Concepts for Lawlify Legal Engine

Based on the **Agent Development Kit (ADK)** transcript, we can shift from "Simple LLM Calls" to a **Deterministic Orchestration Architecture**. This is the key to achieving 98% precision while keeping costs at zero.

## 🚀 1. Key ADK Concepts for Lawlify

### A. Code-First vs. Config-Based
- **Insight**: Config-based AI is "fuzzy". ADK promotes **Code-First** orchestration.
- **Application**: We won't just "ask" a model to research and draft. We will write code (using Pythonic constructs or JS classes) that **forces** the agent to:
    1. Call Search sub-agent.
    2. Pass results to Verification sub-agent.
    3. Finalize with the Drafting sub-agent.

### B. Workflow Agents (The "Guardrails")
ADK defines three specialized agent types that are perfect for Lawlify:
| ADK Agent Type | Lawlify Application |
| :--- | :--- |
| **Sequential Agent** | **The Research Loop**: Run `Search` -> then `Verify` -> then `Draft`. Ensures no step is skipped. |
| **Parallel Agent** | **Multi-Jurisdictional Sweep**: Compare Kenya, Uganda, and Tanzania statutes simultaneously to save time. |
| **Loop Agent** | **Iterative Drafting**: Re-run the Drafter until the "Compliance Score" meets the 98% threshold. |

### C. State Passing (`output_key`)
- **Insight**: ADK uses `output_key` to share memory between sub-agents.
- **Application**: The `CounselAgent` (Root) will use a `generated_knowledge` key. The Researcher (Gemini) puts data into this key, and the Reasoner (DeepSeek) pulls it out. This prevents the "Telephone Game" where AI loses facts between steps.

---

## 🏗️ Proposed Lawlify Architecture (ADK-Inspired)

We can structure our **CounselAgent** as a "Modular Machine":

1.  **Stage 1: ScriptWriter (Researcher)**
    - **Tool**: Google Search + PageIndex.
    - **Goal**: Find the raw law.
2.  **Stage 2: Visualizer (Evidence Auditor)**
    - **Multimodal**: If a video or PDF is provided, this sub-agent extracts the facts.
3.  **Stage 3: Formatter (Legal Reasoner)**
    - **Model**: DeepSeek R1.
    - **Goal**: Synthesize into a final opinion with 98% precision.

---

## 🛠️ Infrastructure & Services

### 💾 Artifact Storage
- **Concept**: ADK suggests a dedicated "Artifact Service" for files.
- **Lawlify Plan**: We will use a dedicated "Context Cache" in Supabase to store "Case Fact Bundles". Any agent (Counsel or Drafter) can call this bundle to maintain absolute consistency.

### 🔄 Event Loops
- **Concept**: Every action is an "Event" (e.g., `ToolCalling`, `StateUpdated`).
- **Lawlify Plan**: Our UI will stream these events. When a user asks a complex question, they will see:
    - `[Counsel] Searching Kenya Constitution...`
    - `[Counsel] Verifying against PageIndex...`
    - `[Counsel] Finalizing Legal Opinion...`
- **Why?**: This transparency builds **Trust**, which is vital for legal practitioners.

## ⚖️ Precision Target: 98%
By using ADK's **Loop Agent** pattern, we can implement an "Internal Audit" where a separate **Verifier Agent** reviews the final draft. If it finds a mismatch, it triggers a "For-Loop" to re-draft. This "Self-Correction" is how we hit 98% precision.

---

## 👁️ The "Thinking" Console (Visibility & Trust)

How do we let users "see" the AI working? We will implement the **ADK Event Stream** model in the Lawlify UI.

### 1. The Reasoning Block (CoT)
- **Concept**: DeepSeek R1 (our reasoner) outputs a `<think>` block.
- **Lawlify UI**: We will parse this and display it in an expandable **"Legal Reasoning"** bubble. This allows lawyers to see the *logic* before they accept the *advice*.

### 2. The Agent Timeline (Transfers)
- **Concept**: ADK streams atomic "Events".
- **Lawlify UI**: A subtle sidebar or "Live Status" pill will show the agent hopping:
    - 🟢 `Counsel: Understanding Query...`
    - 🔵 `Researcher: Searching Kenya Revenue Authority...`
    - 🟣 `Verifier: Checking against Section 5 of the Act...`
    - 🟡 `Drafter: Synthesizing Final Opinion...`

### 3. Real-Time Compatibility
- **Backend**: We will use **Server-Sent Events (SSE)** via our Node.js service to stream these events to the frontend as they happen.
- **Frontend**: A custom `ReasoningComponent.tsx` will handle the "streaming typewriter" effect for both the thoughts and the final text.
