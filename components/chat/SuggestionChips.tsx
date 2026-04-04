
import React from 'react';

interface SuggestionChipsProps {
  suggestions: string[];
  onSelect: (suggestion: string) => void;
}

const SuggestionChips: React.FC<SuggestionChipsProps> = ({ suggestions, onSelect }) => {
  return (
    <div>
      <div style={{
        fontSize: 10,
        fontWeight: 700,
        letterSpacing: '0.08em',
        textTransform: 'uppercase' as const,
        color: 'var(--text3)',
        marginBottom: 6,
        marginTop: 10,
        fontFamily: 'var(--font2)',
      }}>
        Follow-up suggestions
      </div>
      <div className="suggestions-wrap">
        {suggestions.map((s, i) => (
          <div
            key={i}
            className="sugg-chip"
            style={{ animationDelay: `${i * 0.06}s` }}
            onClick={() => onSelect(s)}
          >
            {s}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SuggestionChips;
