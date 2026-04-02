
import React, { useState } from 'react';
import type { CitationData } from '../../types';

interface CitationCardsProps {
  citations: CitationData[];
}

const ICONS: Record<string, string> = {
  statute: '⚖️',
  case: '📋',
  web: '🌐',
};

const LABELS: Record<string, string> = {
  statute: 'STATUTE',
  case: 'CASE',
  web: 'ONLINE',
};

const CitationCards: React.FC<CitationCardsProps> = ({ citations }) => {
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);

  const toggleExpand = (idx: number) => {
    setExpandedIdx(prev => prev === idx ? null : idx);
  };

  return (
    <div className="citations-grid">
      {citations.map((cite, i) => {
        const isExpanded = expandedIdx === i;
        return (
          <div
            key={i}
            className={`cite-card ${isExpanded ? 'expanded' : ''}`}
            style={{ animationDelay: `${i * 0.08}s` }}
            onClick={() => toggleExpand(i)}
          >
            <div className={`cc-type ${cite.type}`}>
              <span>{ICONS[cite.type] || '📄'}</span>
              {LABELS[cite.type] || 'SOURCE'}
            </div>
            <div className="cc-title">{cite.title}</div>
            <div className="cc-sub">{cite.subtitle}</div>
            <div className="cc-expand">
              {isExpanded ? 'Click to collapse ↑' : 'Click to expand ↓'}
            </div>
            {isExpanded && (
              <div className="cc-full-text">
                {cite.fullText}
                {cite.url && (
                  <a
                    className="cc-url"
                    href={cite.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                  >
                    🔗 {cite.url}
                  </a>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default CitationCards;
