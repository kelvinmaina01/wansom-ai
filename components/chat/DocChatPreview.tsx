
import React from 'react';
import type { DocPreviewData } from '../../types';

interface DocChatPreviewProps {
  data: DocPreviewData;
  onOpenCanvas: (tab: 'preview' | 'code' | 'editor') => void;
  onSave: () => void;
}

const DocChatPreview: React.FC<DocChatPreviewProps> = ({ data, onOpenCanvas, onSave }) => {
  return (
    <div className="doc-chat-preview">
      <div className="dcp-header">
        <div className="dcp-title">
          📄 {data.title}
        </div>
        <div className="dcp-actions">
          <button
            className="dcp-btn"
            style={{ background: 'rgba(59,130,246,0.08)', color: '#3b82f6', border: '1px solid rgba(59,130,246,0.15)' }}
            onClick={() => onOpenCanvas('preview')}
          >
            👁 View
          </button>
          <button
            className="dcp-btn"
            style={{ background: '#f5f5f5', color: '#666', border: '1px solid #e5e5e5' }}
            onClick={() => onOpenCanvas('code')}
          >
            ⌨ HTML
          </button>
          <button
            className="dcp-btn"
            style={{ background: 'rgba(168,85,247,0.08)', color: '#a855f7', border: '1px solid rgba(168,85,247,0.15)' }}
            onClick={() => onOpenCanvas('editor')}
          >
            ✏️ Edit
          </button>
          <button
            className="dcp-btn"
            style={{ background: 'rgba(34,197,94,0.08)', color: '#22c55e', border: '1px solid rgba(34,197,94,0.15)' }}
            onClick={onSave}
          >
            💾 Save
          </button>
        </div>
      </div>
      <div
        className="dcp-preview"
        dangerouslySetInnerHTML={{ __html: data.previewHtml }}
      />
    </div>
  );
};

export default DocChatPreview;
