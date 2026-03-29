# S.A.V.R.E. Sync Reference (Speech AI for Voice/Recall)

S.A.V.R.E. is Lawlify's autonomous audio briefing engine. It converts static document intelligence into a high-fidelity voice briefing with synchronized UI highlights.

## Sync Logic

### 1. Category Mapping
When generating a segment for the voice briefing, identify the "Category":
- **RISK (🔴)**: Anything that requires immediate attention or negotiation.
- **COMMITMENT (🔵)**: A duty, payment, or performance obligation.
- **COMPLIANCE (🟢)**: Confirmed adherence to statutory requirements.
- **FACT (⚪)**: Neutral metadata (Parties, Dates, Locations).

### 2. Segment Generation Structure
Each "briefing segment" should be formatted as follows for the backend:
```json
{
  "category": "RISK|COMMITMENT|COMPLIANCE|FACT",
  "insight": "1-sentence conversational summary",
  "proof": "the exact quote from the document supporting this",
  "timestamp_ms": "offset for audio-sync"
}
```

### 3. Voice Briefing Standards
- Use **conversational legal language**: "I've flagged the notice period in Clause 14..." instead of "Clause 14 contains notice requirements."
- Focus on **Impact**: Explain *why* the lawyer should care about this segment.
- **Speed**: Briefings should be high-density (max 120 seconds per summary).

## Visual States
- **S.A.V.R.E. Glow**: The purple pulse indicator in the sidebar.
- **Active Segment**: The blue light-highlight overlaid on the PDF viewer in `IntelligenceHub.tsx`.
