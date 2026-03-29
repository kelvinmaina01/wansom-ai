# Summary Cards Reference

## Card System Design

Lawlify summary cards are visual, scannable, colour-coded intelligence units.
They replace walls of text. Every major output — summary, risk, analysis — must
be expressed as cards, not paragraphs.

---

## Card Schema

Each card object:
```typescript
interface LawlifyCard {
  id: string;                     // unique card id
  theme: CardTheme;               // controls colour
  icon: string;                   // emoji or icon code
  title: string;                  // bold header — max 40 chars
  badge?: string;                 // optional pill (e.g. "🔴 CRITICAL", "Kenya Law")
  content: CardContent[];         // structured content blocks
  citation?: string;              // document reference e.g. "[cl.7.2]" or "[p.12]"
  action?: CardAction;            // optional CTA button
  tier?: "all" | "enterprise";    // who can see this card
}

type CardTheme = "red" | "blue" | "purple" | "teal" | "amber" | "green" | "gray";

interface CardContent {
  type: "bullets" | "table" | "quote" | "metric" | "timeline" | "checklist";
  data: any;
}

interface CardAction {
  label: string;
  prompt: string;  // the prompt to send when user clicks
}
```

---

## Theme → Colour Mapping

**Red is Lawlify's primary brand colour.** Every other colour has a precise semantic role.
Colour is not decoration — it tells the lawyer what kind of information they are looking at
before they read a single word. Never assign a colour arbitrarily.

| Theme | Border | Background | Badge text |
|---|---|---|---|
| `red` | #E24B4A | #FCEBEB | #791F1F |
| `blue` | #378ADD | #E6F1FB | #0C447C |
| `purple` | #7F77DD | #EEEDFE | #3C3489 |
| `teal` | #1D9E75 | #E1F5EE | #085041 |
| `amber` | #BA7517 | #FAEEDA | #633806 |
| `green` | #639922 | #EAF3DE | #27500A |
| `gray` | #888780 | #F1EFE8 | #444441 |

---

## Colour Usage Rules — When to Use Each

### 🔴 Red — Primary Brand / Critical
**Hex:** #E24B4A (border) · #FCEBEB (bg) · #791F1F (text)

Red is the Lawlify brand. It carries authority and urgency. Use it for:
- **Critical risk cards** — any finding scored 20–25 on the risk rubric
- **Missing protections** — clauses that SHOULD exist but do not
- **Void / unenforceable provisions** — clauses a court would strike down
- **Statutory breach** — document violates a mandatory legal requirement
- **Primary action buttons** — "Analyse", "Run risk scan", "Sign", main CTAs
- **Brand header elements** — the Lawlify logo bar, primary navigation
- **Subscribe / upgrade banners** — the enterprise upsell strip
- **Intake alert** — if a document has ≥1 critical risk, the intake response header is red

**Do NOT use red for:** anything that is merely cautionary, informational, or time-sensitive
without legal urgency. Red means "this needs attention now or there will be legal consequences."

---

### 🔵 Blue — Analysis & Document Intelligence
**Hex:** #378ADD (border) · #E6F1FB (bg) · #0C447C (text)

Blue is the colour of neutral, structured legal information. Use it for:
- **Document Overview card** — the fingerprint card always shown first
- **Case Details card** (court judgments) — parties, court, coram, citation
- **Clause-by-clause analysis** — when a clause is being explained (not judged)
- **Semantic search results** — passages returned by the AI search engine
- **Cross-reference results** — "this clause refers to clause 5.3"
- **Document metadata** — page count, file size, upload date, version
- **Navigation elements** — page tracker, zoom controls, sidebar tabs
- **"Identify" prompt card** — the card that says "Identify what stands out"
- **Informational tooltips** — statute definitions, legal term explanations

**Do NOT use blue for:** risk findings, AI-generated suggestions, or time-sensitive items.
Blue = facts about the document, not judgments about it.

---

### 🟣 Purple — AI Intelligence & Smart Features
**Hex:** #7F77DD (border) · #EEEDFE (bg) · #3C3489 (text)

Purple is the colour of AI-generated intelligence — things the AI derived, inferred,
or created that go beyond what is literally in the document. Use it for:
- **Smart prompt cards** — the 4 auto-generated intake prompts
- **Ratio decidendi card** (court judgments) — the AI's extraction of binding legal principle
- **Governing Law & Dispute Resolution card** — AI-identified legal framework
- **AI Semantic Search** — the search mode indicator and results header
- **"Summarise" prompt card** — the card that triggers AI summary
- **Rewrite variations** — the Professional / Simple / Pro-Client output cards
- **Insert Clause suggestions** — clauses the AI recommends inserting
- **AI annotations** — notes the AI auto-generated (user annotations stay gray)
- **S.A.V.R.E. active state** — the glow indicator when audio sync is running
- **Subscribe banner** — "Unlock full access" strip (enterprise upsell)
- **Obiter dicta card** (court judgments) — AI-identified non-binding remarks
- **Jurisdiction confidence badge** — "I've identified this as Kenya law (94% confidence)"

