import React from 'react';

const MicrosoftTeamsLogo: React.FC<{ className?: string }> = ({ className = 'w-full h-full' }) => (
  <svg viewBox="0 0 24 24" className={className}>
    <path d="M19.5 7h-4V5a2 2 0 00-2-2h-3a2 2 0 00-2 2v2H4.5A1.5 1.5 0 003 8.5v9A1.5 1.5 0 004.5 19h15a1.5 1.5 0 001.5-1.5v-9A1.5 1.5 0 0019.5 7z" fill="#5059C9"/>
    <circle cx="12" cy="11" r="2.5" fill="#fff"/>
    <path d="M9 14.5c0-1.1 1.3-2 3-2s3 .9 3 2v.5H9v-.5z" fill="#fff"/>
  </svg>
);

export default MicrosoftTeamsLogo;
