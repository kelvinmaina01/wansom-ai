# Lawlify Document Intelligence Skill

This skill turns any legal document into a fully analysed, searchable, editable intelligence
asset. It covers everything from the first parse (jurisdiction detection + smart prompts) to
deep forensic analysis, risk scanning, document editing, and summary card generation.

Read this SKILL.md fully before acting. For deep sub-topics, load the relevant reference file:
- `references/jurisdiction-detection.md` — EA + international jurisdiction rules, signals, law
- `references/risk-analysis.md` — risk scoring rubric, clause patterns, red/amber/green flags
- `references/editing-grammar.md` — rewrite rules, insert-clause templates, variation styles
- `references/summary-cards.md` — card schema, colour themes, visual formatting instructions

> [!NOTE]
> To trigger the visual card system in the Lawlify UI, wrap your summary/analysis units in a custom tag:
> `<smartcard title="Card Title" theme="blue|red|purple" icon="⚖️" badge="..." citation="..."> content </smartcard>`
> Use this instead of text-based box drawings for maximum visual impact.

---

## Phase 0 — Document Intake (runs immediately on open/upload)

When a document first arrives, execute ALL of the following steps before responding to the user.
Speed matters — the user should see results within seconds of opening the document.

### Step 1: Parse the document

```python
import pdfplumber, re
from pypdf import PdfReader

# Text extraction — use pdfplumber for layout-aware parsing
with pdfplumber.open(doc_path) as pdf:
    pages = []
    for i, page in enumerate(pdf.pages):
        text = page.extract_text() or ""
        tables = page.extract_tables()
        pages.append({"page": i+1, "text": text, "tables": tables})

full_text = "\n".join(p["text"] for p in pages)
page_count = len(pages)

# If text extraction yields < 100 chars per page → scanned document
avg_chars = len(full_text) / max(page_count, 1)
is_scanned = avg_chars < 100
```

If `is_scanned` is True, rasterize pages with `pdftoppm -jpeg -r 150` and use vision.
See `pdf-reading` skill for full rasterization procedure.

### Step 2: Detect jurisdiction

Load `references/jurisdiction-detection.md` and run the detection algorithm.
Return: `{ jurisdiction, legal_system, governing_law_clause, courts, confidence }`

Jurisdiction shapes EVERYTHING — which statutes to cite, which risk patterns to flag,
which clause templates to offer. Never skip this step.

### Step 3: Classify document type

Identify one primary type from:
| Type | Key signals |
|---|---|
| `employment_contract` | employer/employee, salary, termination, notice period |
| `commercial_contract` | parties, consideration, obligations, warranties, dispute |
| `court_judgment` | "JUDGMENT", "HELD", "CORAM", case number, citation |
| `court_filing` | "PLAINT", "PETITION", "AFFIDAVIT", "IN THE HIGH COURT OF" |
| `conveyancing` | "TITLE DEED", "TRANSFER", "INDENTURE", parcel number, land reference |
| `lease_agreement` | "LESSOR", "LESSEE", "TENANCY", rent, premises |
| `loan_agreement` | "LENDER", "BORROWER", principal, interest rate, default |
| `nda` | "CONFIDENTIAL", "NON-DISCLOSURE", "proprietary information" |
| `board_resolution` | "RESOLVED", "DIRECTORS", quorum, minutes |
| `statutory_instrument` | "GAZETTE", "REGULATION", "MADE UNDER SECTION" |

### Step 4: Extract document fingerprint

```python
fingerprint = {
    "title": extract_title(pages[0]["text"]),
    "parties": extract_parties(full_text),           # named entities, "BETWEEN...AND"
    "date": extract_document_date(full_text),
    "jurisdiction": jurisdiction,
    "doc_type": doc_type,
    "page_count": page_count,
    "section_headings": extract_headings(full_text), # numbered/capitalised headings
    "defined_terms": extract_defined_terms(full_text), # "X" means / "X" shall mean
    "governing_law": governing_law_clause,
    "key_dates": extract_key_dates(full_text),       # deadlines, effective dates
    "monetary_values": extract_monetary_values(full_text),
}
```

### Step 5: Generate 4 smart prompt cards

Based on fingerprint + doc_type, generate 4 contextually relevant prompt cards.
Do NOT always use the generic defaults. Tailor them to what THIS document actually contains.

