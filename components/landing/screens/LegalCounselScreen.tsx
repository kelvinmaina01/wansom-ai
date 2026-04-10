import React, { useEffect, useRef, useState } from 'react';
import { Send, Scale, Users, Check, Search, Plus, ChevronRight } from 'lucide-react';
import ScreenChrome from '../ScreenChrome';

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

interface Citation {
  type: string;
  title: string;
  sub: string;
}

const LegalCounselScreen: React.FC = () => {
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'ai'; content: string; state?: string }>>([]);
  const [inputText, setInputText] = useState('Assign a task...');
  const [followUp, setFollowUp] = useState<{ visible: boolean; sel1: number; sel2: number; submitted: boolean }>({ visible: false, sel1: -1, sel2: -1, submitted: false });
  const [citations, setCitations] = useState<Citation[]>([]);
  const [streamedText, setStreamedText] = useState('');
  const [showDrawer, setShowDrawer] = useState(false);
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
        // Reset
        setMessages([]);
        setInputText('Assign a task...');
        setFollowUp({ visible: false, sel1: -1, sel2: -1, submitted: false });
        setCitations([]);
        setStreamedText('');
        setShowDrawer(false);
        await sleep(500);
        if (cancelled.current) break;

        // Type question
        const q = 'What are my rights regarding land?';
        setInputText('');
        for (const ch of q) {
          if (cancelled.current) break;
          setInputText(prev => prev + ch);
          await sleep(40);
        }
        await sleep(200);
        click(340, 410);
        await sleep(350);
        setInputText('Assign a task...');
        setMessages([{ role: 'user', content: q }]);
        await sleep(500);

        // AI thinking
        setMessages(prev => [...prev, { role: 'ai', content: '', state: 'thinking' }]);
        await sleep(800);
        setMessages(prev => prev.map((m, i) => i === prev.length - 1 ? { ...m, state: 'clarifying' } : m));

        // Show follow-up card
        await sleep(500);
        setFollowUp({ visible: true, sel1: -1, sel2: -1, submitted: false });
        await sleep(1000);

        // Cursor selects "land dispute"
        click(260, 255);
        await sleep(350);
        setFollowUp(prev => ({ ...prev, sel1: 1 }));
        await sleep(600);

        // Cursor selects "Kenya"
        click(200, 335);
        await sleep(350);
        setFollowUp(prev => ({ ...prev, sel2: 0 }));
        await sleep(500);

        // Click Continue
        click(260, 375);
        await sleep(350);
        setFollowUp(prev => ({ ...prev, submitted: true }));

        // Update AI pill
        setMessages(prev => prev.map((m, i) => i === prev.length - 1 ? { ...m, state: 'searching' } : m));
        await sleep(1000);
        setMessages(prev => prev.map((m, i) => i === prev.length - 1 ? { ...m, state: 'done' } : m));

        // Stream answer
        const answer = 'Under the Land Act 2012 (Cap 280) and the Land Registration Act 2012, you have strong constitutional protections for private property — Article 40 of the Constitution 2010. For a land ownership dispute, your primary remedies are: (1) filing a suit at the Environment and Land Court (ELC), and (2) obtaining a caution on the title while the case is pending under LRA s.71.';
        let built = '';
        for (let i = 0; i < answer.length; i++) {
          if (cancelled.current) break;
          built += answer[i];
          if (i % 3 === 0) {
            setStreamedText(built);
            await sleep(10);
          }
        }
        setStreamedText(answer);

        // Show citations
        await sleep(500);
        setCitations([
          { type: 'STATUTE', title: 'Land Act 2012, s.24', sub: 'Rights of registered owners' },
          { type: 'CASE', title: 'Mwangi v Ndegwa [2021] eKLR', sub: 'ELC — ownership dispute test' },
          { type: 'STATUTE', title: 'Constitution 2010, Art. 40', sub: 'Right to property — Kenya' },
          { type: 'WEB', title: 'Kenya Law — Land Disputes', sub: 'kenyalaw.org' },
        ]);

        // Click citation to show drawer
        await sleep(1200);
        click(200, 420);
        await sleep(350);
        setShowDrawer(true);
        await sleep(4000);
        setShowDrawer(false);

        await sleep(3000);
      }
    };
    run();
    return () => { cancelled.current = true; };
  }, []);

  const opts1 = ['I want to buy or sell land', "I'm in a land ownership dispute", 'My land has been compulsorily acquired', 'Landlord/tenant rights'];
  const opts2 = ['Kenya', 'Uganda', 'Tanzania'];

  return (
    <ScreenChrome title="Lawlify AI — Legal Counsel">
      {/* Cursor */}
      <div className="absolute z-30 pointer-events-none" style={{ left: cursorPos.x, top: cursorPos.y, transform: 'translate(-50%,-50%)', transition: 'all 420ms cubic-bezier(.16,1,.3,1)' }}>
        <div className="w-3 h-3 rounded-full border-2 border-primary bg-primary/20" />
      </div>
      {ripple && <div key={ripple.key} className="absolute z-[29] pointer-events-none rounded-full bg-primary/30" style={{ left: ripple.x, top: ripple.y, width: 14, height: 14, transform: 'translate(-50%,-50%)', animation: 'feat-ripple .4s ease both' }} />}

      <div className="flex h-full">
        {/* Sidebar */}
        <div className="w-[155px] bg-black p-2.5 flex-shrink-0 flex flex-col">
          <div className="text-[10px] font-extrabold text-white pb-2 border-b border-white/10 mb-2 font-[Inter]">Lawlify<span className="text-primary">.</span>AI</div>
          <div className="bg-primary text-white rounded-lg px-2.5 py-1.5 text-[9px] font-bold mb-2 flex items-center gap-1.5 font-[Inter]">
            <Plus size={9} /> New Session
          </div>
          <div className="bg-white/10 rounded px-2 py-1 text-[9px] text-gray-500 mb-2 flex items-center gap-1.5 font-[Inter]">
            <Search size={9} /> Tactical search...
          </div>
          <div className="px-2 py-1.5 rounded text-[9px] text-white bg-white/10 mb-0.5 flex items-center gap-1.5 font-[Inter]">
            <span className="w-1.5 h-1.5 rounded-full bg-primary" /> Active sessions
          </div>
          <div className="px-2 py-1.5 text-[9px] text-gray-600 font-[Inter]">Persona library</div>
          <div className="px-2 py-1.5 text-[9px] text-gray-600 font-[Inter]">Audit history</div>
          <div className="mt-auto flex items-center gap-2 pt-2 border-t border-white/10">
            <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center text-[7px] font-extrabold text-white relative">
              K
              <span className="absolute -bottom-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-green-500 border border-black" />
            </div>
            <div>
              <div className="text-[8px] font-bold text-gray-300">Kelvin G.</div>
              <div className="text-[7px] text-gray-600 uppercase tracking-wide">Workspace Admin</div>
            </div>
          </div>
        </div>

        {/* Main chat */}
        <div className="flex-1 flex flex-col bg-white">
          <div className="flex-1 p-3 overflow-hidden flex flex-col gap-2">
            {messages.map((m, i) => (
              <div key={i} className={`flex gap-1.5 items-start ${m.role === 'user' ? 'flex-row-reverse' : ''}`} style={{ animation: 'feat-msgIn .35s ease' }}>
                <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 relative ${m.role === 'ai' ? 'bg-primary' : 'bg-gray-100'}`}>
                  {m.role === 'ai' ? <Scale size={9} className="text-white" /> : <Users size={9} className="text-gray-500" />}
                  {m.role === 'ai' && <span className="absolute -bottom-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-green-500 border border-white" />}
                </div>
                <div className={`max-w-[200px] px-2.5 py-1.5 rounded-xl text-[10px] leading-relaxed font-[Inter] ${m.role === 'ai' ? 'bg-white border border-gray-100 shadow-sm rounded-tl-sm text-gray-700' : 'bg-gray-900 text-white rounded-tr-sm'}`}>
                  {m.state === 'thinking' && <div className="flex items-center gap-1 text-purple-600 font-black uppercase tracking-wider text-[8px] border border-purple-200 rounded px-1.5 py-0.5"><span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />Analysing...</div>}
                  {m.state === 'clarifying' && <div className="flex items-center gap-1 text-purple-600 font-black uppercase tracking-wider text-[8px] border border-purple-200 rounded px-1.5 py-0.5"><span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />Need more details...</div>}
                  {m.state === 'searching' && <div className="flex items-center gap-1 text-blue-600 font-black uppercase tracking-wider text-[8px] border border-blue-200 rounded px-1.5 py-0.5"><span className="w-2 h-2 border border-blue-500 border-t-transparent rounded-full animate-spin" />Searching Kenya Land Law...</div>}
                  {m.state === 'done' && <div className="flex items-center gap-1 text-green-600 font-black uppercase tracking-wider text-[8px] border border-green-200 bg-green-50 rounded px-1.5 py-0.5"><Check size={8} strokeWidth={3} />Analysis complete</div>}
                  {m.content}
                </div>
              </div>
            ))}

            {/* Follow-up card */}
            {followUp.visible && (
              <div className="ml-7 bg-white border border-purple-300/40 rounded-xl overflow-hidden shadow-md" style={{ animation: 'feat-slideU .35s ease' }}>
                <div className="bg-purple-50/50 border-b border-purple-200/30 px-3 py-2 flex items-center gap-1.5">
                  <Scale size={10} className="text-purple-600" />
                  <span className="text-[9px] font-black text-purple-600 uppercase tracking-wide font-[Inter]">AI needs a few details</span>
                  <span className="text-[9px] text-gray-400 ml-auto font-[Inter]">2 questions</span>
                </div>
                <div className="px-3 py-2.5">
                  <div className="text-[10px] text-gray-700 mb-2 font-[Inter]">To give you precise legal advice, I need to understand your situation better:</div>
                  <div className="text-[10px] font-semibold text-gray-800 mb-1.5 font-[Inter]">What is your land matter about?</div>
                  <div className="flex flex-col gap-1 mb-2.5">
                    {opts1.map((o, i) => (
                      <div key={i} className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg border text-[9px] font-[Inter] transition-all cursor-pointer ${followUp.sel1 === i ? 'border-purple-400 bg-purple-50 text-purple-700' : 'border-gray-100 bg-gray-50 text-gray-600'}`}>
                        <span className={`w-3 h-3 rounded-full border flex items-center justify-center text-[7px] ${followUp.sel1 === i ? 'bg-purple-600 border-purple-600 text-white' : 'border-gray-300'}`}>
                          {followUp.sel1 === i && <Check size={6} strokeWidth={3} />}
                        </span>
                        {o}
                      </div>
                    ))}
                  </div>
                  <div className="text-[10px] font-semibold text-gray-800 mb-1.5 font-[Inter]">Which country?</div>
                  <div className="flex flex-col gap-1 mb-2">
                    {opts2.map((o, i) => (
                      <div key={i} className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg border text-[9px] font-[Inter] transition-all cursor-pointer ${followUp.sel2 === i ? 'border-purple-400 bg-purple-50 text-purple-700' : 'border-gray-100 bg-gray-50 text-gray-600'}`}>
                        <span className={`w-3 h-3 rounded-full border flex items-center justify-center text-[7px] ${followUp.sel2 === i ? 'bg-purple-600 border-purple-600 text-white' : 'border-gray-300'}`}>
                          {followUp.sel2 === i && <Check size={6} strokeWidth={3} />}
                        </span>
                        {o}
                      </div>
                    ))}
                  </div>
                  <button className={`w-full py-1.5 rounded-lg text-[10px] font-bold font-[Inter] transition-all ${followUp.submitted ? 'bg-green-500 text-white' : 'bg-purple-600 text-white'}`}>
                    {followUp.submitted ? 'Continuing...' : 'Continue'}
                    {!followUp.submitted && <ChevronRight size={10} className="inline ml-1" />}
                  </button>
                </div>
              </div>
            )}

            {/* Streamed answer */}
            {streamedText && (
              <div className="flex gap-1.5 items-start" style={{ animation: 'feat-msgIn .35s ease' }}>
                <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-0.5 relative">
                  <Scale size={9} className="text-white" />
                  <span className="absolute -bottom-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-green-500 border border-white" />
                </div>
                <div className="max-w-[220px] px-2.5 py-1.5 rounded-xl rounded-tl-sm bg-white border border-gray-100 shadow-sm text-[10px] leading-relaxed font-[Inter] text-gray-700">
                  {streamedText}
                  <span className="inline-block w-0.5 h-3 bg-primary animate-pulse ml-0.5 align-text-bottom" />
                </div>
              </div>
            )}

            {/* Citations */}
            {citations.length > 0 && (
              <div className="ml-7 grid grid-cols-2 gap-1.5" style={{ animation: 'feat-slideU .35s ease' }}>
                {citations.map((c, i) => (
                  <div key={i} className="bg-white border border-gray-100 rounded-lg px-2.5 py-2 cursor-pointer transition-all hover:border-primary/30 hover:bg-primary/5 hover:-translate-y-0.5 hover:shadow-md">
                    <div className="text-[7px] font-black tracking-wider uppercase text-primary mb-1 font-[Inter]">
                      {c.type === 'STATUTE' && <Scale size={7} className="inline mr-1" />}
                      {c.type === 'CASE' && <Scale size={7} className="inline mr-1" />}
                      {c.type === 'WEB' && <Search size={7} className="inline mr-1" />}
                      {c.type}
                    </div>
                    <div className="text-[9px] font-bold text-gray-800 leading-tight font-[Inter]">{c.title}</div>
                    <div className="text-[8px] text-gray-400 mt-0.5 font-[Inter]">{c.sub}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Input */}
          <div className="px-3 pb-3">
            <div className="bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1.5 text-[10px] text-gray-300 flex items-center justify-between font-[Inter]">
              <span className="truncate">{inputText}</span>
              <div className="w-5 h-5 bg-primary rounded flex items-center justify-center flex-shrink-0">
                <Send size={8} className="text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Thoughts drawer */}
      {showDrawer && (
        <div className="absolute bottom-0 left-[155px] right-0 bg-white border-t border-gray-200 rounded-t-xl p-3 shadow-[0_-8px_32px_rgba(0,0,0,0.1)] z-20" style={{ animation: 'feat-slideU .35s ease', maxHeight: 180 }}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[9px] font-black text-gray-800 uppercase tracking-wider font-[Inter]">Sources & Thoughts</span>
          </div>
          {[
            { icon: <Search size={9} className="text-blue-500" />, bg: 'bg-blue-50', title: 'Land Act 2012, s.24', sub: 'kenyalaw.org' },
            { icon: <Scale size={9} className="text-amber-500" />, bg: 'bg-amber-50', title: 'Section analysed: rights of registered owner, indefeasibility of title, exceptions for fraud.' },
            { icon: <Check size={9} className="text-green-500" />, bg: 'bg-green-50', title: 'Cross-referenced with 3 ELRC judgments on title disputes (2020-2024)' },
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-2 py-1.5 border-b border-gray-50 last:border-0">
              <div className={`w-5 h-5 rounded flex items-center justify-center flex-shrink-0 ${item.bg}`}>{item.icon}</div>
              <div>
                <div className="text-[10px] font-bold text-gray-800 font-[Inter]">{item.title}</div>
                {item.sub && <div className="text-[9px] text-blue-500 cursor-pointer font-[Inter]">{item.sub}</div>}
              </div>
            </div>
          ))}
        </div>
      )}
    </ScreenChrome>
  );
};

export default LegalCounselScreen;
