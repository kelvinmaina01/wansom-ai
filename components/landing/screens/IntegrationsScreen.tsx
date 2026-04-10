import React from 'react';
import ScreenChrome from '../ScreenChrome';
import { GoogleDriveLogo, GoogleSheetsLogo, OneDriveLogo, SlackLogo, GmailLogo, MicrosoftTeamsLogo } from '../logos';

const IntegrationsScreen: React.FC = () => {
  return (
    <ScreenChrome title="Integrations — Workflow Bridge">
      <div className="p-4 bg-white h-full overflow-hidden">
        <div className="text-base font-extrabold text-gray-900 mb-1" style={{ fontFamily: 'Poppins, sans-serif' }}>Integrations</div>
        <div className="text-[10px] text-gray-400 mb-4 leading-relaxed font-[Inter]">
          Connect your <span className="text-primary font-semibold">legal and productivity tools</span> via secure MCP bridges.
        </div>

        {/* Document Management */}
        <div className="text-[9px] font-black uppercase tracking-[.12em] text-gray-300 mb-2 font-[Inter]">Document Management</div>
        <div className="grid grid-cols-3 gap-2 mb-4">
          {[
            { logo: <GoogleDriveLogo />, name: 'Google Drive', desc: 'Live Link', connected: true },
            { logo: <GoogleSheetsLogo />, name: 'Sheets', desc: 'Sheet Sync', connected: false },
            { logo: <OneDriveLogo />, name: 'OneDrive', desc: 'Enterprise', connected: false },
          ].map((item, i) => (
            <div key={i} className="border border-gray-100 rounded-xl p-3 relative hover:border-primary/30 cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-md bg-white group">
              <div className="absolute top-2 right-2 text-[7px] font-black px-1.5 py-0.5 rounded-full bg-primary text-white font-[Inter]">{item.desc}</div>
              <div className="w-6 h-6 mb-2">{item.logo}</div>
              <div className="text-[10px] font-bold text-gray-800 font-[Inter]">{item.name}</div>
              <button className={`mt-2 w-full py-1 text-[8px] font-bold rounded font-[Inter] transition-all ${item.connected ? 'bg-green-500 text-white' : 'bg-gray-900 text-white hover:bg-primary'}`}>
                {item.connected ? (
                  <span className="flex items-center justify-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-green-200 animate-pulse" /> Connected</span>
                ) : 'Connect'}
              </button>
            </div>
          ))}
        </div>

        {/* Communication */}
        <div className="text-[9px] font-black uppercase tracking-[.12em] text-gray-300 mb-2 font-[Inter]">Communication</div>
        <div className="grid grid-cols-3 gap-2">
          {[
            { logo: <SlackLogo />, name: 'Slack', desc: 'Chat Bridge' },
            { logo: <GmailLogo />, name: 'Gmail', desc: 'Secure Link' },
            { logo: <MicrosoftTeamsLogo />, name: 'Teams', desc: 'Live Bridge' },
          ].map((item, i) => (
            <div key={i} className="border border-gray-100 rounded-xl p-3 relative hover:border-primary/30 cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-md bg-white group">
              <div className="absolute top-2 right-2 text-[7px] font-black px-1.5 py-0.5 rounded-full bg-primary text-white font-[Inter]">{item.desc}</div>
              <div className="w-6 h-6 mb-2">{item.logo}</div>
              <div className="text-[10px] font-bold text-gray-800 font-[Inter]">{item.name}</div>
              <button className="mt-2 w-full py-1 bg-gray-900 text-white text-[8px] font-bold rounded font-[Inter] hover:bg-primary transition-all">Connect</button>
            </div>
          ))}
        </div>

        {/* Security bar */}
        <div className="mt-4 bg-gray-50 border border-gray-100 rounded-lg px-3 py-2 flex items-center gap-2">
          <div className="w-5 h-5 rounded bg-green-50 flex items-center justify-center">
            <svg viewBox="0 0 24 24" fill="none" className="w-3 h-3">
              <path d="M12 2L4 5v6c0 5.55 3.84 10.74 8 12 4.16-1.26 8-6.45 8-12V5l-8-3z" fill="#22c55e"/>
              <path d="M10 15l-3-3 1.4-1.4L10 12.2l5.6-5.6L17 8l-7 7z" fill="white"/>
            </svg>
          </div>
          <div>
            <div className="text-[9px] font-bold text-gray-700 font-[Inter]">Zero-knowledge MCP tunnels</div>
            <div className="text-[8px] text-gray-400 font-[Inter]">Data streamed into memory and discarded after inference. No persistence.</div>
          </div>
        </div>
      </div>
    </ScreenChrome>
  );
};

export default IntegrationsScreen;
