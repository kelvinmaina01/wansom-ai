
import React from 'react';

interface SaveModalProps {
  isOpen: boolean;
  documentTitle: string;
  onClose: () => void;
  onSave: (destination: 'library' | 'drive' | 'onedrive' | 'download') => void;
}

const SaveModal: React.FC<SaveModalProps> = ({ isOpen, documentTitle, onClose, onSave }) => {
  if (!isOpen) return null;

  const options = [
    {
      key: 'library' as const,
      icon: '📚',
      iconBg: 'rgba(245,158,11,0.08)',
      title: 'Lawlify Library',
      sub: 'Access from any matter · searchable',
    },
    {
      key: 'drive' as const,
      icon: '📁',
      iconBg: 'rgba(34,197,94,0.08)',
      title: 'Google Drive',
      sub: 'Saves to your connected Drive folder',
    },
    {
      key: 'onedrive' as const,
      icon: '☁',
      iconBg: 'rgba(59,130,246,0.08)',
      title: 'Microsoft OneDrive',
      sub: 'Saves to your OneDrive Documents',
    },
    {
      key: 'download' as const,
      icon: '⬇',
      iconBg: 'rgba(239,68,68,0.08)',
      title: 'Download as PDF/DOCX',
      sub: 'Save to your device',
    },
  ];

  return (
    <div className="save-modal-backdrop" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="save-modal-box">
        <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 6, color: '#1a1a1a' }}>
          Save document
        </div>
        <div style={{ fontSize: 12, color: '#888', marginBottom: 20 }}>
          Choose where to save your {documentTitle}
        </div>
        <div style={{ marginBottom: 16 }}>
          {options.map(opt => (
            <div key={opt.key} className="sm-opt" onClick={() => onSave(opt.key)}>
              <div style={{
                width: 32, height: 32, borderRadius: 8,
                background: opt.iconBg,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 16, flexShrink: 0
              }}>
                {opt.icon}
              </div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, color: '#1a1a1a' }}>{opt.title}</div>
                <div style={{ fontSize: 10, color: '#888' }}>{opt.sub}</div>
              </div>
            </div>
          ))}
        </div>
        <button
          onClick={onClose}
          style={{
            width: '100%', background: '#f5f5f5',
            border: '1px solid #e5e5e5', borderRadius: 8,
            padding: 8, fontFamily: 'Inter, sans-serif',
            fontSize: 12, color: '#888', cursor: 'pointer', fontWeight: 600,
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default SaveModal;
