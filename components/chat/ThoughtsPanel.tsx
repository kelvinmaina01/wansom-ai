
import React from 'react';
import type { ThoughtEntry } from '../../types';

interface ThoughtsPanelProps {
  thoughts: ThoughtEntry[];
  isOpen: boolean;
  onToggle: () => void;
}

const ICONS: Record<string, string> = {
  search: '🔍',
  read: '📖',
  calc: '🔢',
  doc: '📄',
  check: '✓',
};

const ThoughtsPanel: React.FC<ThoughtsPanelProps> = ({ thoughts, isOpen, onToggle }) => {
  if (!isOpen) return null;

  return (
    <div
      className="h-full flex flex-col border-l border-gray-100 bg-white"
      style={{
        width: 280,
        minWidth: 280,
        transition: 'width 0.3s ease, min-width 0.3s ease',
        overflow: 'hidden',
        flexShrink: 0,
      }}
    >
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-2 text-sm font-semibold text-gray-900">
          💭 Thoughts
        </div>
        <button
          onClick={onToggle}
          className="text-gray-400 hover:text-gray-700 transition-colors text-lg leading-none"
        >
          ✕
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-3" style={{ scrollbarWidth: 'thin' }}>
        {thoughts.length === 0 ? (
          <div className="text-center text-gray-400 text-xs py-8">
            Run a query to see AI reasoning
          </div>
        ) : (
          thoughts.map((t) => (
            <div key={t.id} className="thought-group">
              <div className="tg-header">
                <div className={`tg-icon ${t.type}`}>
                  {ICONS[t.type] || '●'}
                </div>
                <div style={{ flex: 1 }}>
                  <div className="tg-title">{t.title}</div>
                  <div className="tg-sub">{t.subtitle.split('·')[0].trim()}</div>
                </div>
                <span className={`tg-status ${t.status === 'done' ? 'ts-done' : 'ts-live'}`}>
                  {t.status === 'done' ? '✓ Done' : '● Live'}
                </span>
              </div>
              {/* Source pills */}
              {t.sources && t.sources.length > 0 && (
                <div className="tg-sources">
                  {t.sources.map((src, i) => (
                    <span key={i} className="tg-source-pill">{src}</span>
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