**Selection logic:**
```
if doc_type == "court_judgment":
    suggest: ["Summarise the ratio decidendi", "What orders were granted?",
              "Identify the legal principles applied", "Are there dissenting opinions?"]

elif doc_type == "employment_contract":
    suggest: ["What are the termination provisions?", "Summarise notice and severance terms",
              "Flag any non-compete clauses", "Does this comply with [jurisdiction] Employment Act?"]

elif doc_type == "conveyancing":
    suggest: ["Summarise the property description and title", "Are there encumbrances or caveats?",
              "Check the transfer conditions", "Identify stamp duty obligations"]

elif doc_type == "commercial_contract":
    suggest: ["What are the payment terms and penalties?", "Summarise the dispute resolution clause",
              "Flag any unfair indemnity provisions", "What warranties does each party give?"]

# fallback for any type:
else:
    suggest: ["Summarise the key terms", "What are the main obligations of each party?",
              "Flag any high-risk clauses", "What is the governing law and dispute mechanism?"]
```

Return the 4 cards as structured objects:
```json
[
  { "id": "card_1", "icon": "⚖️", "label": "Summarise ratio decidendi",
    "prompt": "Summarise the ratio decidendi and key legal findings in this judgment.",
    "theme": "blue" },
  ...
]
```

Card themes map to Lawlify colours: `red` (primary brand / critical / urgent — Lawlify's signature
colour), `blue` (analysis), `purple` (AI/smart), `amber` (risk/caution), `teal` (extraction/data),
`green` (positive/compliant), `gray` (metadata/structural).

### Step 6: Run the quick risk scan

Load `references/risk-analysis.md` and run the quick scan (not the deep scan — that is triggered
separately). The quick scan produces a traffic-light summary:

```
🔴 CRITICAL (n)  — clauses that expose the client to immediate legal risk
🟡 MEDIUM (n)   — provisions that are unfavourable but not immediately dangerous
🟢 STRONG (n)   — well-drafted protective clauses working in the client's favour
```

Surface this in the sidebar risk panel immediately. The deep scan runs when the user clicks it.

### Step 7: Deliver the intake response

After completing steps 1–6, respond with:
1. **Document fingerprint card** (title, type, parties, date, jurisdiction, page count)
2. **4 smart prompt cards** (rendered as the card grid)
3. **Quick risk traffic lights** (🔴/🟡/🟢 counts with top 1 critical issue surfaced)
4. A one-sentence orientation: "This is a [type] governed by [jurisdiction] law, dated [date],
   between [parties]. I've identified [n] areas worth reviewing."

Do not ask the user what they want to do — show the cards and let them click.

---

## Phase 1 — Summary Generation

**Triggered by:** "Summarise", "Key Points", "Overview", card click, or any request for a document
summary.

### Summary card structure

Each summary must be delivered as a **visual card set** — not as a plain text wall.
Load `references/summary-cards.md` for the full card schema and colour theme rules.

**Mandatory cards for every summary:**

```
┌─ DOCUMENT OVERVIEW ──────────────────────────────────────────┐  theme: blue
│  Type · Parties · Date · Jurisdiction · Pages                │
└──────────────────────────────────────────────────────────────┘

┌─ CORE OBLIGATIONS ───────────────────────────────────────────┐  theme: teal
│  What each party must do. Bullet list max 5 per party.       │
└──────────────────────────────────────────────────────────────┘

┌─ KEY DATES & DEADLINES ──────────────────────────────────────┐  theme: amber
│  Timeline of all dates, deadlines, and triggers extracted.   │
└──────────────────────────────────────────────────────────────┘

┌─ FINANCIAL TERMS ────────────────────────────────────────────┐  theme: green (or red if onerous)
│  All monetary values, rates, penalties, payment schedules.   │
└──────────────────────────────────────────────────────────────┘

┌─ RISK SUMMARY ───────────────────────────────────────────────┐  theme: red
│  Top 3 risks. Each with: issue / clause ref / recommendation. │
└──────────────────────────────────────────────────────────────┘

┌─ GOVERNING LAW & DISPUTE RESOLUTION ─────────────────────────┐  theme: purple
│  Jurisdiction · Applicable law · Forum · Mechanism            │
└──────────────────────────────────────────────────────────────┘
```

**For court judgments**, replace the above with:
- Case Details card (parties, court, coram, case number, date decided)
- Issues Framed card (what legal questions the court was asked to resolve)
- Ratio Decidendi card (the binding legal reasoning — quote the key paragraphs)
- Orders Granted card (exactly what the court ordered, verbatim where possible)
- Obiter Dicta card (if any)
- Dissent card (if any)

