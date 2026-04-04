
import React from 'react';
import type { PillState } from '../../types';

interface StatePillProps {
  state: PillState;
  label: string;
}

/**
 * Simulation mapping:
 *   thinking  → sp-thinking  + pill-pulse
 *   searching → sp-searching + pill-spin
 *   reading   → sp-reading   + pill-spin
 *   drafting  → sp-drafting  + pill-spin
 *   asking    → sp-asking    + pill-pulse
 *   paused    → sp-paused    + pill-pulse
 *   done      → sp-done      + checkmark svg
 *   streaming → null (cursor is the indicator)
 */
const STATE_CONFIG: Record<PillState, { cls: string; icon: 'spin' | 'pulse' | 'check' | 'none' }> = {
  thinking:  { cls: 'sp-thinking',  icon: 'pulse' },
  searching: { cls: 'sp-searching', icon: 'spin'  },
  reading:   { cls: 'sp-reading',   icon: 'spin'  },
  drafting:  { cls: 'sp-drafting',  icon: 'spin'  },
  asking:    { cls: 'sp-asking',    icon: 'pulse' },
  paused:    { cls: 'sp-paused',    icon: 'pulse' },
  done:      { cls: 'sp-done',      icon: 'check' },
  streaming: { cls: 'sp-drafting',  icon: 'none'  },
};

const CheckIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path d="M20 6L9 17l-5-5" />
  </svg>
);

const StatePill: React.FC<StatePillProps> = ({ state, label }) => {
  // During streaming, the blinking cursor in StreamingText is the indicator
  if (state === 'streaming') return null;

  const { cls, icon } = STATE_CONFIG[state] ?? STATE_CONFIG.thinking;

  return (
    <div className={`state-pill ${cls}`}>
      {icon === 'spin'  && <span className="pill-spin" />}
      {icon === 'pulse' && <span className="pill-pulse" />}
      {icon === 'check' && <CheckIcon />}
      <span>{label}</span>
    </div>
  );
};

export default StatePill;
