
import React, { useState } from 'react';
import type { FollowUpCardData } from '../../types';

interface FollowUpCardProps {
  data: FollowUpCardData;
  onSubmit: (answers: Record<string, string>) => void;
  onSkip: () => void;
}

const FollowUpCard: React.FC<FollowUpCardProps> = ({ data, onSubmit, onSkip }) => {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const handleSelect = (questionId: string, option: string) => {
    if (submitted) return;
    setAnswers(prev => ({ ...prev, [questionId]: option }));
  };

  const handleSubmit = () => {
    setSubmitted(true);
    setTimeout(() => onSubmit(answers), 400);
  };

  const handleSkip = () => {
    setSubmitted(true);
    setTimeout(() => onSkip(), 200);
  };

  return (
    <div className="fup-card">
      {/* Header — matches simulation: fup-header, fup-header-title, fup-header-sub */}
      <div className="fup-header">
        <span style={{ fontSize: 14 }}>💬</span>
        <div className="fup-header-title">AI needs a few details</div>
        <div className="fup-header-sub">
          {data.questions.length} question{data.questions.length > 1 ? 's' : ''}
        </div>
      </div>

      <div className="fup-body">
        <div className="fup-question">{data.intro}</div>

        {data.questions.map((q, qi) => (
          <div key={q.id} style={{ marginBottom: qi < data.questions.length - 1 ? 14 : 0 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)', marginBottom: 8, fontFamily: 'var(--font)' }}>
              {q.question}
            </div>

            {/* Options — simulation class: fup-opts / fup-opt / fup-radio */}
            {q.options && (
              <div className="fup-opts">
                {q.options.map(opt => (
                  <div
                    key={opt}
                    className={`fup-opt ${answers[q.id] === opt ? 'selected' : ''}`}
                    onClick={() => handleSelect(q.id, opt)}
                    style={{ pointerEvents: submitted ? 'none' : 'auto' }}
                  >
                    {/* Radio indicator — simulation class: fup-radio */}
                    <div className="fup-radio">
                      {answers[q.id] === opt ? '●' : '○'}
                    </div>
                    <span>{opt}</span>
                  </div>
                ))}
              </div>
            )}

            {q.allowFreeText && (
              <input
                className="pf-input"
                placeholder={q.placeholder || 'Type your answer...'}
                value={answers[q.id] || ''}
                onChange={e => handleSelect(q.id, e.target.value)}
                disabled={submitted}
                style={{ marginTop: 8 }}
              />
            )}
          </div>
        ))}

        {/* Actions — simulation class: fup-actions / fup-submit / fup-skip */}
        <div className="fup-actions">
          <button
            className="fup-submit"
            onClick={handleSubmit}
            disabled={submitted}
            style={submitted ? { background: 'var(--green)', opacity: 1 } : {}}
          >
            {submitted ? '✓ Continuing…' : 'Continue →'}
          </button>
          <div className="fup-skip" onClick={handleSkip}>
            Skip these
          </div>
        </div>
      </div>
    </div>
  );
};

export default FollowUpCard;