**Rendering rules:**
- Each card has: coloured left border, icon, bold title, structured content
- Max 5 bullet points per card — if more, nest with sub-bullets
- Monetary values always formatted: KES 1,200,000 / USD 50,000 / UGX 3,500,000
- Dates always formatted: 15 March 2024 (never 15/3/24 or 2024-03-15)
- Citations formatted: [Page 12, ¶3] or [Clause 7.2] — always linkable
- Never use tables inside cards for the main summary — use structured bullets

---

## Phase 2 — Forensic Document Analysis

**Triggered by:** "Analyse", "Deep analysis", "Find risks", "Check this contract", "Themes",
the 🛡️ risk icon, or any request for detailed examination beyond summary.

Load `references/risk-analysis.md` before running this phase.

### Analysis output structure

**Section 1: Clause-by-clause audit**
Walk through every major clause. For each:
```
Clause [X.X] — [Clause Title]
Status: 🔴 HIGH RISK / 🟡 MEDIUM / 🟢 COMPLIANT / ⚠️ AMBIGUOUS
Finding: [What the clause says and why it matters]
EA Law Note: [Relevant EA statute, case law, or regulatory requirement]
Recommendation: [What the lawyer should do — accept / negotiate / redraft]
```

**Section 2: Missing protections**
List protections that SHOULD be in this document type but ARE NOT:
```
❌ [Missing clause] — Required by [statute/best practice] — Risk: [consequence if absent]
```

**Section 3: Defined terms audit**
Extract all defined terms. Flag:
- Terms defined but never used
- Terms used but never defined
- Circular definitions
- Definitions that conflict with EA statute definitions

