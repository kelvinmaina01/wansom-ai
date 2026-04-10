import React, { useEffect, useRef, useState } from 'react';
import { Search, ChevronDown, Check, Scale, BarChart2, TrendingUp, Target, Sparkles, MessageSquare } from 'lucide-react';
import ScreenChrome from '../ScreenChrome';

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

const JudicialAnalyticsScreen: React.FC = () => {
  const [step, setStep] = useState(0);
  /* Steps: 0=idle, 1=regionSelected, 2=courtSelected, 3=typing, 4=results, 5=summary, 6=chat */
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);
  const [region, setRegion] = useState('All Regions');
  const [court, setCourt] = useState('All Courts');
  const [searchText, setSearchText] = useState('');
  const [barsVisible, setBarsVisible] = useState(false);
  const [statsVisible, setStatsVisible] = useState(false);
  const [insightsVisible, setInsightsVisible] = useState(false);
  const [summaryOpen, setSummaryOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
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
        setStep(0); setDropdownOpen(null); setRegion('All Regions'); setCourt('All Courts'); setSearchText('');
        setBarsVisible(false); setStatsVisible(false); setInsightsVisible(false);
        setSummaryOpen(false); setChatOpen(false);
        await sleep(600);
        if (cancelled.current) break;

        // Click region dropdown
        click(85, 32); await sleep(300);
        setDropdownOpen('region'); await sleep(700);
        click(85, 62); await sleep(300);
        setRegion('Kenya'); setDropdownOpen(null); await sleep(400);

        // Click court dropdown
        click(195, 32); await sleep(300);
        setDropdownOpen('court'); await sleep(700);
        click(195, 62); await sleep(300);
        setCourt('ELRC'); setDropdownOpen(null); await sleep(400);

        // Click search, type
        click(330, 32); await sleep(300);
        const q = 'Achode';
        for (const ch of q) {
          if (cancelled.current) break;
          setSearchText(prev => prev + ch);
          await sleep(80);
        }
        await sleep(400);

        // Show results
        setStep(4);
        await sleep(200);
        setStatsVisible(true);
        await sleep(400);
        setBarsVisible(true);
        await sleep(600);
        setInsightsVisible(true);

        await sleep(2000);

        // Click Generate Summary
        click(165, 370); await sleep(350);
        setSummaryOpen(true);
        await sleep(3000);

        // Click Ask Follow-up
        click(310, 370); await sleep(350);
        setChatOpen(true);
        await sleep(4000);

        setChatOpen(false);
        setSummaryOpen(false);
        await sleep(2000);
      }
    };
    run();
    return () => { cancelled.current = true; };
  }, []);

  const bars = [
    { label: 'Unfair dismissal', pct: 74, color: 'bg-primary' },
    { label: 'Constructive dismissal', pct: 61, color: 'bg-amber-500' },
    { label: 'Redundancy disputes', pct: 48, color: 'bg-blue-500' },
  ];

  return (
    <ScreenChrome title="Judicial Analytics — Know Your Judge">
      {/* Cursor */}
      <div className="absolute z-30 pointer-events-none" style={{ left: cursorPos.x, top: cursorPos.y, transform: 'translate(-50%,-50%)', transition: 'all 420ms cubic-bezier(.16,1,.3,1)' }}>
        <div className="w-3 h-3 rounded-full border-2 border-primary bg-primary/20" />
      </div>
      {ripple && <div key={ripple.key} className="absolute z-[29] pointer-events-none rounded-full bg-primary/30" style={{ left: ripple.x, top: ripple.y, width: 14, height: 14, transform: 'translate(-50%,-50%)', animation: 'feat-ripple .4s ease both' }} />}

      <div className="bg-white h-full overflow-hidden flex flex-col">
        {/* Filter bar */}
        <div className="flex items-center gap-2 px-3 py-2 border-b border-gray-100 flex-shrink-0">
          <div className="relative">
            <button className="bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1 text-[9px] font-bold text-gray-600 flex items-center gap-1 font-[Inter]">
              {region} <ChevronDown size={8} />
            </button>
            {dropdownOpen === 'region' && (
              <div className="absolute top-full mt-1 left-0 bg-white border border-gray-100 rounded-lg shadow-xl z-20 w-28 py-0.5" style={{ animation: 'feat-slideU .2s ease' }}>
                {['Kenya', 'Uganda', 'Tanzania'].map(r => (
                  <div key={r} className="px-2.5 py-1.5 text-[9px] text-gray-600 hover:bg-primary/5 cursor-pointer font-[Inter]">{r}</div>
                ))}
              </div>
            )}
          </div>
          <div className="relative">
            <button className="bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1 text-[9px] font-bold text-gray-600 flex items-center gap-1 font-[Inter]">
              {court} <ChevronDown size={8} />
            </button>
            {dropdownOpen === 'court' && (
              <div className="absolute top-full mt-1 left-0 bg-white border border-gray-100 rounded-lg shadow-xl z-20 w-28 py-0.5" style={{ animation: 'feat-slideU .2s ease' }}>
                {['ELRC', 'High Court', 'Commercial'].map(c => (
                  <div key={c} className="px-2.5 py-1.5 text-[9px] text-gray-600 hover:bg-primary/5 cursor-pointer font-[Inter]">{c}</div>
                ))}
              </div>
            )}
          </div>
          <div className="flex-1 flex items-center bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1">
            <Search size={9} className="text-gray-400 mr-1.5" />
            <span className="text-[9px] text-gray-600 font-[Inter]">{searchText || 'Search judge...'}</span>
            {searchText && <span className="inline-block w-0.5 h-3 bg-primary animate-pulse ml-0.5" />}
          </div>
        </div>

        {/* Results area */}
        <div className="flex-1 overflow-hidden p-3">
          {step >= 4 ? (
            <div style={{ animation: 'feat-slideU .4s ease' }}>
              {/* Judge header */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <Scale size={18} className="text-primary" />
                </div>
                <div>
                  <div className="text-sm font-extrabold text-gray-900 font-[Inter]">Hon. Justice Achode</div>
                  <div className="text-[9px] text-gray-400 font-[Inter]">Environment & Land Court — Kenya</div>
                </div>
                <div className="ml-auto text-right">
                  <div className="text-2xl font-extrabold text-primary leading-none">74%</div>
                  <div className="text-[8px] text-gray-400 font-[Inter] uppercase tracking-wide">Allow Rate</div>
                </div>
              </div>

              {/* Stats grid */}
              {statsVisible && (
                <div className="grid grid-cols-3 gap-2 mb-4" style={{ animation: 'feat-fadeIn .5s ease' }}>
                  {[
                    { icon: <BarChart2 size={10} />, val: '312', label: 'Total Cases' },
                    { icon: <TrendingUp size={10} />, val: '74%', label: 'Allow Rate' },
                    { icon: <Target size={10} />, val: '89%', label: 's.41 Enforced' },
                  ].map((s, i) => (
                    <div key={i} className="bg-gray-50 border border-gray-100 rounded-lg p-2.5 text-center">
                      <div className="text-primary mb-1">{s.icon}</div>
                      <div className="text-base font-extrabold text-gray-900">{s.val}</div>
                      <div className="text-[8px] text-gray-400 font-[Inter]">{s.label}</div>
                    </div>
                  ))}
                </div>
              )}

              {/* Bar charts */}
              {barsVisible && (
                <div className="space-y-2.5 mb-4" style={{ animation: 'feat-fadeIn .5s ease' }}>
                  {bars.map((b, i) => (
                    <div key={i}>
                      <div className="flex justify-between mb-0.5">
                        <span className="text-[9px] text-gray-600 font-[Inter]">{b.label}</span>
                        <span className="text-[9px] font-bold text-gray-800 font-[Inter]">{b.pct}%</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className={`h-full ${b.color} rounded-full`} style={{ width: `${b.pct}%`, transition: 'width 1.4s cubic-bezier(.2,.8,.3,1)' }} />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Insights */}
              {insightsVisible && (
                <div className="space-y-1.5 mb-4" style={{ animation: 'feat-slideU .4s ease' }}>
                  <div className="flex items-start gap-2 text-[9px] text-gray-600 font-[Inter] leading-relaxed">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 flex-shrink-0 mt-1.5" />
                    Tends to apply proportionality test strictly in unfair dismissal matters. Regularly cites ILO conventions.
                  </div>
                  <div className="flex items-start gap-2 text-[9px] text-gray-600 font-[Inter] leading-relaxed">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0 mt-1.5" />
                    Strong enforcement of procedural fairness — employers who skip s.41 hearings lose 89% of the time.
                  </div>
                </div>
              )}

              {/* Action buttons */}
              <div className="flex gap-2">
                <button className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary text-[9px] font-bold rounded-lg border border-primary/20 font-[Inter]">
                  <Sparkles size={10} /> Generate Summary
                </button>
                <button className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 text-gray-600 text-[9px] font-bold rounded-lg border border-gray-200 font-[Inter]">
                  <MessageSquare size={10} /> Ask Follow-up
                </button>
              </div>

              {/* Summary panel */}
              {summaryOpen && (
                <div className="mt-3 bg-primary/5 border border-primary/15 rounded-xl p-3" style={{ animation: 'feat-slideU .3s ease' }}>
                  <div className="text-[8px] font-black text-primary uppercase tracking-wider mb-1.5 font-[Inter]">AI Strategic Summary</div>
                  <div className="text-[9px] text-gray-700 leading-relaxed font-[Inter]">
                    Justice Achode is a procedurally strict judge who strongly enforces s.41 of the Employment Act. Employers who fail to conduct a fair hearing prior to termination face a 89% loss rate. In unfair dismissal claims, the judge consistently applies the proportionality test from <span className="font-bold text-primary">CMC Motors v Nzioka [2019]</span> and regularly references ILO Convention 158. Strategy: emphasize procedural compliance and proportionality of sanction.
                  </div>
                </div>
              )}

              {/* Chat panel */}
              {chatOpen && (
                <div className="mt-3 bg-white border border-gray-200 rounded-xl p-3" style={{ animation: 'feat-slideU .3s ease' }}>
                  <div className="text-[8px] font-black text-gray-800 uppercase tracking-wider mb-2 font-[Inter]">Follow-up Q&A</div>
                  <div className="bg-gray-50 rounded-lg p-2 mb-2">
                    <div className="text-[9px] font-bold text-gray-700 font-[Inter]">Does Justice Achode prefer written or oral submissions?</div>
                  </div>
                  <div className="bg-primary/5 rounded-lg p-2">
                    <div className="text-[9px] text-gray-700 leading-relaxed font-[Inter]">
                      Based on 312 analyzed cases, Justice Achode shows a preference for detailed written submissions with clear statutory references. Oral arguments that cite specific section numbers receive more favorable engagement.
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <Scale size={32} className="text-gray-200 mb-3" />
              <div className="text-sm font-bold text-gray-300 font-[Inter]">Know Your Judge</div>
              <div className="text-[10px] text-gray-300 font-[Inter]">Select a region and court to begin</div>
            </div>
          )}
        </div>
      </div>
    </ScreenChrome>
  );
};

export default JudicialAnalyticsScreen;
