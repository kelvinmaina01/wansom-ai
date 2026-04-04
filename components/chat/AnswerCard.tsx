
import React from 'react';
import type { AnswerCardData } from '../../types';

interface AnswerCardProps {
  data: AnswerCardData;
}

/**
 * Maps the AI-emitted status string to the simulation CSS class.
 * Simulation uses: av-g (green), av-w (amber/warn), av-r (red).
 * AI emits:        good/green, warn/amber/warning, bad/red/danger, neutral or ''  
 */
function statusClass(status: string): string {
  if (!status) return '';
  const s = status.toLowerCase();
  if (s === 'good' || s === 'green' || s === 'success' || s === 'g') return 'av-g';
  if (s === 'warn' || s === 'warning' || s === 'amber' || s === 'w') return 'av-w';
  if (s === 'bad' || s === 'red' || s === 'danger' || s === 'error' || s === 'r') return 'av-r';
  return '';
}

const AnswerCard: React.FC<AnswerCardProps> = ({ data }) => {
  return (
    <div className="answer-card">
      {/* Header — simulation class: ac-hd */}
      <div className="ac-hd">
        <div className="ac-hd-title">{data.title}</div>
      </div>
      <div className="ac-body">
        {data.rows.map((row, i) => (
          <div key={i} className="ac-row">
            <span className="ac-lbl">{row.label}</span>
            <span className={`ac-val ${statusClass(row.status)}`}>{row.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnswerCard;