**Section 4: Cross-reference check**
Identify internal cross-references to clauses, schedules, annexures.
Flag broken references (refers to Clause 5.3 which doesn't exist, etc.)

**Section 5: Jurisdiction compliance check**
Load the jurisdiction profile from `references/jurisdiction-detection.md`.
Check against: mandatory statutory provisions, employment law minimums, consumer protection
requirements, land law formalities, court filing requirements — whichever apply.

---

## Phase 3 — Semantic Search

**Triggered by:** "Where does it say", "Find the clause about", "Search for", "Where is",
"Show me where", or any location query about document content.

### Search procedure

```python
def semantic_search(query: str, full_text: str, pages: list) -> list:
    """
    1. Extract key concepts from query (not just keywords)
    2. Search for: exact phrase matches, synonym matches, conceptual matches
    3. Return: page number, paragraph excerpt, confidence score, highlight coordinates
    """
    # Keyword search — fast, exact
    keyword_hits = find_keyword_matches(query, pages)

    # Semantic search — concept-level, finds related passages
    # e.g. "fair hearing" finds passages about "audi alteram partem",
    # "right to be heard", "natural justice" even without exact words
    semantic_hits = find_concept_matches(query, pages, jurisdiction_context)

    return merge_and_rank(keyword_hits, semantic_hits)
```

**Response format for search results:**
```
Found [n] relevant passages for "[query]":

📍 Page [N], Clause [X.X]:
"[Relevant excerpt — the exact text, 1-3 sentences]"
→ [Brief note on why this is relevant]

📍 Page [N], Clause [X.X]:
...
```

Always return the page number and clause reference so the viewer can scroll to it.
Never return a search result without a location anchor.

---

## Phase 4 — Document Editing (Selection Intelligence)

**Triggered by:** Text selection + FAM action, "Rewrite this", "Add a clause", "Insert paragraph",
"Replace section [X]", "Make this simpler", "Draft a [clause type]".

### 4A — Rewrite / Replace

When the user selects text and clicks Rewrite, or asks to rewrite a passage:

Generate exactly 3 variations. Label them clearly:

```
VARIATION 1 — PROFESSIONAL (court filing / formal correspondence style)
[Rewritten text — formal register, complete sentences, legal precision]

VARIATION 2 — SIMPLE (client explanation / plain language style)
[Rewritten text — plain English, no jargon, accessible to a non-lawyer]

VARIATION 3 — PRO-CLIENT (demand letter / advocacy style)
[Rewritten text — positions the client strongly, protective language, favourable framing]
```

Rules for all variations:
- Preserve all factual content — do not change dates, names, monetary values
- Preserve all defined terms — use the same defined terms as the original
- Apply jurisdiction-appropriate formalities (e.g. "KSHS" not "USD" for Kenya contracts)
- Flag if a rewrite changes the legal meaning: "⚠️ Note: this variation alters the obligation
  from absolute to best-endeavours — confirm with client before accepting."

### 4B — Insert Clause / Add Paragraph

When the user asks to add content:

```
Step 1: Identify insertion point — before/after which clause, at end of section, etc.
Step 2: Identify what type of content is needed (protective clause, recital, definition, schedule)
Step 3: Draft the content using EA-appropriate precedent language
Step 4: Show the draft with [INSERTED] markers so the user can see exactly what is new
Step 5: Offer to adjust: "I can make this stricter, more balanced, or softer — just ask."
```

**Common clause templates to offer proactively** when Insert is triggered:
- Force majeure (COVID / political events version for EA)
- Dispute resolution — tiered (negotiation → mediation → arbitration → court)
- Confidentiality / NDA clause
- IP ownership and assignment
- Limitation of liability cap
- Termination for convenience vs. for cause
- Governing law and jurisdiction
- Entire agreement / merger clause
- Severability
- Data protection (aligned to Kenya Data Protection Act 2019 / Uganda DPPA 2019)

Load `references/editing-grammar.md` for full clause templates and drafting grammar.

### 4C — Add Annotation

When the user selects text and clicks Annotate:
```
Create annotation object:
{
  "id": uuid,
  "user": current_user,
  "timestamp": now,
  "page": page_number,
  "coordinates": { "x": ..., "y": ..., "width": ..., "height": ... },
  "selected_text": selected_text,
  "note": user_note or AI_suggested_note,
  "type": "risk" | "query" | "approved" | "for_client" | "flag",
  "ai_note": jurisdiction_relevant_observation
}
```

If user clicks Annotate without typing a note, auto-generate an AI annotation:
e.g. "This indemnity clause is uncapped — unusual in EA commercial contracts. Consider
negotiating a cap at contract value."

---

## Phase 5 — Jurisdiction Intelligence

**Triggered by:** Jurisdiction detection (Phase 0), any question about applicable law,
compliance checks, or statute references.

Load `references/jurisdiction-detection.md` for:
- Signal dictionary (place names, currency, court names, statute references, case citation formats)
- Jurisdiction profiles: Kenya, Uganda, Tanzania, Rwanda, Ethiopia, regional + international
- Relevant statutes per document type per jurisdiction
- Citation format rules (e.g. [2024] eKLR for Kenya, UGSC for Uganda Supreme Court)

**When citing law, always:**
1. Name the statute in full first time: Employment Act (Cap. 226, Laws of Kenya)
2. Short form after: Employment Act
3. Include section: s.41 Employment Act
4. For cases: Party v Party [Year] Court Citation (e.g. Mwangi v Safaricom [2019] eKLR)
5. Never cite a statute that does not exist in the identified jurisdiction

---

## Output Standards

### Tone
- Direct, expert, advocate-grade. Not tentative or hedged.
- "This clause is unenforceable under s.17 LCA" — not "this clause might potentially raise issues"
- Always state the legal basis for every finding
- For client-facing content: plain, clear, non-threatening

### Citation anchors
Every reference to document content must include a location:
- `[p.12]` for page reference
- `[cl.7.2]` for clause reference
- `[sch.3]` for schedule reference
- Never make a finding without anchoring it to a specific location in the document

### Card colours (Lawlify theme)
Colour is semantic — it tells the lawyer what kind of information they are reading before
they read a word. Never assign arbitrarily. Full rules in `references/summary-cards.md`.

| Colour | Role | Use for |
|---|---|---|
| Red | PRIMARY BRAND | Critical risks, statutory violations, missing protections, primary CTAs, brand elements |
| Blue | Analysis | Neutral document info, clause explanation, search results, case details, metadata |
| Purple | AI intelligence | AI-generated insights, smart prompt cards, rewrite outputs, ratio decidendi, jurisdiction badges |
| Teal | Extracted data | Financial terms, obligations, defined terms, structured data pulled from document |
| Amber | Caution | Medium risks, deadlines, ambiguous clauses, auto-renewal warnings, draft status |
| Green | Positive | Compliant clauses, strong protections, favourable findings, approved annotations |
| Gray | Structure | Document metadata, navigation chrome, user annotations, section headings, audit trail |

### What NOT to do
- Never invent statutes, case citations, or section numbers
- Never summarise without reading the actual document text
- Never give generic advice — always ground it in this specific document
- Never skip the jurisdiction detection step — it changes everything
- Never produce a wall of text — always use cards, structured bullets, clear hierarchy
- Never let a summary exceed what can be read in 3 minutes — be ruthless about what matters
