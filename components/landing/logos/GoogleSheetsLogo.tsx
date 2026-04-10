import React from 'react';

const GoogleSheetsLogo: React.FC<{ className?: string }> = ({ className = 'w-full h-full' }) => (
  <svg viewBox="0 0 24 24" className={className}>
    <path d="M14.5 0H4C2.9 0 2 .9 2 2v20c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V7.5L14.5 0z" fill="#0f9d58"/>
    <path d="M14.5 0v7.5H22L14.5 0z" fill="#087f45"/>
    <path d="M7 14h10v1.5H7zm0 3h10v1.5H7zm0-6h10v1.5H7z" fill="#fff"/>
  </svg>
);

export default GoogleSheetsLogo;
