import React from 'react';

const GoogleDriveLogo: React.FC<{ className?: string }> = ({ className = 'w-full h-full' }) => (
  <svg viewBox="0 0 87.3 78" className={className}>
    <path d="M6.6 66.85l3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3L28 55H0c0 1.55.4 3.1 1.2 4.5z" fill="#0066da"/>
    <path d="M43.65 25L29.35 0c-1.35.8-2.5 1.9-3.3 3.3L1.2 50.5A9 9 0 000 55h28z" fill="#00ac47"/>
    <path d="M73.55 76.8c1.35-.8 2.5-1.9 3.3-3.3l1.6-2.75L86.1 59.5c.8-1.4 1.2-2.95 1.2-4.5H59.3l5.9 12.7z" fill="#ea4335"/>
    <path d="M43.65 25L57.95 0H29.35z" fill="#00832d"/>
    <path d="M59.3 55H87.3L73 30.5H45z" fill="#2684fc"/>
  </svg>
);

export default GoogleDriveLogo;
