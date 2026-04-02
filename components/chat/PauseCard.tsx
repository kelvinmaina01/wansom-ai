
import React, { useState } from 'react';
import type { PauseCardData } from '../../types';

interface PauseCardProps {
  data: PauseCardData;
  onContinue: (details: Record<string, string>) => void;
}

const PauseCard: React.FC<PauseCardProps> = ({ data, onContinue }) => {
  const [values, setValues] = useState<Record<string, string>>(() => {
    const defaults: Record<string, string> = {};
    data.fields.forEach(f => { if (f.defaultValue) defaults[f.id] = f.defaultValue; });
    return defaults;
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (fieldId: string, value: string) => {
    if (submitted) return;
    setValues(prev => ({ ...prev, [fieldId]: value }));
  };

  const handleContinue = () => {
    setSubmitted(true);
    setTimeout(() => onContinue(values), 500);
  };

  return (
    <div className="pause-card">
      <div className="pause-header">
        <span style={{ fontSize: 14 }}>⏸</span>
        <span className="pause-title">{data.title || 'AI paused — collecting details'}</span>
      </div>
      <div className="pause-body">
        <div className="pause-desc">{data.description}</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {/* Render fields in pairs (row layout) where possible */}
          {renderFields(data.fields, values, submitted, handleChange)}
        </div>
        <button
          className={`pause-continue ${submitted ? 'submitted' : ''}`}
          onClick={handleContinue}
          disabled={submitted}
        >
          {submitted ? '✓ Details collected — drafting…' : `✦ ${data.buttonText || 'Continue'} →`}
        </button>
      </div>
    </div>
  );
};

function renderFields(
  fields: PauseCardData['fields'],
  values: Record<string, string>,
  disabled: boolean,
  onChange: (id: string, val: string) => void
) {
  const rows: React.ReactNode[] = [];
  let i = 0;
  
  while (i < fields.length) {
    const f1 = fields[i];
    const f2 = i + 1 < fields.length ? fields[i + 1] : null;
    
    // Pair short fields (text + select) in a row, full-width for longer ones
    if (f2 && f1.type !== 'select' && f2.type !== 'select') {
      rows.push(
        <div key={f1.id} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          {renderField(f1, values, disabled, onChange)}
          {renderField(f2, values, disabled, onChange)}
        </div>
      );
      i += 2;
    } else if (f2 && (f1.type === 'select' || f2.type === 'select')) {
      rows.push(
        <div key={f1.id} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          {renderField(f1, values, disabled, onChange)}
          {renderField(f2, values, disabled, onChange)}
        </div>
      );
      i += 2;
    } else {
      rows.push(
        <div key={f1.id}>{renderField(f1, values, disabled, onChange)}</div>
      );
      i += 1;
    }
  }
  
  return rows;
}

function renderField(
  field: PauseCardData['fields'][0],
  values: Record<string, string>,
  disabled: boolean,
  onChange: (id: string, val: string) => void
) {
  const isTextArea = field.type === 'textarea';
  
  return (
    <div style={{ width: '100%' }}>
      <div className="pf-label" style={{ 
        fontSize: '10px', 
        fontWeight: 700, 
        color: 'rgba(255,255,255,0.4)', 
        textTransform: 'uppercase', 
        letterSpacing: '0.05em',
        marginBottom: '6px'
      }}>
        {field.label}
      </div>
      {field.type === 'select' && field.options ? (
        <select
          className="pf-input"
          value={values[field.id] || field.defaultValue || ''}
          onChange={(e) => onChange(field.id, e.target.value)}
          disabled={disabled}
          style={{ 
            width: '100%',
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '10px',
            padding: '10px 14px',
            color: '#fff',
            fontSize: '13px',
            cursor: disabled ? 'default' : 'pointer',
            height: '42px',
            outline: 'none'
          }}
        >
          {field.options.map(opt => (
            <option key={opt} value={opt} style={{ background: '#1a1a1a' }}>{opt}</option>
          ))}
        </select>
      ) : isTextArea ? (
        <textarea
          className="pf-input no-scrollbar"
          placeholder={field.placeholder}
          value={values[field.id] || ''}
          onChange={(e) => onChange(field.id, e.target.value)}
          disabled={disabled}
          rows={3}
          style={{ 
            width: '100%',
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '10px',
            padding: '10px 14px',
            color: '#fff',
            fontSize: '13px',
            resize: 'none',
            outline: 'none'
          }}
        />
      ) : (
        <input
          className="pf-input"
          placeholder={field.placeholder}
          value={values[field.id] || ''}
          onChange={(e) => onChange(field.id, e.target.value)}
          disabled={disabled}
          style={{ 
            width: '100%',
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '10px',
            padding: '10px 14px',
            color: '#fff',
            fontSize: '13px',
            height: '42px',
            outline: 'none'
          }}
        />
      )}
    </div>
  );
}

export default PauseCard;
