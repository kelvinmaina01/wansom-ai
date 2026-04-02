
import React from 'react';
import type { AnswerCardData } from '../../types';

interface AnswerCardProps {
  data: AnswerCardData;
}

const AnswerCard: React.FC<AnswerCardProps> = ({ data }) => {
  return (
    <div className="answer-card">
      <div className="ac-header">
        <div className="ac-header-title">{data.title}</div>
      </div>
      <div className="ac-body">
        {data.rows.map((row, i) => (
          <div key={i} className="ac-row">
            <span className="ac-label">{row.label}</span>
            <span className={`ac-value ${row.status}`}>{row.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnswerCard;
