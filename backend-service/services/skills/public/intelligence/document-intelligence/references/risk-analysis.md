# Risk Analysis Reference

## Risk Scoring Rubric

Every identified risk is scored on two axes:
- **Severity**: How bad is the outcome if this issue materialises? (1–5)
- **Likelihood**: How likely is this to cause a real problem? (1–5)

**Risk Score = Severity × Likelihood**

| Score | Band | Colour | Badge |
|---|---|---|---|
| 20–25 | CRITICAL | Red (Primary) | 🔴 |
| 10–19 | HIGH | Amber | 🟠 |
| 5–9 | MEDIUM | Yellow | 🟡 |
| 1–4 | LOW | Green | 🟢 |

---

## Quick Scan Patterns (Phase 0 — runs in < 5 seconds)

The quick scan checks for the 12 most dangerous clause patterns. It does not do full analysis.

### QS-01: Uncapped liability / unlimited indemnity
**Signal:** "shall indemnify and hold harmless" without "up to a maximum of" or cap language.
**Risk score:** 20 | 🔴 CRITICAL
**EA context:** Common in boilerplate contracts used in Kenya/Uganda — lawyers often accept without reading.

### QS-02: Unilateral variation right
**Signal:** "may vary the terms of this agreement at its sole discretion" / "reserves the right to change"
without notice requirement or consent clause.
**Risk score:** 16 | 🟠 HIGH
**EA context:** Frequently seen in bank facility letters and telco service agreements. Courts in Kenya
have voided unilateral variation clauses — see Equity Bank v Smithies Enterprises [2018] eKLR.

### QS-03: Automatic renewal without notice
**Signal:** "shall automatically renew" / "continues unless terminated" without minimum notice period
for non-renewal.
**Risk score:** 12 | 🟠 HIGH

### QS-04: Waiver of statutory rights
**Signal:** "waives any right to" / "agrees not to claim" / "unconditionally releases"
combined with employment or consumer context.
**Risk score:** 20 | 🔴 CRITICAL
**EA context:** Kenya Employment Act s.5: any provision purporting to exclude or limit
operation of the Act is void. Parties cannot contract out of minimum statutory protections.

### QS-05: Ouster of court jurisdiction (invalid clauses)
**Signal:** "parties agree to exclude the jurisdiction of any court" in a jurisdiction where
this is not permitted. Different from valid arbitration agreements.
**Risk score:** 15 | 🟠 HIGH

### QS-06: Penalty clauses vs. liquidated damages
**Signal:** Pre-determined damages figures that are disproportionate to likely actual loss.
**Risk score:** 8 | 🟡 MEDIUM
**EA context:** East African courts follow English rule from Dunlop v New Garage — excessive
penalties are unenforceable. Flag if damages clause > 2× reasonable estimate of actual loss.

### QS-07: Missing force majeure
**Signal:** No force majeure clause in a contract with delivery obligations, especially post-2020.
**Risk score:** 9 | 🟡 MEDIUM
**Note:** Offer to insert EA-appropriate force majeure clause (see editing-grammar.md).

### QS-08: Ambiguous notice provisions
**Signal:** Notice clause that does not specify: address, method (physical/email/registered post),
deemed receipt time.
**Risk score:** 6 | 🟡 MEDIUM
**EA context:** Nairobi courts have held that email notice is insufficient unless expressly agreed.

### QS-09: Land Control Board consent (Kenya agricultural land)
**Signal:** Conveyancing document, land described as agricultural/farm land, no LCB consent mentioned.
**Risk score:** 25 | 🔴 CRITICAL
**EA context:** Land Control Act (Cap. 302) — transactions in agricultural land are void without LCB
consent. This is one of the most common fatal errors in Kenyan conveyancing.

### QS-10: Stamp duty not paid / not acknowledged
**Signal:** Conveyancing or commercial document above threshold with no stamp duty clause or certificate.
**Risk score:** 18 | 🟠 HIGH
**EA context:** Unstamped documents are inadmissible as evidence in EA courts. Stamp Duty Act (Cap. 480).

### QS-11: Missing NSSF/NHIF deductions clause (employment)
**Signal:** Employment contract with no mention of statutory deductions.
**Risk score:** 12 | 🟠 HIGH
**EA context:** Employer liability for unremitted NSSF/NHIF contributions — criminal penalties apply.

### QS-12: Data protection clause absent (any document with personal data)
**Signal:** Document mentions personal data, health records, financial records — no DPA compliance clause.
**Risk score:** 10 | 🟠 HIGH
**EA context:** Kenya DPA 2019 and Uganda DPPA 2019 impose mandatory breach notification and
consent requirements. ODPC enforcement has increased since 2022.

