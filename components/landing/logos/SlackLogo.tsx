import React from 'react';

const SlackLogo: React.FC<{ className?: string }> = ({ className = 'w-full h-full' }) => (
  <svg viewBox="0 0 24 24" className={className}>
    <path d="M5.04 15.17a2.54 2.54 0 01-2.54 2.54 2.54 2.54 0 010-5.08h2.54v2.54z" fill="#e01e5a"/>
    <path d="M6.32 15.17a2.54 2.54 0 115.08 0v6.37a2.54 2.54 0 11-5.08 0v-6.37z" fill="#e01e5a"/>
    <path d="M8.86 5.04A2.54 2.54 0 116.32 2.5a2.54 2.54 0 012.54 2.54v2.54H8.86z" fill="#36c5f0"/>
    <path d="M8.86 6.32a2.54 2.54 0 110 5.08H2.49a2.54 2.54 0 110-5.08h6.37z" fill="#36c5f0"/>
    <path d="M18.96 8.86a2.54 2.54 0 012.54-2.54 2.54 2.54 0 010 5.08h-2.54V8.86z" fill="#2eb67d"/>
    <path d="M17.68 8.86a2.54 2.54 0 11-5.08 0V2.49a2.54 2.54 0 115.08 0v6.37z" fill="#2eb67d"/>
    <path d="M15.14 18.96a2.54 2.54 0 012.54 2.54 2.54 2.54 0 11-5.08 0v-2.54h2.54z" fill="#ecb22e"/>
    <path d="M15.14 17.68a2.54 2.54 0 110-5.08h6.37a2.54 2.54 0 110 5.08h-6.37z" fill="#ecb22e"/>
  </svg>
);

export default SlackLogo;
