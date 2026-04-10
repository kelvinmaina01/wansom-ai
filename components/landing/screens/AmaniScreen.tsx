import React, { useEffect, useRef, useState } from 'react';
import { Mic, Video, MessageSquare, PhoneOff, Check, ArrowRight, Users, Scale } from 'lucide-react';
import ScreenChrome from '../ScreenChrome';

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

interface Dialogue { who: 'judge' | 'user'; text: string; dur: number }

const DIALOGUE: Dialogue[] = [
  { who: 'judge', text: 'Mock Judge Session active. You are appearing for an injunction in TechBridge v Beta Ltd. Please begin.', dur: 3500 },
  { who: 'user', text: 'My Lord, the applicant seeks an interlocutory injunction to restrain the respondent from disposing of assets pending the hearing of this suit.', dur: 3200 },
  { who: 'judge', text: 'What is the locus classicus for the test for an interlocutory injunction in Kenya, Counsel?', dur: 2800 },
  { who: 'user', text: 'The test is from Giella v Cassman Brown — prima facie case, balance of convenience, and irreparable harm, My Lord.', dur: 3000 },
  { who: 'judge', text: 'Correct. Has the applicant established that damages would not be an adequate remedy?', dur: 3200 },
  { who: 'user', text: 'My Lord, the assets are being actively dissipated. Monetary compensation post-judgment would be inadequate as the respondent may be insolvent by then.', dur: 3500 },
  { who: 'judge', text: 'I see. Thank you, Counsel. I will consider the matter.', dur: 2500 },
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
  const running = useRef(false);
  const cancelled = useRef(false);

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
        await sleep(600);

        // Play dialogue
        for (const d of DIALOGUE) {
          if (cancelled.current) break;
          setSpeaker(d.who);
          if (d.who === 'judge') { setJudgeBubble(d.text); setUserBubble(''); }
          else { setUserBubble(d.text); setJudgeBubble(''); }
          setTranscript(prev => [...prev, { who: d.who === 'judge' ? 'Justice Kamau' : 'Kelvin', text: d.text }]);
          await sleep(d.dur);
        }

        // End session
        setSpeaker(null);
        setJudgeBubble('');
        setUserBubble('');
        await sleep(600);

        // Show score
        setShowScore(true);
        // Animate counter
        const target = 78;
        const start = performance.now();
        const animDur = 1200;
        const animate = () => {
          const elapsed = performance.now() - start;
          const progress = Math.min(elapsed / animDur, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          setScore(Math.round(target * eased));
          if (progress < 1 && !cancelled.current) requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);

        await sleep(2000);
        // Auto-click a follow-up
        setFollowupNote('Balance of convenience requires you to weigh harm to both sides. If the injunction is granted and the applicant loses — what is the harm to the respondent? That is what you need to address.');
        await sleep(6000);
      }
    };
    run();
    return () => { cancelled.current = true; };
  }, []);

  return (
    <ScreenChrome title="Amani — Mock Judge Session" dark>
      <div className="flex flex-col h-full bg-[#0d0d14] relative">
        {/* Video grid */}
        <div className="flex-1 grid grid-cols-2 gap-2 p-2.5 overflow-hidden">
          {/* Judge */}
          <div className={`rounded-xl overflow-hidden relative bg-[#111] border flex flex-col items-center justify-center transition-all ${speaker === 'judge' ? 'border-green-500/50 shadow-[0_0_0_2px_rgba(34,197,94,0.2)]' : 'border-[#2a2a2a]'}`}>
            <div className="absolute top-2 right-2 w-2.5 h-2.5 relative">
              <span className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-50" />
              <span className="relative block w-2.5 h-2.5 rounded-full bg-green-500" />
            </div>
            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl mb-2 border-2 transition-all ${speaker === 'judge' ? 'border-green-500' : 'border-transparent'}`}>
              <Scale size={24} className="text-blue-400" />
            </div>
            <div className="text-[10px] font-bold text-gray-300 font-[Inter]">Justice Kamau</div>
            <div className="text-[8px] text-gray-600 uppercase tracking-wider font-[Inter]">Mock Judge · Amani AI</div>
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
          <div className={`rounded-xl overflow-hidden relative bg-[#111] border flex flex-col items-center justify-center transition-all ${speaker === 'user' ? 'border-green-500/50 shadow-[0_0_0_2px_rgba(34,197,94,0.2)]' : 'border-[#2a2a2a]'}`}>
            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl mb-2 border-2 transition-all bg-primary/10 ${speaker === 'user' ? 'border-green-500' : 'border-transparent'}`}>
              <Users size={24} className="text-primary" />
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
          <div className="absolute inset-0 bg-[#0d0d14] flex flex-col items-center justify-center p-4 z-10" style={{ animation: 'feat-fadeIn .5s ease' }}>
            <div className="text-[11px] font-black uppercase tracking-wider text-gray-600 mb-3 font-[Inter]">Session Complete</div>
            <div className="text-5xl font-extrabold text-green-500 leading-none mb-1">{score}</div>
            <div className="text-[10px] text-gray-600 mb-4 font-[Inter]">out of 100 · Mock Judge Assessment</div>
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
              <button className="px-2.5 py-1 bg-[#1a1a1a] border border-[#2a2a2a] rounded-md text-[9px] text-gray-400 font-[Inter] hover:border-primary/30 hover:text-primary transition-all">Explain balance of convenience</button>
              <button className="px-2.5 py-1 bg-[#1a1a1a] border border-[#2a2a2a] rounded-md text-[9px] text-gray-400 font-[Inter] hover:border-primary/30 hover:text-primary transition-all">Tell me about Pacis Credit</button>
              <button className="px-2.5 py-1 bg-[#1a1a1a] border border-[#2a2a2a] rounded-md text-[9px] text-gray-400 font-[Inter] hover:border-primary/30 hover:text-primary transition-all flex items-center gap-1">Practice again <ArrowRight size={8} /></button>
            </div>
          </div>
        )}
      </div>
    </ScreenChrome>
  );
};

export default AmaniScreen;