---

## Deep Scan Patterns (Phase 2 — full forensic analysis)

### Employment contracts — full checklist

| Clause | Check | Risk if absent |
|---|---|---|
| Job title and description | Is it precise enough to define scope? | Scope disputes |
| Salary and deductions | PAYE, NSSF, NHIF disclosed? | Criminal employer liability |
| Probation | Period stated? Termination during probation procedure? | Wrongful dismissal claim |
| Notice | Complies with s.35 Employment Act minimums? | Summary dismissal liability |
| Leave entitlements | Annual (21 days min), sick, maternity (3 months min Kenya) | Statutory breach |
| Termination for cause | Fair reasons listed per s.45? Procedure per s.41? | Unfair dismissal |
| Non-compete | Reasonable in time, geography, scope? | Unenforceable + talent loss |
| IP ownership | "Works made for hire" / assignment clause? | IP ownership dispute |
| Confidentiality | Specific or overly broad? Enforceable period? | Either unenforceable or inadequate |
| Dispute resolution | ELRC jurisdiction acknowledged? | Procedural costs |
| Governing law | Kenya / Uganda / Tanzania law stated? | Jurisdictional dispute |

### Commercial contracts — full checklist

| Clause | Check | Risk if absent |
|---|---|---|
| Parties | Full legal names, registration numbers? | Enforcement against wrong entity |
| Consideration | Adequately described? | Void contract |
| Payment terms | Timing, method, late payment interest rate? | Cash flow and enforcement issues |
| Delivery/Performance | Specific, measurable obligations? | Dispute over performance |
| Warranties | Fitness for purpose, title, quality? | Inadequate remedy for breach |
| Limitation of liability | Agreed cap? Excluded heads (consequential loss)? | Unlimited exposure |
| Indemnity | Mutual or unilateral? Capped? | Unbalanced risk |
| Force majeure | EA-appropriate list of events? Procedure? | No excuse for failure |
| Termination | For cause and for convenience? Notice? | Trapped in bad contract |
| Assignment | Requires consent? | Unwanted counterparty substitution |
| Entire agreement | Merger clause to prevent prior representations? | Pre-contractual liability |
| Dispute resolution | Tiered? Arbitration seated where? | Expensive litigation |
| Governing law | Expressed? Correct jurisdiction? | Choice of law disputes |
| Stamp duty | Acknowledged? | Inadmissible in court |

### Conveyancing — full checklist

| Item | Check | Risk if absent |
|---|---|---|
| Title search | Certificate of official search attached? | Hidden encumbrances |
| Land Control Board consent | For agricultural land — consent attached? | Void transaction (Kenya) |
| Cautions/caveats | Confirmed none registered? | Third-party claims |
| Requisitions on title | All answered satisfactorily? | Title defects |
| Stamp duty | Assessed and paid? Certificate attached? | Inadmissible document |
| Registration | Lodged for registration? | Transfer not complete |
| Completion statement | All financial adjustments accounted for? | Disputed payments |
| Vacant possession | Confirmed? Occupants identified? | Sitting tenants |

---

## Risk Card Format

When surfacing risks to the user, use this card structure:

```
┌─ 🔴 CRITICAL RISK ─────────────────────────────────────────────┐
│  Issue: Uncapped indemnity obligation                            │
│  Location: Clause 12.3 [p.8]                                    │
│  What it means: You are personally liable for any loss suffered  │
│  by the other party — with no financial ceiling.                 │
│  EA Law: Courts have upheld unlimited indemnities — Mwangi v    │
│  KCB [2019] eKLR.                                               │
│  Recommendation: Negotiate a cap at contract value or insert:   │
│  "...not exceeding KES [X] in aggregate."                       │
└────────────────────────────────────────────────────────────────┘

┌─ 🟡 MEDIUM RISK ───────────────────────────────────────────────┐
│  Issue: Automatic renewal without notice window                  │
│  Location: Clause 18 [p.11]                                     │
│  What it means: Contract renews for 12 months automatically     │
│  unless you give 3 months' notice before expiry.               │
│  Recommendation: Calendar the notice deadline — [exact date     │
│  calculated from contract]. Consider negotiating to 30 days.   │
└────────────────────────────────────────────────────────────────┘

┌─ 🟢 STRONG CLAUSE ─────────────────────────────────────────────┐
│  Clause 9.1 [p.6] — Limitation of Liability                     │
│  This is well-drafted. Liability is capped at 12 months'        │
│  contract value, consequential loss is excluded, and the        │
│  carve-outs (fraud, death) are appropriate.                     │
└────────────────────────────────────────────────────────────────┘
