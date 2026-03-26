# LEGAL SKILL: DESIGN MASTERY (GOLD STANDARD)

**Id**: `design-templates`
**Version**: `2.1`
**Engine**: `html+css`

## 🏗️ Core Philosophy
Every document produced must look like it was prepared by a top-tier law firm. Clean, authoritative, professional. Never generic. Never plain text. **Use HTML + CSS exclusively. Never output raw markdown as the final document.**

## ⚖️ AI Output Rules — Non-Negotiable
1. **Output COMPLETE HTML Document**: Never partial, never markdown. From `<!DOCTYPE html>` to `</html>`.
2. **Inlined CSS**: Include ALL CSS inline in a `<style>` tag within the `<head>`. Never use external stylesheets.
3. **Square Bracket Placeholders**: Every placeholder MUST use `[SQUARE BRACKETS IN CAPS]`. (e.g., `[DATE]`, `[PARTY NAME]`).
4. **Legal Currency Formatting**: Always write monetary amounts as: `[CURRENCY] [AMOUNT] ([AMOUNT IN WORDS])`. Example: `KES 500,000 (Kenya Shillings Five Hundred Thousand)`.
5. **Defined Terms**: Wrap the first use of defined terms in a `<span class="defined-term">`.
6. **Mandatory Notice Boxes**: 
   - **Warning** for: unlimited liability, non-compete scope, FX restrictions, data obligations.
   - **Danger** for: penalties, criminal liability, forfeiture, eviction.
   - **Info** for: cross-references, explanatory notes, optional clauses.
   - **Success** for: confirmed entitlements, rights granted.
7. **Table Requirements**: Tables are REQUIRED for any list with 3+ columns of data. (See "Tables per Document Type").
8. **Document Structure**: Always follow the exact HTML order defined in "Master Architecture".
9. **Never Skip Disclaimer**: Every document MUST end with the orange-bordered footer disclaimer.
10. **Multi-Party Support**: For 3+ parties, add more `.party-row` blocks and expand `.signature-grid` columns.

