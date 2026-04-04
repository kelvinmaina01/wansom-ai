
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
      {/* Header */}
      <div className="pause-header">
        <span style={{ fontSize: 14 }}>⏸</span>
        <span className="pause-title">{data.title || 'AI paused — collecting details'}</span>
      </div>

      {/* Body */}
      <div className="pause-body">
        <div className="pause-desc">{data.description}</div>

        {/* Field grid — pairs short fields in 2-col grid */}
        {renderFields(data.fields, values, submitted, handleChange)}

        <button
          className={`pause-continue ${submitted ? 'done' : ''}`}
          onClick={handleContinue}
          disabled={submitted}
        >
          {submitted
            ? '✓ Details collected — drafting…'
            : `✦ ${data.buttonText || 'Continue'} →`}
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
    const f2 = i + 1 < fields.length && fields[i + 1].type !== 'textarea' ? fields[i + 1] : null;

    // Pair two short fields side-by-side
    if (f2 && f1.type !== 'textarea') {
      rows.push(
        <div key={f1.id} className="pf-grid">
          {renderField(f1, values, disabled, onChange)}
          {renderField(f2, values, disabled, onChange)}
        </div>
      );
      i += 2;
    } else {
      rows.push(
        <div key={f1.id} className="pf-full">
          {renderField(f1, values, disabled, onChange)}
        </div>
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
  return (
    <div>
      <div className="pf-label">{field.label}</div>

      {field.type === 'select' && field.options ? (
        <select
          className="pf-select"
          value={values[field.id] || field.defaultValue || ''}
          onChange={e => onChange(field.id, e.target.value)}
          disabled={disabled}
        >
          {field.options.map(opt => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      ) : field.type === 'textarea' ? (
        <textarea
          className="pf-input no-scrollbar"
          placeholder={field.placeholder}
          value={values[field.id] || ''}
          onChange={e => onChange(field.id, e.target.value)}
          disabled={disabled}
          rows={3}
          style={{ resize: 'none' }}
        />
      ) : (
        <input
          className="pf-input"
          placeholder={field.placeholder}
          value={values[field.id] || ''}
          onChange={e => onChange(field.id, e.target.value)}
          disabled={disabled}
        />
      )}
    </div>
  );
}

export default PauseCard;
