
import React from 'react';
import type { ThoughtEntry } from '../../types';

interface ThoughtsPanelProps {
  thoughts: ThoughtEntry[];
  isOpen: boolean;
  onToggle: () => void;
}

const ICONS: Record<string, string> = {
  search: '🔍',
  read:   '📖',
  calc:   '🔢',
  doc:    '📄',
  check:  '✓',
};

/** Maps thought type to simulation icon class */
const ICON_CLASS: Record<string, string> = {
  search: 'tg-search',
  read:   'tg-read',
  calc:   'tg-calc',
  doc:    'tg-read',
  check:  'tg-check',
};

const ThoughtsPanel: React.FC<ThoughtsPanelProps> = ({ thoughts, isOpen, onToggle }) => {
  return (
    <div className={`thoughts-panel ${isOpen ? 'open' : ''}`}>
      {/* Header */}
      <div className="tp-header">
        <div className="tp-title">💭 Thoughts</div>
        <button className="tp-close" onClick={onToggle}>✕</button>
      </div>

      {/* Content */}
      <div className="tp-content">
        {thoughts.length === 0 ? (
          <div style={{ fontSize: 11, color: 'var(--text3)', textAlign: 'center', padding: '20px 0', fontFamily: 'var(--font2)' }}>
            Run a query to see AI reasoning
          </div>
        ) : (
          thoughts.map(t => (
            <div key={t.id} className="thought-group">
              <div className="tg-header">
                {/* Icon box — simulation: tg-icon + type-specific class */}
                <div className={`tg-icon ${ICON_CLASS[t.type] || 'tg-check'}`}>
                  {ICONS[t.type] || '●'}
                </div>
                <div className="tg-text">
                  <div className="tg-title">{t.title}</div>
                  <div className="tg-sub">{t.subtitle?.split('·')[0]?.trim()}</div>
                </div>
                <span className={`tg-status ${t.status === 'done' ? 'ts-done' : 'ts-live'}`}>
                  {t.status === 'done' ? '✓ Done' : '● Live'}
                </span>
              </div>

              {/* Source pills */}
              {t.sources && t.sources.length > 0 && (
                <div className="tg-sources">
                  {t.sources.map((src, i) => (
                    <span key={i} className="tg-src-pill">{src}</span>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ThoughtsPanel;
