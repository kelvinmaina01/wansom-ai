# Conflict of Interest Check Reference

This reference logic allows Lawlify to perform forensic checks for legal conflicts.

## Conflict Detection Rubric

### 1. Party Conflicts
Check all named parties in the document against:
- **Active Clients**: Current active matters in the firm.
- **Adverse Parties**: Entities we have previously sued or negotiated against.
- **Related Entities**: Subsidiaries, parents, or directors of those parties.

### 2. Obligatory Conflicts
Does this document commit the user to something that conflicts with another agreement?
- **Exclusivity**: Does the contract grant exclusivity to Party A?
- **NCA**: Is the user already under a Non-Compete with Party B?
- **MFN**: Does this price trigger a "Most Favored Nation" clause in a previous deal?

## Search Signals
- Parties, Directors, Subsidiaries, Competitors, "Direct Competitor", "Prior Consent".

## Responses
Use the `SmartCard` system with `theme="red"` for identified conflicts and `theme="amber"` for potential overlaps.

```smartcard title="Conflict Check" theme="red" icon="🕵️"
* **Signal:** Party "Acme Corp" is currently an adverse party in Matter #412.
* **Risk:** Potential ethics violation.
* **Status:** 🔴 CRITICAL - Immediate Review Required.
```
