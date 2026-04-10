import React, { useState, useEffect, useRef } from 'react';
import ScreenChrome from '../ScreenChrome';
import { GoogleDriveLogo, GoogleSheetsLogo, OneDriveLogo, SlackLogo, GmailLogo, MicrosoftTeamsLogo } from '../logos';

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

const IntegrationsScreen: React.FC = () => {
  const [connectedApps, setConnectedApps] = useState<string[]>(['drive']);
  const [authModalApp, setAuthModalApp] = useState<string | null>(null);
  const [cursorPos, setCursorPos] = useState({ x: 200, y: 300 });
  const [ripple, setRipple] = useState<{ x: number; y: number; key: number } | null>(null);
  const running = useRef(false);
  const cancelled = useRef(false);

  const click = (x: number, y: number) => {
    setCursorPos({ x, y });
    setTimeout(() => setRipple({ x, y, key: Date.now() }), 220);
  };

  useEffect(() => {
    if (running.current) return;
    running.current = true;
    cancelled.current = false;

    const run = async () => {
      while (!cancelled.current) {
        // Reset state
        setConnectedApps(['drive']);
        setAuthModalApp(null);
        await sleep(1000);
        if (cancelled.current) break;

        // Move to Slack connect button
        click(85, 230); // ~ Slack button position
        await sleep(350);
        setAuthModalApp('slack');
        await sleep(1500);
        
        // Move to Authorize button in the modal
        click(165, 205);
        await sleep(350);
        setAuthModalApp(null);
        setConnectedApps(['drive', 'slack']);
        await sleep(1500);

        // Move to OneDrive connect button
        click(285, 125); // ~ OneDrive button position
        await sleep(350);
        setAuthModalApp('onedrive');
        await sleep(1500);

        // Move to Authorize button in the modal
        click(165, 205);
        await sleep(350);
        setAuthModalApp(null);
        setConnectedApps(['drive', 'slack', 'onedrive']);
        
        await sleep(4000);
      }
    };

    run();
    return () => { cancelled.current = true; };
  }, []);

  const documentApps = [
    { id: 'drive', logo: <GoogleDriveLogo />, name: 'Google Drive', desc: 'Live Link' },
    { id: 'sheets', logo: <GoogleSheetsLogo />, name: 'Sheets', desc: 'Sheet Sync' },
    { id: 'onedrive', logo: <OneDriveLogo />, name: 'OneDrive', desc: 'Enterprise' },
  ];

  const commApps = [
    { id: 'slack', logo: <SlackLogo />, name: 'Slack', desc: 'Chat Bridge' },
    { id: 'gmail', logo: <GmailLogo />, name: 'Gmail', desc: 'Secure Link' },
    { id: 'teams', logo: <MicrosoftTeamsLogo />, name: 'Teams', desc: 'Live Bridge' },
  ];

  const renderAppCard = (item: any) => {
    const isConnected = connectedApps.includes(item.id);
    return (
      <div key={item.id} className="border border-gray-100 rounded-xl p-3 relative hover:border-primary/30 cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-md bg-white group">
        <div className="absolute top-2 right-2 text-[7px] font-black px-1.5 py-0.5 rounded-full bg-primary text-white font-[Inter]">{item.desc}</div>
        <div className="w-6 h-6 mb-2">{item.logo}</div>
        <div className="text-[10px] font-bold text-gray-800 font-[Inter]">{item.name}</div>
        <button className={`mt-2 w-full py-1 text-[8px] font-bold rounded font-[Inter] transition-all ${isConnected ? 'bg-green-500 text-white' : 'bg-gray-900 text-white hover:bg-primary'}`}>
          {isConnected ? (
            <span className="flex items-center justify-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-green-200 animate-pulse" /> Connected</span>
          ) : 'Connect'}
        </button>
      </div>
    );
  };

  const currentAuth = [...documentApps, ...commApps].find(a => a.id === authModalApp);

  return (
    <ScreenChrome title="Integrations — Workflow Bridge">
      {/* Cursor & Ripple */}
      <div className="absolute z-[50] pointer-events-none" style={{ left: cursorPos.x, top: cursorPos.y, transform: 'translate(-50%,-50%)', transition: 'all 420ms cubic-bezier(.16,1,.3,1)' }}>
        <div className="w-3 h-3 rounded-full border-2 border-primary bg-primary/20" />
      </div>
      {ripple && <div key={ripple.key} className="absolute z-[49] pointer-events-none rounded-full bg-primary/30" style={{ left: ripple.x, top: ripple.y, width: 14, height: 14, transform: 'translate(-50%,-50%)', animation: 'feat-ripple .4s ease both' }} />}

      <div className="p-4 bg-white h-full overflow-hidden relative">
        <div className="text-base font-extrabold text-gray-900 mb-1" style={{ fontFamily: 'Poppins, sans-serif' }}>Integrations</div>
        <div className="text-[10px] text-gray-400 mb-4 leading-relaxed font-[Inter]">
          Connect your <span className="text-primary font-semibold">legal and productivity tools</span> via secure MCP bridges.
        </div>

        {/* Document Management */}
        <div className="text-[9px] font-black uppercase tracking-[.12em] text-gray-300 mb-2 font-[Inter]">Document Management</div>
        <div className="grid grid-cols-3 gap-2 mb-4">
          {documentApps.map(renderAppCard)}
        </div>

        {/* Communication */}
        <div className="text-[9px] font-black uppercase tracking-[.12em] text-gray-300 mb-2 font-[Inter]">Communication</div>
        <div className="grid grid-cols-3 gap-2">
          {commApps.map(renderAppCard)}
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

        {/* Auth Modal Overlay */}
        {authModalApp && currentAuth && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-sm z-[40] flex items-center justify-center" style={{ animation: 'feat-fadeIn .2s ease' }}>
            <div className="bg-white border border-gray-200 rounded-xl shadow-2xl p-4 w-[240px]" style={{ animation: 'feat-slideU .3s ease' }}>
              <div className="flex justify-center mb-3">
                <div className="w-10 h-10 border border-gray-100 rounded-xl p-2 bg-gray-50 flex items-center justify-center">
                  {currentAuth.logo}
                </div>
              </div>
              <div className="text-[11px] font-bold text-center text-gray-900 font-[Inter] mb-1">
                Connect {currentAuth.name}
              </div>
              <div className="text-[9px] text-center text-gray-500 font-[Inter] mb-4">
                Allow Lawlify AI to securely index your {currentAuth.name} workspace via MCP? No data is stored persistently.
              </div>
              <div className="flex gap-2">
                <button className="flex-1 py-1.5 rounded-lg border border-gray-200 text-gray-600 text-[9px] font-bold font-[Inter]">Cancel</button>
                <button className="flex-1 py-1.5 rounded-lg bg-green-500 text-white text-[9px] font-bold font-[Inter]">Authorize</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ScreenChrome>
  );
};

export default IntegrationsScreen;
