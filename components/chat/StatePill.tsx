
import React from 'react';
import type { PillState } from '../../types';

interface StatePillProps {
  state: PillState;
  label: string;
}

const STATE_CONFIG: Record<PillState, { className: string; iconType: 'spinner' | 'pulse' | 'check' | 'none' }> = {
  thinking:  { className: 'sp-thinking',  iconType: 'pulse' },
  searching: { className: 'sp-searching', iconType: 'spinner' },
  reading:   { className: 'sp-reading',   iconType: 'spinner' },
  drafting:  { className: 'sp-drafting',  iconType: 'spinner' },
  asking:    { className: 'sp-asking',    iconType: 'pulse' },
  paused:    { className: 'sp-paused',    iconType: 'pulse' },
  done:      { className: 'sp-done',      iconType: 'check' },
  streaming: { className: 'sp-drafting',  iconType: 'none' },
};

const StatePill: React.FC<StatePillProps> = ({ state, label }) => {
  const config = STATE_CONFIG[state];
  if (state === 'streaming') return null; // No pill during streaming — cursor is the indicator

  const renderIcon = () => {
    switch (config.iconType) {
      case 'spinner':
        return <span className="chat-spinner" />;
      case 'pulse':
        return <span className="chat-pulse-dot" />;
      case 'check':
        return (
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M20 6L9 17l-5-5" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className={`state-pill ${config.className}`}>
      {renderIcon()}
      <span>{label}</span>
    </div>
  );
};

export default StatePill;