**Do NOT use purple for:** raw document data, risk findings, or anything the user typed.
Purple = the AI is speaking, not the document.

---

### 🩵 Teal — Extracted Data & Financial Terms
**Hex:** #1D9E75 (border) · #E1F5EE (bg) · #085041 (text)

Teal is the colour of structured data extracted from the document — numbers, names,
terms, lists. Use it for:
- **Financial Terms card** — monetary values, payment schedules, interest rates
- **Core Obligations card** — what each party must do (extracted duties)
- **Defined Terms card** — the glossary of terms defined in the document
- **Key Parties card** — extracted party names, registration numbers, addresses
- **Orders Granted card** (court judgments, when favourable) — what the court ordered
- **Timeline / Key Dates card** (secondary colour — amber leads, teal for data rows)
- **Clause extraction results** — when pulling a specific clause the user asked for
- **Cross-document comparison** — extracted matching/conflicting clauses across files
- **"Create report" output** — the drafted report card header
- **Multi-document analysis results** — data pulled across the document vault

**Do NOT use teal for:** risk analysis, AI suggestions, or document metadata.
Teal = extracted facts and structured data from within the document.

---

### 🟡 Amber — Caution, Deadlines & Medium Risk
**Hex:** #BA7517 (border) · #FAEEDA (bg) · #633806 (text)

Amber is the colour of things that need attention but are not yet critical. Use it for:
- **Key Dates & Deadlines card** — all extracted dates, expiry dates, notice windows
- **Medium risk findings** — clauses scored 10–19 on the risk rubric
- **Ambiguous provisions** — clauses whose meaning is unclear or disputed
- **Caution badges** — "⚠️ Unusual clause", "⚠️ Non-standard term"
- **Notice period warnings** — "This contract auto-renews in 14 days"
- **Stamp duty not assessed** — document may be inadmissible if not stamped
- **Jurisdiction confidence 70–89%** — "I believe this is Kenya law — please confirm"
- **Penalty clause flags** — pre-determined damages that may be excessive
- **"Analyse themes" prompt card** — the card that triggers thematic analysis
- **Draft status indicator** — document is marked DRAFT, not executed
- **Conflicting clause pairs** — two clauses that appear to contradict each other

**Do NOT use amber for:** critical legal violations (use red) or clearly positive findings
(use green). Amber = watch this, it might become a problem.

---

### 🟢 Green — Compliant, Strong & Positive
**Hex:** #639922 (border) · #EAF3DE (bg) · #27500A (text)

Green is the colour of things working in the client's favour. Use it for:
- **Strong clause findings** — well-drafted protective provisions
- **Statutory compliance confirmed** — document meets all mandatory requirements
- **Favourable Orders Granted card** (court judgments won by client)
- **Financial Terms card** — when payment terms are standard / favourable to client
- **"Compliant" status badges** — individual clause audit result
- **Insurance / indemnity adequately capped** — liability exposure is limited
- **Dispute resolution well-drafted** — tiered, enforceable, correct seat
- **Data protection clause present** — DPA 2019 compliance confirmed
- **LCB consent obtained** — land transaction is properly authorised
- **"Key Points" prompt card** — the card that surfaces the document's strengths
- **Annotation type: approved** ✅ — lawyer has reviewed and accepted a clause

**Do NOT use green for:** anything that still has risks even if largely positive.
Green = this clause is protecting the client, no action needed.

---

### ⬜ Gray — Structure, Metadata & Secondary
**Hex:** #888780 (border) · #F1EFE8 (bg) · #444441 (text)

Gray is the colour of structural and reference information that supports the analysis
but is not itself a finding. Use it for:
- **Document metadata** — upload time, file size, page count, version number
- **Defined Terms card** — the glossary listing (data, not a judgment)
- **Section headings** — numbered clause headings in the document tree
- **Sidebar navigation** — page thumbnails, bookmarks tab, AI tools tab
- **3-dot menu items** — hide sources, clear history, copy chat
- **User annotations** — notes the lawyer typed themselves (AI notes are purple)
- **Exhibit attachments** — linked documents in the vault
- **"Secondary" prompt cards** — fallback prompt cards when doc type is unknown
- **Timestamp / version history** — audit trail entries
- **Inactive/disabled states** — features not available at current tier
- **Pagination** — page N of N indicator at bottom of viewer

**Do NOT use gray for:** anything that requires the lawyer's attention or action.
Gray = reference information, structural chrome, user-generated content.
