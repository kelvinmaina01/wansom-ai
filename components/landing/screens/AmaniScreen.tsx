import React, { useEffect, useRef, useState } from 'react';
import { Mic, Video, MessageSquare, PhoneOff, Check, ArrowRight, Scale, Share2 } from 'lucide-react';
import ScreenChrome from '../ScreenChrome';
import { LinkedInLogo } from '../logos';

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

interface Dialogue { who: 'judge' | 'user'; text: string; dur: number }

const DIALOGUE: Dialogue[] = [
  { who: 'judge', text: 'You are appearing for an injunction. Please begin.', dur: 1200 },
  { who: 'user', text: 'My Lord, the applicant seeks to restrain the respondent from disposing assets.', dur: 1400 },
  { who: 'judge', text: 'What is the locus classicus for the test for this injunction in Kenya?', dur: 1300 },
  { who: 'user', text: 'Giella v Cassman Brown — prima facie case, balance of convenience, and irreparable harm.', dur: 1600 },
  { who: 'judge', text: 'Correct. Has the applicant established inadequate damages?', dur: 1400 },
];

const FEEDBACK = [
  { color: 'bg-green-500', text: 'Giella v Cassman Brown correctly cited with all three limbs of the test.' },
  { color: 'bg-green-500', text: 'Strong argument on irreparable harm — insolvency risk clearly articulated.' },
  { color: 'bg-amber-500', text: 'Cite Pacis Credit v Kamau on dissipation of assets — directly on point.' },
  { color: 'bg-amber-500', text: 'Address balance of convenience more explicitly in opening.' },
];

const WaveBar: React.FC<{ speaking: boolean; i: number }> = ({ speaking, i }) => (
  <div
    className={`w-[3px] rounded bg-green-500 transition-all ${speaking ? '' : '!h-[3px]'}`}
    style={{
      height: speaking ? [8, 14, 10, 16, 8, 12, 6][i] : 3,
      animation: speaking ? `feat-wave .6s ease-in-out infinite ${i * 0.1}s` : 'none',
    }}
  />
);

