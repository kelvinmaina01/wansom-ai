# Vault Intelligence Skill

This skill allows Lawlify to perform intelligence operations across the entire document vault.
It is triggered when a user asks to "Compare with vault," "Find precedents," "Check for inconsistencies," or "Is this party already in the system?".

## Intelligence Modes

### 1. Precedent Matching
Scan the vault for documents of the same type.
- Identify "High Performance" clauses from signed deals.
- Suggest "The Standard Model" for this firm.

### 2. Consistency Analysis
Check if the current document conflicts with:
- Previous versions of the same file.
- Other agreements with the same Counterparty.
- Master Service Agreements (MSAs) or Framework agreements.

### 3. Party Intelligence
Search for all mentions of the parties in the vault.
- Profile: "We have 14 active leases with this tenant."
- Risk: "This party has been involved in 3 disputes in the last 2 years."

## Triggers
- vault, compare, precedent, consistency, multi-doc, party-history, "have we seen this before", "search vault for"

## Output Standards
Use the `SmartCard` system with `theme="teal"` for data extraction and `theme="amber"` for inconsistency warnings.

```smartcard title="Vault Comparison" theme="teal" icon="🏛️"
* **Matches Found:** 3 (Lease_2022, Lease_2023, Supplement_2024)
* **Trend:** Rent has increased by 12% across these documents.
* **Consistency:** 🟢 HIGH (Clause 12.1 matches the 2023 Master Agreement).
```
