
import React from 'react';
import type { SourcesBlockData } from '../../types';

interface SourcesBlockProps {
  data: SourcesBlockData;
}

const SourcesBlock: React.FC<SourcesBlockProps> = ({ data }) => {
  return (
    <div className="sources-block">
      <div className="src-title">Sources cited</div>
      {data.sources.map((src, i) => (
        <div key={i} className="src-item">
          <div className="src-dot" />
          {src}
        </div>
      ))}
    </div>
  );
};

export default SourcesBlock;
