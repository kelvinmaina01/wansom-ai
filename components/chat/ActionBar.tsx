
import React from 'react';
import type { ActionButtonData } from '../../types';

interface ActionBarProps {
  actions: ActionButtonData[];
  onAction: (action: string) => void;
}

const STYLE_MAP: Record<string, string> = {
  primary: 'chat-act-btn chat-act-primary',
  secondary: 'chat-act-btn chat-act-secondary',
  drive: 'chat-act-btn chat-act-drive',
};

const ActionBar: React.FC<ActionBarProps> = ({ actions, onAction }) => {
  return (
    <div className="chat-action-bar">
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