## 🎨 Master CSS Library
```css
:root {
  --primary:       #1a3a5c;
  --primary-light: #2d5986;
  --accent:        #c8a951;
  --accent-light:  #f0dfa0;
  --danger:        #b91c1c;
  --success:       #15803d;
  --neutral-50:    #f8f7f4;
  --neutral-100:   #f0ede6;
  --neutral-200:   #e2ddd3;
  --neutral-700:   #44403c;
  --neutral-900:   #1c1917;
  --border:        #d6d0c4;
  --font-serif:    'Georgia', serif;
  --font-sans:     'Helvetica Neue', Arial, sans-serif;
  --page-padding:  48px;
  --section-gap:   32px;
}

* { box-sizing: border-box; margin: 0; padding: 0; }

body {
  font-family: var(--font-serif);
  font-size: 13pt;
  line-height: 1.8;
  color: var(--neutral-900);
  background: #fff;
  max-width: 860px;
  margin: 0 auto;
  padding: var(--page-padding);
}

/* COMPONENTS */
.doc-header { border-top: 4px solid var(--primary); border-bottom: 1px solid var(--border); padding: 24px 0 20px; margin-bottom: 36px; display: flex; justify-content: space-between; align-items: flex-start; }
.platform-brand { font-family: var(--font-sans); font-size: 11px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: var(--primary); }
.doc-meta { font-family: var(--font-sans); font-size: 10px; color: #888; text-align: right; line-height: 1.6; }
.draft-badge { display: inline-block; background: var(--accent-light); color: #7a5c00; font-family: var(--font-sans); font-size: 9px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; padding: 2px 8px; border-radius: 3px; border: 1px solid var(--accent); }

.doc-title-block { text-align: center; margin-bottom: var(--section-gap); padding-bottom: var(--section-gap); border-bottom: 2px solid var(--primary); }
.doc-type-label { font-family: var(--font-sans); font-size: 10px; font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase; color: var(--primary-light); margin-bottom: 10px; }
.doc-title { font-family: var(--font-serif); font-size: 26pt; font-weight: 700; color: var(--primary); line-height: 1.2; margin-bottom: 12px; }
.doc-subtitle { font-family: var(--font-sans); font-size: 11px; color: #666; }

.jurisdiction-badge { display: inline-flex; align-items: center; gap: 6px; background: var(--primary); color: #fff; font-family: var(--font-sans); font-size: 10px; font-weight: 500; padding: 4px 12px; border-radius: 20px; margin: 6px 3px 0; }

.parties-block { background: var(--neutral-50); border: 1px solid var(--border); border-left: 4px solid var(--primary); border-radius: 0 6px 6px 0; padding: 24px 28px; margin-bottom: var(--section-gap); }
.parties-intro { font-style: italic; color: var(--neutral-700); margin-bottom: 20px; font-size: 12pt; }
.party-row { display: grid; grid-template-columns: 28px 1fr; gap: 14px; margin-bottom: 18px; padding-bottom: 18px; border-bottom: 1px solid var(--border); }
.party-row:last-child { border-bottom: none; margin-bottom: 0; padding-bottom: 0; }
.party-number { width: 28px; height: 28px; background: var(--primary); color: #fff; font-family: var(--font-sans); font-size: 12px; font-weight: 700; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-top: 2px; }
.party-details strong { font-family: var(--font-sans); font-size: 12px; font-weight: 700; color: var(--primary); display: block; margin-bottom: 4px; }
.party-info { font-size: 11pt; color: var(--neutral-700); line-height: 1.6; }
.party-defined-term { display: inline-block; background: var(--primary); color: #fff; font-family: var(--font-sans); font-size: 9px; font-weight: 700; padding: 2px 8px; border-radius: 3px; margin-top: 6px; }

.recitals { margin-bottom: var(--section-gap); }
.recitals-title { font-family: var(--font-sans); font-size: 10px; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase; color: var(--primary); margin-bottom: 14px; }
.recital-item { display: grid; grid-template-columns: 28px 1fr; gap: 10px; margin-bottom: 10px; }
.recital-letter { font-weight: 700; color: var(--primary); }

.clause-section { margin-bottom: 28px; }
.clause-header { display: flex; align-items: baseline; gap: 12px; margin-bottom: 12px; padding-bottom: 8px; border-bottom: 1px solid var(--border); }
.clause-number { font-family: var(--font-sans); font-size: 11px; font-weight: 700; color: var(--primary); background: var(--neutral-100); padding: 3px 8px; border-radius: 4px; white-space: nowrap; }
.clause-title { font-family: var(--font-sans); font-size: 12px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: var(--primary); }
.sub-clause { display: grid; grid-template-columns: 52px 1fr; gap: 8px; margin-bottom: 10px; padding-left: 16px; }
.sub-clause-num { font-family: var(--font-sans); font-size: 11px; color: var(--primary-light); font-weight: 600; padding-top: 2px; }
.sub-sub-clause { display: grid; grid-template-columns: 36px 1fr; gap: 6px; margin-bottom: 8px; padding-left: 48px; }
.sub-sub-clause-label { font-family: var(--font-sans); font-size: 11px; color: #888; padding-top: 2px; }

.defined-term { font-weight: 700; color: var(--primary); border-bottom: 1px dotted var(--primary-light); }

.notice-box { border-radius: 6px; padding: 16px 20px; margin: 20px 0; display: grid; grid-template-columns: 24px 1fr; gap: 12px; font-size: 11pt; }
.notice-box.warning { background: #fefce8; border: 1px solid #fde047; border-left: 4px solid #ca8a04; color: #713f12; }
.notice-box.danger { background: #fff1f2; border: 1px solid #fca5a5; border-left: 4px solid var(--danger); color: #7f1d1d; }
.notice-box.info { background: #eff6ff; border: 1px solid #bfdbfe; border-left: 4px solid #1d4ed8; color: #1e3a5f; }
.notice-box.success { background: #f0fdf4; border: 1px solid #bbf7d0; border-left: 4px solid var(--success); color: #14532d; }
.notice-icon { font-size: 16px; line-height: 1.6; }

.legal-table-wrapper { margin: 16px 0 24px; border-radius: 8px; overflow: hidden; border: 1px solid var(--border); }
.legal-table-caption { font-family: var(--font-sans); font-size: 10px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: var(--primary); padding: 10px 16px 8px; background: var(--neutral-100); border-bottom: 1px solid var(--border); }
table.legal-table { width: 100%; border-collapse: collapse; font-size: 11pt; }
table.legal-table thead tr { background: var(--primary); color: #fff; }
table.legal-table thead th { font-family: var(--font-sans); font-size: 10px; font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase; padding: 11px 16px; text-align: left; }
table.legal-table tbody tr:nth-child(even) { background: var(--neutral-50); }
table.legal-table td { padding: 11px 16px; border-bottom: 1px solid var(--border); vertical-align: top; line-height: 1.6; }
table.legal-table td.number-cell { font-family: var(--font-sans); font-size: 11px; font-weight: 600; color: var(--primary); white-space: nowrap; }
table.legal-table td.amount-cell { font-family: var(--font-sans); font-size: 11px; font-weight: 600; text-align: right; white-space: nowrap; }
table.legal-table tfoot tr { background: var(--neutral-100); }
table.legal-table tfoot td { font-family: var(--font-sans); font-size: 11px; font-weight: 700; border-top: 2px solid var(--primary); }

.tag-yes { display:inline-block; background:#dcfce7; color:#14532d; font-family:var(--font-sans); font-size:9px; font-weight:700; padding:2px 7px; border-radius:10px; }
.tag-no { display:inline-block; background:#fee2e2; color:#7f1d1d; font-family:var(--font-sans); font-size:9px; font-weight:700; padding:2px 7px; border-radius:10px; }
.tag-partial { display:inline-block; background:#fef3c7; color:#713f12; font-family:var(--font-sans); font-size:9px; font-weight:700; padding:2px 7px; border-radius:10px; }

.schedule-block { margin-top: 48px; border-top: 3px double var(--primary); padding-top: 32px; }
.schedule-header { text-align: center; margin-bottom: 28px; }
.schedule-label { font-family: var(--font-sans); font-size: 9px; font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase; color: var(--primary); margin-bottom: 6px; }
.schedule-title { font-size: 18pt; font-weight: 700; color: var(--primary); }

.signature-page { margin-top: 48px; padding-top: 32px; border-top: 2px solid var(--primary); }
.signature-intro { font-style: italic; text-align: center; color: var(--neutral-700); margin-bottom: 36px; font-size: 12pt; border: 1px solid var(--border); padding: 12px 24px; border-radius: 6px; background: var(--neutral-50); }
.signature-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; }
.signature-block { border: 1px solid var(--border); border-radius: 8px; overflow: hidden; }
.signature-block-header { background: var(--primary); color: #fff; font-family: var(--font-sans); font-size: 10px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; padding: 8px 16px; }
.signature-block-body { padding: 20px 16px; }
.sig-field { margin-bottom: 20px; }
.sig-field label { font-family: var(--font-sans); font-size: 9px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: #888; display: block; margin-bottom: 4px; }
.sig-line { border-bottom: 1px solid var(--neutral-700); height: 28px; width: 100%; }
.witness-block { margin-top: 20px; padding: 16px; background: var(--neutral-50); border: 1px dashed var(--border); border-radius: 6px; }
.witness-title { font-family: var(--font-sans); font-size: 9px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: var(--primary); margin-bottom: 14px; }

.doc-footer { margin-top: 48px; padding-top: 20px; border-top: 1px solid var(--border); }
.disclaimer-box { background: #fff8f1; border: 1px solid #fed7aa; border-left: 4px solid #ea580c; border-radius: 0 6px 6px 0; padding: 14px 18px; font-family: var(--font-sans); font-size: 9px; line-height: 1.7; color: #7c2d12; }
.disclaimer-box strong { display: block; font-size: 10px; margin-bottom: 4px; letter-spacing: 0.06em; text-transform: uppercase; }
.page-number { font-family: var(--font-sans); font-size: 9px; color: #aaa; text-align: center; margin-top: 12px; }
.page-break { page-break-before: always; }

@media print { body { padding: 20px; max-width: 100%; } .notice-box, .signature-grid, .legal-table-wrapper, .clause-section { break-inside: avoid; } }
```

