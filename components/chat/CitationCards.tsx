
import React, { useState } from 'react';
import type { CitationData } from '../../types';

interface CitationCardsProps {
  citations: CitationData[];
}

/** Maps citation type to the simulation CSS modifier class */
const TYPE_CLASS: Record<string, string> = {
  statute: 'cc-statute',
  case:    'cc-case',
  web:     'cc-web',
};

const TYPE_ICON: Record<string, string> = {
  statute: '⚖️',
  case:    '📋',
  web:     '🌐',
};

const TYPE_LABEL: Record<string, string> = {
  statute: 'STATUTE',
  case:    'CASE',
  web:     'ONLINE',
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
        const typeCls = TYPE_CLASS[cite.type] || 'cc-statute';
        const typeIcon = TYPE_ICON[cite.type] || '📄';
        const typeLabel = TYPE_LABEL[cite.type] || 'SOURCE';

        return (
          <div
            key={i}
            className="cite-card"
            style={{ animationDelay: `${i * 0.08}s` }}
            onClick={() => toggleExpand(i)}
          >
            {/* Type badge — needs both cc-type AND the type-specific class */}
            <div className={`cc-type ${typeCls}`}>
              {typeIcon} {typeLabel}
            </div>
            <div className="cc-title">{cite.title}</div>
            <div className="cc-sub">{cite.subtitle}</div>
            <div className="cc-expand">
              {isExpanded ? 'Click to collapse ↑' : 'Click to expand ↓'}
            </div>
            <div className={`cc-full ${isExpanded ? 'show' : ''}`}>
              {cite.fullText}
              {cite.url && (
                <a
                  className="cc-url"
                  href={cite.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={e => e.stopPropagation()}
                >
                  🔗 {cite.url}
                </a>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CitationCards;
