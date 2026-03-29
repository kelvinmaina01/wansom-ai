# Jurisdiction Detection Reference

## Detection Algorithm

Run in order. Stop at first high-confidence match. If confidence < 70%, surface the detected
jurisdiction to the user and ask them to confirm before proceeding.

### Priority 1 — Explicit governing law clause

Search for patterns:
```
"governed by the laws of [Country/State]"
"subject to the laws of [Country/State]"
"construed in accordance with [Country] law"
"jurisdiction of the courts of [Country/City]"
"this Agreement shall be governed by"
```
If found → extract jurisdiction. Confidence: 95%.

### Priority 2 — Court header / case caption

Search page 1 for:
```
"IN THE HIGH COURT OF [COUNTRY] AT [CITY]"
"IN THE COURT OF APPEAL OF [COUNTRY]"
"IN THE SUPREME COURT OF [COUNTRY]"
"REPUBLIC OF [COUNTRY]"
"[COUNTRY] GAZETTE"
```
Map to jurisdiction. Confidence: 95%.

### Priority 3 — Statute references

Scan for statute signals by jurisdiction:

| Signal | Jurisdiction |
|---|---|
| "Cap. [N], Laws of Kenya" / "Kenya Gazette" / "eKLR" | Kenya |
| "Laws of Uganda" / "Uganda Gazette" / "UGSC" / "UGCA" | Uganda |
| "Laws of Tanzania" / "Tanzania Gazette" / "TZCA" | Tanzania |
| "Laws of Rwanda" / "Official Gazette of Rwanda" | Rwanda |
| "Ethiopian Law" / "Federal Negarit Gazette" / "Federal Democratic Republic" | Ethiopia |
| "Companies Act 2006" / "English law" / "UK Gazette" | England & Wales |
| "UAE Civil Code" / "DIFC" / "Abu Dhabi" | UAE |
| "UNCITRAL" / "ICC Rules" / "LCIA" / "ICSID" | International Arbitration |

### Priority 4 — Currency signals

| Currency | Likely jurisdiction |
|---|---|
| KES / Ksh / Kenya Shillings | Kenya |
| UGX / Uganda Shillings / Ush | Uganda |
| TZS / Tanzania Shillings / Tshs | Tanzania |
| RWF / Rwandan Francs | Rwanda |
| ETB / Birr | Ethiopia |
| USD / $ (without other signals) | International / multi-jurisdictional |
| GBP / £ | England & Wales |

### Priority 5 — Place names, court names, party names

Scan for:
- City names (Nairobi, Kampala, Dar es Salaam, Kigali, Addis Ababa, Mombasa, etc.)
- Court names (Milimani Law Courts, High Court at Nakuru, etc.)
- Regulatory bodies (KRA, URA, TRA, NHIF, NSSF Kenya vs NSSF Uganda)
- Land registration signals (Land Reference No. → Kenya, Block/Plot → Uganda/Tanzania)

---

## Jurisdiction Profiles

### 🇰🇪 Kenya

**Legal system:** Common law (based on English law), customary law recognised.
**Constitution:** Constitution of Kenya 2010 (CoK 2010).
**Key courts:** Supreme Court → Court of Appeal → High Court → Employment & Labour Relations
Court → Environment & Land Court → Magistrates' Courts → Small Claims Court.
**Case citation format:** Party v Party [Year] eKLR (e.g. Mwangi v Kenya Power [2021] eKLR)
**Statute citation:** Short title (Cap. number, Laws of Kenya) e.g. Employment Act (Cap. 226)

**Key statutes by document type:**

*Employment contracts:*
- Employment Act (Cap. 226)
- Labour Relations Act (Cap. 233)
- Work Injury Benefits Act (Cap. 236)
- National Social Security Fund Act
- National Hospital Insurance Fund Act
- Notice requirements: s.35 Employment Act — minimum notice periods by grade

*Commercial contracts:*
- Law of Contract Act (Cap. 23)
- Sale of Goods Act (Cap. 31)
- Consumer Protection Act 2012
- Competition Act 2010
- Public Procurement and Asset Disposal Act 2015 (if public entity party)

*Conveyancing:*
- Land Act 2012
- Land Registration Act 2012
- National Land Commission Act 2012
- Physical and Land Use Planning Act 2019
- Stamp Duty Act (Cap. 480) — check current rates
- Land parcel format: Land Reference No. [N]/[N] or Parcel No. [N]

*Financial / Loan:*
- Banking Act (Cap. 488)
- Microfinance Act 2006
- Central Bank of Kenya Act
- Interest must comply with: no compound interest on compound interest (Judicature Act s.26)

