import React from 'react';

const GmailLogo: React.FC<{ className?: string }> = ({ className = 'w-full h-full' }) => (
  <svg viewBox="0 0 24 24" className={className}>
    <path d="M0 4v16h24V4L12 13z" fill="#f44336"/>
    <path d="M0 4l12 9 12-9H0z" fill="#e57373"/>
  </svg>
);

export default GmailLogo;
