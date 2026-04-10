import React from 'react';

interface ScreenChromeProps {
  title: string;
  dark?: boolean;
  children: React.ReactNode;
}

const ScreenChrome: React.FC<ScreenChromeProps> = ({ title, dark, children }) => (
  <div className="flex flex-col h-full">
    <div className={`h-9 flex items-center px-3 gap-1.5 border-b flex-shrink-0 ${dark ? 'bg-[#0d0d14] border-[#1a1a1a]' : 'bg-gray-50 border-gray-100'}`}>
      <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
      <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
      <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
      <span className={`flex-1 text-center text-[10px] font-medium font-[Inter] ${dark ? 'text-[#444]' : 'text-gray-300'}`}>{title}</span>
    </div>
    <div className="flex-1 overflow-hidden relative">{children}</div>
  </div>
);

export default ScreenChrome;