*Data protection (any document type):*
- Data Protection Act 2019
- ODPC registration requirements

**Common mandatory clauses (risk if absent):**
- Employment: formal offer letter terms, statutory deductions clause, disciplinary procedure reference
- Land: stamp duty acknowledgment, caution/caveat status, consent of Land Control Board (agricultural land)
- Loan: Truth in Lending disclosure, CBK-compliant interest statement

---

### 🇺🇬 Uganda

**Legal system:** Common law (based on English law), customary law recognised.
**Constitution:** Constitution of Uganda 1995 (as amended).
**Key courts:** Supreme Court → Court of Appeal (Constitutional Court) → High Court →
Chief Magistrates' Court → Magistrates' Courts.
**Case citation format:** Party v Party [Year] UGSC/UGCA/UGHC N (e.g. Byamugisha v AG [2020] UGSC 5)
**Statute citation:** Name of Act, Year (e.g. Employment Act, 2006)

**Key statutes by document type:**

*Employment contracts:*
- Employment Act, 2006
- Labour Unions Act, 2006
- Workers' Compensation Act (Cap. 225)
- NSSF Act (Cap. 222)
- Minimum notice: s.58 Employment Act 2006

*Commercial contracts:*
- Contract Act (Cap. 73)
- Sale of Goods Act (Cap. 82)
- Companies Act, 2012

*Conveyancing:*
- Land Act (Cap. 227) and Land (Amendment) Act 2010
- Registration of Titles Act (Cap. 230)
- Land Acquisition Act (Cap. 226)
- Mailo, freehold, leasehold, customary tenure distinctions critical
- Consent of the Land Board required for certain transactions

*Data protection:*
- Data Protection and Privacy Act, 2019
- Personal Data Protection Office (PDPO) registration

---

### 🇹🇿 Tanzania

**Legal system:** Common law (mainland). Zanzibar has separate legal system.
**Key courts:** Court of Appeal → High Court → Resident Magistrates' Courts → District Courts.
**Case citation format:** Party v Party [Year] TZCA/TZHCCom N

**Key statutes:**
- Employment and Labour Relations Act, 2004 (Cap. 366)
- Law of Contract Act (Cap. 345)
- Land Act (Cap. 113) and Village Land Act (Cap. 114)
- Note: Land in Tanzania — all land is public land vested in President. Only "right of occupancy" granted.
- Companies Act, 2002 (Cap. 212)
- Data Protection Act, 2022

---

### 🇷🇼 Rwanda

**Legal system:** Mixed — Civil law influence (French/Belgian history) + Common law (EAC accession).
**Key courts:** Supreme Court → Court of Appeal → High Court → Intermediate Courts → Primary Courts.
**Case citation format:** Civil cases use dossier numbers.

**Key statutes:**
- Labour Code (Law No. 66/2018) — note: comprehensive, French-origin structure
- Law No. 45/2011 governing contracts
- Organic Land Law (No. 43/2013 as amended)
- Law No. 058/2021 relating to the Protection of Personal Data and Privacy

**Special note:** Rwanda uses French legal drafting conventions for older documents.
Be alert to translated documents — confirm which language is authoritative.

---

### 🇪🇹 Ethiopia

**Legal system:** Civil law (based on French/Swiss models). Customary law in some regions.
**Key courts:** Federal Supreme Court → Federal High Court → Federal First Instance Court.
**Arbitration:** Ethiopian Arbitration and Conciliation Centre (EACC).
**Language:** Amharic is official. Documents may be in Amharic — flag for translation.

**Key statutes:**
- Labour Proclamation No. 1156/2019
- Commercial Code (Proclamation No. 1243/2021) — recently modernised
- Rural Land Administration Proclamations (regional variation — critical)
- Personal Data Protection Proclamation (draft stage as of 2024)

---

### International / Multi-jurisdictional

**Signals:** UNCITRAL, ICC, LCIA, ICSID, SIAC arbitration clauses; USD-denominated;
multiple country parties; "international commercial arbitration".

**Response:** Note that this is an international agreement. Apply CISG (if goods contract),
UNIDROIT Principles, or the chosen governing law. Flag which jurisdiction's courts have
supervisory jurisdiction over any arbitration.

---

## Confidence Thresholds

| Confidence | Action |
|---|---|
| ≥ 90% | Proceed without asking user |
| 70–89% | Proceed but note: "I've identified this as a Kenya document — let me know if another jurisdiction applies." |
| 50–69% | Ask: "I believe this document may be governed by [X] law — can you confirm the jurisdiction?" |
| < 50% | Mandatory: "I couldn't identify the jurisdiction with confidence. Which country's law governs this document?" |
