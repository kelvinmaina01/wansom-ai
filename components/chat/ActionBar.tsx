
import React from 'react';
import type { ActionButtonData } from '../../types';

interface ActionBarProps {
  actions: ActionButtonData[];
  onAction: (action: string) => void;
}

/** Maps AI-emitted style to simulation CSS class */
const STYLE_MAP: Record<string, string> = {
  primary:   'act-btn act-p',
  secondary: 'act-btn act-s',
  drive:     'act-btn act-drive',
};

const ActionBar: React.FC<ActionBarProps> = ({ actions, onAction }) => {
  return (
    <div className="action-bar">
      {actions.map((act, i) => (
        <button
          key={i}
          className={STYLE_MAP[act.style] || STYLE_MAP.secondary}
          onClick={() => onAction(act.action)}
        >
          {act.label}
        </button>
      ))}
    </div>
  );
};

export default ActionBar;
