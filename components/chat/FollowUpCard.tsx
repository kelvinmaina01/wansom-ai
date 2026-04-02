
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
      <div className="fup-header">
        <div className="fup-header-icon">💬</div>
        <div className="fup-header-title">AI needs a few details</div>
        <div className="fup-header-sub">
          {data.questions.length} question{data.questions.length > 1 ? 's' : ''}
        </div>
      </div>
      <div className="fup-body">
        <div className="fup-question">{data.intro}</div>
        
        {data.questions.map((q, qi) => (
          <div key={q.id} style={{ marginBottom: qi < data.questions.length - 1 ? 14 : 0 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: '#1a1a1a', marginBottom: 7 }}>
              {q.question}
            </div>
            {q.options && (
              <div>
                {q.options.map((opt) => (
                  <div
                    key={opt}
                    className={`fup-option ${answers[q.id] === opt ? 'selected' : ''}`}
                    onClick={() => handleSelect(q.id, opt)}
                    style={{ pointerEvents: submitted ? 'none' : 'auto' }}
                  >
                    <div className="fup-option-icon">
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
                onChange={(e) => handleSelect(q.id, e.target.value)}
                disabled={submitted}
                style={{ marginTop: 8 }}
              />
            )}
          </div>
        ))}

        <div style={{ marginTop: 14, display: 'flex', gap: 8, alignItems: 'center' }}>
          <button
            className={`fup-submit ${submitted ? 'submitted' : ''}`}
            onClick={handleSubmit}
            disabled={submitted}
          >
            {submitted ? '✓ Submitted' : 'Continue →'}
          </button>
          <div
            style={{ fontSize: 11, color: '#999', cursor: 'pointer' }}
            onClick={handleSkip}
          >
            Skip these
          </div>
        </div>
      </div>
    </div>
  );
};

export default FollowUpCard;