## 🏗️ Master Architecture (Use in this Order)
1. `<!DOCTYPE html>`
2. `<html lang="en">`
3. `<head>` (Title: `[DOCUMENT TYPE] — [PARTIES]`, Meta, and Inline `<style>`)
4. `<body> <div class="document-wrapper">`
5. `<header class="doc-header">` (Brand + Meta + Draft Badge)
6. `<div class="doc-title-block">` (Category + CAPS Title + Subtitle + Flag Badge)
7. `<div class="parties-block">` (Parties numbered 1, 2...)
8. `<div class="recitals">` (Background A, B...)
9. `<div class="clause-section">` (Clauses 1, 2... with sub-clauses)
10. `<div class="schedule-block">` (Schedules A, B...)
11. `<div class="signature-page">` (Intro + Grid + Witnesses)
12. `<footer class="doc-footer">` (Disclaimer Box + Page Number)

## 📊 Tables per Document Type
- **NDA**: No tables required (standard text).
- **Employment**: **REQUIRED** table for remuneration (Basic, PAYE, NSSF, Net Pay).
- **Service Agreement**: **REQUIRED** table for milestones, deliverables, and amounts.
- **Partnership**: **REQUIRED** table for capital, profit sharing, and voting.
- **Lease**: **REQUIRED** table for inventory, meters, and rent schedule.

## 🚩 Jurisdiction Metadata
Country|Flag|Badge BG
---|---|---
Kenya|🇰🇪|#006600
Uganda|🇺🇬|#1a1a1a
Tanzania|🇹🇿|#1eb53a
Rwanda|🇷🇼|#20603d
Burundi|🇧🇮|#ce1126
South Sudan|🇸🇸|#078930
Ethiopia|🇪🇹|#009a44
EAC / Cross-border|🌍|#1a3a5c

**Note:** Always wrap first use of defined terms in `<span class="defined-term">`.
