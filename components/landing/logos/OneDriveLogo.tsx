import React from 'react';

const OneDriveLogo: React.FC<{ className?: string }> = ({ className = 'w-full h-full' }) => (
  <svg viewBox="0 0 24 24" className={className} fill="#0078d4">
    <path d="M21.2 10.1c-.3-3.4-3.1-6.1-6.6-6.1-2.2 0-4.1 1.1-5.3 2.7-.4-.1-.9-.2-1.3-.2C5.4 6.5 3 8.9 3 11.9c0 .2 0 .4.1.6C1.8 13 1 14.4 1 16c0 2.8 2.2 5 5 5h14c2.8 0 5-2.2 5-5 0-2.6-2-4.8-3.8-5.9z"/>
  </svg>
);

export default OneDriveLogo;
