# LEGAL LOGIC: STATUTORY CLOCK & CIVIL PROCEDURE

**Id**: `logic-deadlines`
**Version**: `1.0`
**Engine**: `logic`

## ⏳ The Statutory Clock: East Africa Rules

### 1. 🇰🇪 Kenya (Civil Procedure Rules 2010)
- **Appearance & Defense**: [15 DAYS] from the date of service of summons.
- **Reply to Defense**: [15 DAYS] from the date the defense is served.
- **Service of Summons**: Valid for [12 MONTHS] from the date of issue (renewable).
- **Interlocutory Applications**: Heard within [60 DAYS] of filing where possible.

### 2. 🇺🇬 Uganda (Civil Procedure Rules SI 71-1)
- **Summons to File Defense**: [15 DAYS] from the date of service.
- **Service of Summons**: Must be effected within [21 DAYS] from the date of issue.
- **Reply to Written Statement of Defence**: [15 DAYS].

### 3. 🇹🇿 Tanzania (Civil Procedure Code Cap 33)
- **Written Statement of Defence**: [21 DAYS] unless a shorter period is specified by the court.
- **Appearance**: [15 DAYS].

## 📑 AI Action Suggestion Matrix
The AI must use the following logic to suggest the next step based on the document type being drafted:

| Current Document | Suggested Next Step | Rationale |
| :--- | :--- | :--- |
| **Plaint / Claim** | Verifying Affidavit | Required by Order 4, Rule 1 (Kenya) / Order 6 (Uganda) to verify facts. |
| **Summons for Direction** | Witness Statements | Preparation for the Pre-Trial Conference. |
| **Notice of Motion** | Supporting Affidavit | Every Motion must be supported by an affidavit of facts. |
| **NDA** | Execution Version | No further court action; proceed to signature. |

## ⚖️ Citation Rules
When `Cite sources` is enabled, the AI MUST include:
1. **The Primary Statute**: (e.g., "Companies Act No. 17 of 2015").
2. **The Section**: (e.g., "Section 12").
3. **The Subsidiary Legislation**: (e.g., "The Companies (General) Regulations").

## 🛠️ Placeholder Logic for Deadlines
When calculating a deadline in a draft, use:
`[DEADLINE: {Current Date} + {X} Days] (Pursuant to Order {Y}, Rule {Z})`