const AmaniScreen: React.FC = () => {
  const [speaker, setSpeaker] = useState<'judge' | 'user' | null>(null);
  const [judgeBubble, setJudgeBubble] = useState('');
  const [userBubble, setUserBubble] = useState('');
  const [transcript, setTranscript] = useState<Array<{ who: string; text: string }>>([]);
  const [showScore, setShowScore] = useState(false);
  const [score, setScore] = useState(0);
  const [followupNote, setFollowupNote] = useState('');
  const [showShare, setShowShare] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: 200, y: 200 });
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
        setSpeaker(null);
        setJudgeBubble('');
        setUserBubble('');
        setTranscript([]);
        setShowScore(false);
        setScore(0);
        setFollowupNote('');
        setShowShare(false);
        await sleep(600);

        // Play dialogue
        for (const d of DIALOGUE) {
          if (cancelled.current) break;
          setSpeaker(d.who);
          if (d.who === 'judge') { setJudgeBubble(d.text); setUserBubble(''); }
          else { setUserBubble(d.text); setJudgeBubble(''); }
          setTranscript(prev => [...prev, { who: d.who === 'judge' ? 'Hon. Justice Achode' : 'Kelvin', text: d.text }]);
          await sleep(d.dur);
        }

        // Move cursor to End Session and click
        click(330, 480);
        await sleep(350);

        // End session
        setSpeaker(null);
        setJudgeBubble('');
        setUserBubble('');
        await sleep(400);

        // Show score
        setShowScore(true);
        // Animate counter
        const target = 78;
        const start = performance.now();
        const animDur = 1000;
        const animate = () => {
          const elapsed = performance.now() - start;
          const progress = Math.min(elapsed / animDur, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          setScore(Math.round(target * eased));
          if (progress < 1 && !cancelled.current) requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);

        await sleep(1500);
        setFollowupNote('Balance of convenience requires you to weigh harm to both sides. Address this next time.');
        await sleep(1500);
        
        // Move cursor to "Share on LinkedIn" and click
        click(320, 240);
        await sleep(350);
        
        setShowShare(true);
        await sleep(5000);
      }
    };
    run();
    return () => { cancelled.current = true; };
  }, []);

  return (
    <ScreenChrome title="Amani — Mock Judge Session" dark>
      {/* Cursor */}
      <div className="absolute z-[60] pointer-events-none" style={{ left: cursorPos.x, top: cursorPos.y, transform: 'translate(-50%,-50%)', transition: 'all 420ms cubic-bezier(.16,1,.3,1)' }}>
        <div className="w-3 h-3 rounded-full border-2 border-primary bg-primary/20" />
      </div>
      {ripple && <div key={ripple.key} className="absolute z-[59] pointer-events-none rounded-full bg-primary/30" style={{ left: ripple.x, top: ripple.y, width: 14, height: 14, transform: 'translate(-50%,-50%)', animation: 'feat-ripple .4s ease both' }} />}

      <div className="flex flex-col h-full bg-[#0d0d14] relative">
        {/* Video grid */}
        <div className="flex-1 grid grid-cols-2 gap-2 p-2.5 overflow-hidden">
          {/* Judge */}
          <div className={`rounded-xl overflow-hidden relative bg-[#111] border flex flex-col items-center justify-center transition-all ${speaker === 'judge' ? 'border-green-500/50 shadow-[0_0_0_2px_rgba(34,197,94,0.2)]' : 'border-[#2a2a2a]'}`}>
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e2/Martha_Koome.jpg/500px-Martha_Koome.jpg" className="absolute inset-0 w-full h-full object-cover opacity-60" alt="Judge" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
            <div className="absolute top-2 right-2 w-2.5 h-2.5 z-10">
              <span className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-50" />
              <span className="relative block w-2.5 h-2.5 rounded-full bg-green-500" />
            </div>
            <div className={`z-10 w-12 h-12 rounded-full overflow-hidden mb-2 border-2 transition-all ${speaker === 'judge' ? 'border-green-500' : 'border-transparent'}`}>
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e2/Martha_Koome.jpg/500px-Martha_Koome.jpg" className="w-full h-full object-cover" alt="Judge face" />
            </div>
            <div className="text-[10px] font-bold text-gray-300 font-[Inter] z-10">Hon. Justice Achode</div>
            <div className="text-[8px] text-gray-400 uppercase tracking-wider font-[Inter] z-10">Mock Judge · Amani AI</div>
            <div className="flex gap-[2px] items-center h-4 mt-2">
              {[0,1,2,3,4,5,6].map(i => <WaveBar key={i} speaking={speaker === 'judge'} i={i} />)}
            </div>
            {judgeBubble && (
              <div className="absolute bottom-2 left-2 right-2 bg-black/70 backdrop-blur rounded-md px-2.5 py-1.5 text-[9px] text-gray-300 font-[Inter] leading-relaxed" style={{ animation: 'feat-fadeIn .3s ease' }}>
                {judgeBubble}
              </div>
            )}
          </div>

          {/* User */}
          <div className={`rounded-xl overflow-hidden relative border flex flex-col items-center justify-center transition-all ${speaker === 'user' ? 'bg-primary/10 border-primary/50 shadow-[0_0_0_2px_rgba(239,68,68,0.2)]' : 'bg-[#111] border-[#2a2a2a]'}`}>
            <div className={`z-10 w-12 h-12 rounded-full overflow-hidden mb-2 border-2 transition-all ${speaker === 'user' ? 'border-primary' : 'border-transparent'}`}>
              <img src="/founder.png" className="w-full h-full object-cover" alt="Kelvin" />
            </div>
            <div className="text-[10px] font-bold text-gray-300 font-[Inter]">Kelvin Gichinga</div>
            <div className="text-[8px] text-gray-600 uppercase tracking-wider font-[Inter]">Advocate · Practitioner</div>
            <div className="flex gap-[2px] items-center h-4 mt-2">
              {[0,1,2,3,4,5,6].map(i => <WaveBar key={i} speaking={speaker === 'user'} i={i} />)}
            </div>
            {userBubble && (
              <div className="absolute bottom-2 left-2 right-2 bg-black/70 backdrop-blur rounded-md px-2.5 py-1.5 text-[9px] text-gray-300 font-[Inter] leading-relaxed" style={{ animation: 'feat-fadeIn .3s ease' }}>
                {userBubble}
              </div>
            )}
          </div>
        </div>

        {/* Transcript */}
        <div className="bg-[#111] border-t border-[#1a1a1a] px-3 py-2 max-h-[85px] overflow-hidden flex-shrink-0">
          <div className="text-[8px] font-black uppercase tracking-wider text-gray-600 mb-1 font-[Inter]">Live transcript</div>
          <div className="space-y-0.5">
            {transcript.slice(-3).map((t, i) => (
              <div key={i} className="text-[9px] text-gray-500 font-[Inter] leading-relaxed" style={{ animation: 'feat-fadeIn .3s ease' }}>
                <span className="text-primary font-bold">{t.who}:</span> {t.text.substring(0, 80)}{t.text.length > 80 ? '...' : ''}
              </div>
            ))}
          </div>
        </div>

        {/* Controls */}
        <div className="bg-[#0a0a12] border-t border-[#1a1a1a] px-4 py-2 flex items-center justify-center gap-2.5 flex-shrink-0">
          <div className="w-8 h-8 rounded-full bg-[#1a1a1a] border border-[#2a2a2a] flex items-center justify-center"><Mic size={13} className="text-gray-400" /></div>
          <div className="w-8 h-8 rounded-full bg-[#1a1a1a] border border-[#2a2a2a] flex items-center justify-center"><Video size={13} className="text-gray-400" /></div>
          <div className="w-8 h-8 rounded-full bg-[#1a1a1a] border border-[#2a2a2a] flex items-center justify-center"><MessageSquare size={13} className="text-gray-400" /></div>
          <button className="bg-primary border-primary rounded-full px-4 py-1.5 text-[10px] font-bold text-white flex items-center gap-1 font-[Inter]">
            <PhoneOff size={10} /> End Session
          </button>
        </div>

        {/* Score overlay */}
        {showScore && (
          <div className="absolute inset-0 bg-[#0d0d14] flex flex-col items-center justify-center p-4 z-20" style={{ animation: 'feat-fadeIn .5s ease' }}>
            <div className="flex items-center justify-between w-full mb-3">
              <div>
                <div className="text-[11px] font-black uppercase tracking-wider text-gray-400 font-[Inter]">Session Complete</div>
                <div className="text-[10px] text-gray-600 font-[Inter]">Mock Judge Assessment</div>
              </div>
              <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0a66c2]/10 border border-[#0a66c2]/30 rounded-lg text-[#0a66c2] text-[9px] font-bold font-[Inter] hover:bg-[#0a66c2]/20 transition-all">
                <LinkedInLogo className="w-3.5 h-3.5" /> Share
              </button>
            </div>
            
            <div className="flex items-end gap-2 mb-4 w-full">
              <div className="text-5xl font-extrabold text-green-500 leading-none">{score}</div>
              <div className="text-[14px] text-gray-600 font-[Inter] mb-1 font-bold">/ 100</div>
            </div>

            <div className="bg-[#111] border border-[#2a2a2a] rounded-xl p-3 w-full mb-3">
              {FEEDBACK.map((f, i) => (
                <div key={i} className="flex items-start gap-1.5 mb-1.5 last:mb-0 text-[9px] text-gray-500 font-[Inter] leading-relaxed">
                  <span className={`w-1.5 h-1.5 rounded-full ${f.color} flex-shrink-0 mt-1`} />
                  {f.text}
                </div>
              ))}
            </div>
            {followupNote && (
              <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-2.5 w-full mb-3 text-left" style={{ animation: 'feat-slideU .3s ease' }}>
                <div className="text-[8px] font-black uppercase tracking-wider text-primary mb-1 font-[Inter]">Amani AI · Follow-up</div>
                <div className="text-[9px] text-gray-400 leading-relaxed font-[Inter]">{followupNote}</div>
              </div>
            )}
            <div className="flex gap-1.5 flex-wrap w-full">
              <button className="px-2.5 py-1 bg-[#1a1a1a] border border-[#2a2a2a] rounded-md text-[9px] text-gray-400 font-[Inter] hover:border-primary/30 hover:text-primary transition-all">Improve argument</button>
              <button className="px-2.5 py-1 bg-[#1a1a1a] border border-[#2a2a2a] rounded-md text-[9px] text-gray-400 font-[Inter] hover:border-primary/30 hover:text-primary transition-all flex items-center gap-1">Practice again <ArrowRight size={8} /></button>
            </div>
          </div>
        )}

        {/* LinkedIn Share Overlay */}
        {showShare && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center p-4 z-[40]" style={{ animation: 'feat-fadeIn .3s ease' }}>
            <div className="bg-white rounded-xl w-full max-w-[420px] overflow-hidden shadow-2xl" style={{ animation: 'feat-slideU .4s ease' }}>
              <div className="bg-[#f3f2ef] px-4 py-3 border-b border-gray-200 flex items-center gap-2">
                <LinkedInLogo className="w-5 h-5 text-[#0a66c2]" />
                <span className="text-sm font-bold text-gray-800 font-[Inter]">Create a post</span>
              </div>
              <div className="p-4 bg-white">
                <div className="flex items-center gap-3 mb-3">
                  <img src="/founder.png" className="w-10 h-10 rounded-full object-cover" alt="Kelvin" />
                  <div>
                    <div className="text-sm font-bold text-gray-900 font-[Inter]">Kelvin Gichinga</div>
                    <div className="text-[10px] text-gray-500 font-[Inter]">Advocate • Practitioner</div>
                  </div>
                </div>
                <div className="text-[11px] text-gray-800 font-[Inter] mb-3 leading-relaxed">
                  Just completed a mock judge session on Interlocutory Injunctions with Amani AI on Lawlify. Scored a solid 78/100 and got excellent feedback on citing Giella v Cassman Brown. Excited for the future of legal prep! ⚖️🤖 #LegalTech #EastAfrica #Lawlify
                </div>
                <div className="rounded border border-gray-200 overflow-hidden">
                  <div className="bg-[#0a0a12] p-4 text-center border-b border-gray-200 relative">
                    <div className="absolute top-2 left-2 text-[8px] font-black tracking-wider text-white bg-green-500 px-2 py-0.5 rounded uppercase font-[Inter]">Amani AI Mock Judge</div>
                    <div className="text-5xl font-extrabold text-green-500 mb-1 mt-4">{score} / 100</div>
                    <div className="text-[9px] text-gray-400 font-[Inter] uppercase tracking-wider">Interlocutory Injunctions</div>
                  </div>
                </div>
              </div>
              <div className="px-4 py-3 bg-white border-t border-gray-100 flex justify-end">
                <button className="bg-[#0a66c2] text-white px-5 py-1.5 rounded-full text-xs font-bold font-[Inter]">Post</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ScreenChrome>
  );
};

export default AmaniScreen;
