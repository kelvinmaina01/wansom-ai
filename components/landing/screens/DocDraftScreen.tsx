import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  FileText, Send, Download, Copy, Check, Eye, Code2, Edit3,
  Bold, Italic, Underline, AlignLeft, AlignCenter, Type, Save,
  Scale, Users,
} from 'lucide-react';
import ScreenChrome from '../ScreenChrome';
import { GoogleDriveLogo, OneDriveLogo } from '../logos';

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

const NDA_TEXT = `MUTUAL NON-DISCLOSURE AGREEMENT

TechBridge Limited (Kenya)  ·  and  ·  DataVault Uganda Limited

This Mutual Non-Disclosure Agreement ("Agreement") is entered into on [DATE] between TechBridge Limited, a company incorporated under the Companies Act 2015 of Kenya ("TechBridge"); and DataVault Uganda Limited, incorporated under the Companies Act 2012 of Uganda ("DataVault").

1. DEFINITIONS
"Confidential Information" means any information disclosed by one party (the "Disclosing Party") to the other (the "Receiving Party") that is designated as confidential or that reasonably should be understood to be confidential given the nature of the information and the circumstances of disclosure.

2. MUTUAL OBLIGATIONS
Each party shall keep all Confidential Information strictly secret, use it solely for the Purpose, and protect it with at least the same degree of care used for its own confidential information, but no less than reasonable care.

3. TERM
This Agreement shall continue for 3 years. Confidentiality obligations survive expiry.

4. GOVERNING LAW
This Agreement is governed by the laws of Kenya. Disputes shall be referred to NCIA Nairobi.`;

const ProfessionalDocContent = () => (
  <div className="font-['Inter'] text-[9px] text-gray-700 p-2 fade-in" style={{ animation: 'feat-slideU .4s ease' }}>
    <div className="border-b-2 border-primary pb-3 mb-3 flex justify-between items-center">
      <div>
        <div className="text-primary font-black tracking-[0.1em] text-[11px] uppercase">TechBridge Limited</div>
        <div className="text-gray-400 text-[8px] tracking-wide">Nairobi, Kenya • Legal Dept</div>
      </div>
      <div className="text-right">
        <div className="font-bold text-[10px] text-gray-800 uppercase tracking-wide">Mutual Non-Disclosure Agreement</div>
        <div className="text-gray-400 text-[8px]">Ref: TB-NDA-2026-04</div>
      </div>
    </div>
    
    <div className="mb-4 leading-relaxed bg-primary/5 border border-primary/10 rounded-lg p-2.5 text-[10px]">
      This Mutual Non-Disclosure Agreement ("Agreement") is entered into on <strong className="text-primary">10 April 2026</strong> between the following parties:
    </div>

    <div className="rounded-lg border border-gray-100 overflow-hidden mb-5 shadow-sm">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-50 text-gray-600 text-left text-[8px] uppercase tracking-wider">
            <th className="p-2 font-black border-b border-gray-100">Party</th>
            <th className="p-2 font-black border-b border-gray-100">Jurisdiction</th>
            <th className="p-2 font-black border-b border-gray-100">Role</th>
          </tr>
        </thead>
        <tbody className="text-[9px]">
          <tr>
            <td className="p-2 font-bold text-gray-900 border-b border-gray-50">TechBridge Limited</td>
            <td className="p-2 text-gray-600 border-b border-gray-50">Kenya (Companies Act 2015)</td>
            <td className="p-2 text-primary font-semibold border-b border-gray-50 bg-primary/5">Disclosing & Receiving</td>
          </tr>
          <tr>
            <td className="p-2 font-bold text-gray-900">DataVault Uganda Ltd</td>
            <td className="p-2 text-gray-600">Uganda (Companies Act 2012)</td>
            <td className="p-2 text-primary font-semibold bg-primary/5">Disclosing & Receiving</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div className="space-y-4">
      <div className="bg-white border border-gray-100 rounded-lg p-3 shadow-sm hover:border-primary/20 transition-all">
        <h3 className="font-black text-[10px] uppercase tracking-wide text-gray-900 border-l-2 border-primary pl-2.5 mb-2">1. DEFINITIONS</h3>
        <p className="pl-3 text-gray-500 leading-relaxed">"Confidential Information" means any information disclosed by one party (the "Disclosing Party") to the other (the "Receiving Party") that is designated as confidential or that reasonably should be understood to be confidential given the nature of the information and the circumstances of disclosure.</p>
      </div>
      <div className="bg-white border border-gray-100 rounded-lg p-3 shadow-sm hover:border-primary/20 transition-all">
        <h3 className="font-black text-[10px] uppercase tracking-wide text-gray-900 border-l-2 border-primary pl-2.5 mb-2">2. MUTUAL OBLIGATIONS</h3>
        <p className="pl-3 text-gray-500 leading-relaxed">Each party shall keep all Confidential Information strictly secret, use it solely for the Purpose, and protect it with at least the same degree of care used for its own confidential information, but no less than reasonable care.</p>
      </div>
      <div className="flex gap-4">
        <div className="flex-1 bg-white border border-gray-100 rounded-lg p-3 shadow-sm hover:border-primary/20 transition-all">
          <h3 className="font-black text-[10px] uppercase tracking-wide text-gray-900 border-l-2 border-primary pl-2.5 mb-2">3. TERM</h3>
          <p className="pl-3 text-gray-500 leading-relaxed">This Agreement shall continue for <strong className="text-gray-800">3 years</strong>. Confidentiality obligations survive expiry.</p>
        </div>
        <div className="flex-1 bg-white border border-gray-100 rounded-lg p-3 shadow-sm hover:border-primary/20 transition-all">
          <h3 className="font-black text-[10px] uppercase tracking-wide text-gray-900 border-l-2 border-primary pl-2.5 mb-2">4. GOVERNING LAW</h3>
          <p className="pl-3 text-gray-500 leading-relaxed">This Agreement is governed by the laws of <strong className="text-gray-800">Kenya</strong>. Disputes shall be referred to NCIA Nairobi.</p>
        </div>
      </div>
    </div>
  </div>
);

const DocDraftScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'preview' | 'code' | 'editor'>('preview');
  const [docFormat, setDocFormat] = useState<'minimalist' | 'professional'>('minimalist');
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'ai'; content: string; state?: string }>>([]);
  const [inputText, setInputText] = useState('Assign a task to Legal Documents Prep Agent...');
  const [docContent, setDocContent] = useState('');
  const [wordCount, setWordCount] = useState(0);
  const [saveMenuOpen, setSaveMenuOpen] = useState(false);
  const [toast, setToast] = useState('');
  const [editorFontSize, setEditorFontSize] = useState(11);
  const [editorFontFamily, setEditorFontFamily] = useState('Georgia, serif');
  const [editorBold, setEditorBold] = useState(false);
  const [editorItalic, setEditorItalic] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: 240, y: 380 });
  const [ripple, setRipple] = useState<{ x: number; y: number; key: number } | null>(null);
  const running = useRef(false);
  const cancelled = useRef(false);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 2500); };

  const click = useCallback((x: number, y: number) => {
    setCursorPos({ x, y });
    setTimeout(() => setRipple({ x, y, key: Date.now() }), 220);
  }, []);

  useEffect(() => {
    if (running.current) return;
    running.current = true;
    cancelled.current = false;

    const run = async () => {
      while (!cancelled.current) {
        // Reset
        setMessages([]);
        setDocContent('');
        setWordCount(0);
        setActiveTab('preview');
        setDocFormat('minimalist');
        setSaveMenuOpen(false);
        setInputText('Assign a task to Legal Documents Prep Agent...');
        setEditorBold(false);
        setEditorItalic(false);
        setEditorFontSize(11);
        setEditorFontFamily('Georgia, serif');
        await sleep(600);
        if (cancelled.current) break;

        // Type question
        const q = 'Draft a mutual NDA — TechBridge Ltd (Kenya) and DataVault Uganda, software integration, 3-year confidentiality, NCIA arbitration.';
        setInputText('');
        for (const ch of q) {
          if (cancelled.current) break;
          setInputText(prev => prev + ch);
          await sleep(18);
        }
        await sleep(200);
        click(306, 380);
        await sleep(350);
        setInputText('Assign a task to Legal Documents Prep Agent...');

        setMessages([{ role: 'user', content: q }]);
        await sleep(300);
        setMessages(prev => [...prev, { role: 'ai', content: '', state: 'thinking' }]);
        await sleep(800);
        setMessages(prev => prev.map((m, i) => i === prev.length - 1 ? { ...m, state: 'drafting' } : m));
        await sleep(900);
        setMessages(prev => prev.map((m, i) => i === prev.length - 1 ? { ...m, state: 'done' } : m));

        // Stream doc token by token
        let built = '';
        const chars = NDA_TEXT.split('');
        for (let i = 0; i < chars.length; i++) {
          if (cancelled.current) break;
          built += chars[i];
          if (i % 4 === 0) {
            setDocContent(built);
            setWordCount(Math.floor(built.split(/\s+/).length));
            await sleep(12);
          }
        }
        setDocContent(NDA_TEXT);
        setWordCount(NDA_TEXT.split(/\s+/).length);

        setMessages(prev => [...prev, { role: 'ai', content: 'Your Mutual NDA is ready. Review the preview, edit in canvas, or save to Drive.' }]);
        await sleep(1500);

        // Click Professional format
        click(330, 48); await sleep(400); setDocFormat('professional'); await sleep(3000);

        // Click Minimalist format
        click(280, 48); await sleep(350); setDocFormat('minimalist'); await sleep(1500);

        // Click Code tab
        click(205, 48); await sleep(400); setActiveTab('code'); await sleep(1400);

        // Click Preview tab
        click(165, 48); await sleep(300); setActiveTab('preview'); await sleep(1000);

        // Click Editor tab
        click(245, 48); await sleep(350); setActiveTab('editor'); await sleep(800);

        // Bold
        click(100, 72); await sleep(300); setEditorBold(true); await sleep(500);
        // Italic
        click(122, 72); await sleep(300); setEditorItalic(true); await sleep(500);
        // Font size
        click(170, 72); await sleep(300); setEditorFontSize(13); await sleep(400);
        // Font family
        click(230, 72); await sleep(300); setEditorFontFamily("'Times New Roman', serif"); await sleep(500);

        // Back to preview
        click(165, 48); await sleep(350); setActiveTab('preview'); await sleep(800);

        // Click Professional format again before saving
        click(330, 48); await sleep(350); setDocFormat('professional'); await sleep(1000);

        // Download
        click(415, 48); await sleep(300); setSaveMenuOpen(true); await sleep(600);
        // Click Drive
        click(415, 80); await sleep(400); setSaveMenuOpen(false);
        showToast('Saved to Google Drive');

        await sleep(5000);
      }
    };
    run();

    return () => { cancelled.current = true; };
  }, [click]);

  return (
    <ScreenChrome title="Legal Documents Prep Agent">
      {/* Animated cursor */}
      <div
        className="absolute z-30 pointer-events-none"
        style={{ left: cursorPos.x, top: cursorPos.y, transform: 'translate(-50%,-50%)', transition: 'all 420ms cubic-bezier(.16,1,.3,1)' }}
      >
        <div className="w-3 h-3 rounded-full border-2 border-primary bg-primary/20" />
      </div>
      {ripple && (
        <div
          key={ripple.key}
          className="absolute z-[29] pointer-events-none rounded-full bg-primary/30"
          style={{ left: ripple.x, top: ripple.y, width: 14, height: 14, transform: 'translate(-50%,-50%)', animation: 'feat-ripple .4s ease both' }}
        />
      )}

      {/* Toast */}
      {toast && (
        <div className="absolute bottom-3 right-3 bg-gray-900 text-white text-[10px] font-bold px-3 py-2 rounded-lg z-40 flex items-center gap-1.5 shadow-xl font-[Inter]" style={{ animation: 'feat-slideU .3s ease' }}>
          <Check size={10} /> {toast}
        </div>
      )}

      {/* Layout */}
      <div className="flex h-full">
        {/* Chat panel */}
        <div className="w-[48%] border-r border-gray-100 flex flex-col bg-white">
          <div className="flex items-center gap-2 px-3 py-2 border-b border-gray-100 text-[10px] font-bold text-gray-400 font-[Inter]">
            <FileText size={11} className="text-primary" />
            Legal Documents Prep Agent
          </div>

          <div className="flex-1 p-3 overflow-hidden flex flex-col gap-2">
            {messages.map((m, i) => (
              <div key={i} className={`flex gap-1.5 items-start ${m.role === 'user' ? 'flex-row-reverse' : ''}`} style={{ animation: 'feat-msgIn .35s ease' }}>
                <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${m.role === 'ai' ? 'bg-primary' : 'bg-gray-100'}`}>
                  {m.role === 'ai' ? <Scale size={9} className="text-white" /> : <Users size={9} className="text-gray-500" />}
                </div>
                <div className={`max-w-[180px] px-2.5 py-1.5 rounded-xl text-[10px] leading-relaxed font-[Inter] ${m.role === 'ai' ? 'bg-white border border-gray-100 shadow-sm rounded-tl-sm text-gray-700' : 'bg-gray-900 text-white rounded-tr-sm'}`}>
                  {m.state === 'thinking' && (
                    <div className="flex items-center gap-1 text-purple-600 font-black uppercase tracking-wider text-[8px] border border-purple-200 rounded px-1.5 py-0.5 mb-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />Analysing...
                    </div>
                  )}
                  {m.state === 'drafting' && (
                    <div className="flex items-center gap-1 text-blue-600 font-black uppercase tracking-wider text-[8px] border border-blue-200 rounded px-1.5 py-0.5 mb-1">
                      <span className="w-2 h-2 border border-blue-500 border-t-transparent rounded-full animate-spin" />Drafting...
                    </div>
                  )}
                  {m.state === 'done' && (
                    <div className="flex items-center gap-1 text-green-600 font-black uppercase tracking-wider text-[8px] border border-green-200 bg-green-50 rounded px-1.5 py-0.5 mb-1">
                      <Check size={8} strokeWidth={3} />Ready
                    </div>
                  )}
                  {m.content}
                </div>
              </div>
            ))}
          </div>

          <div className="px-3 pb-3">
            <div className="bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1.5 text-[10px] text-gray-300 flex items-center justify-between font-[Inter]">
              <span className="truncate">{inputText}</span>
              <div className="w-5 h-5 bg-primary rounded flex items-center justify-center flex-shrink-0">
                <Send size={8} className="text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Canvas */}
        <div className="flex-1 flex flex-col bg-white">
          {/* Canvas header */}
          <div className="flex items-center gap-2 px-3 py-2 border-b border-gray-100 flex-shrink-0">
            <FileText size={11} className="text-primary" />
            <span className="text-[10px] font-black text-gray-800 font-[Inter]">LEGAL CANVAS</span>
            <span className="text-[9px] text-gray-300 font-medium font-[Inter]">DOCUMENT · {wordCount} WORDS</span>
            <div className="flex gap-0.5 ml-8 mr-auto">
              {(['preview', 'code', 'editor'] as const).map(t => (
                <button
                  key={t}
                  className={`flex items-center gap-1 px-1.5 py-1 rounded text-[9px] font-bold font-[Inter] transition-all ${activeTab === t ? 'bg-primary/10 text-primary' : 'text-gray-400 hover:text-gray-700'} capitalize`}
                >
                  {t === 'preview' && <Eye size={9} />}
                  {t === 'code' && <Code2 size={9} />}
                  {t === 'editor' && <Edit3 size={9} />}
                  {t}
                </button>
              ))}
            </div>
            
            <div className="flex bg-gray-100 p-0.5 rounded-md mr-2">
              <button className={`px-2 py-0.5 rounded transition-all text-[8px] font-bold font-[Inter] ${docFormat === 'minimalist' ? 'bg-white shadow-sm text-gray-800' : 'text-gray-400 hover:text-gray-600'}`}>
                Classic
              </button>
              <button className={`px-2 py-0.5 rounded transition-all text-[8px] font-bold font-[Inter] flex items-center gap-1 ${docFormat === 'professional' ? 'bg-white shadow-sm text-primary' : 'text-gray-400 hover:text-gray-600'}`}>
                Professional <span className="w-1 h-1 rounded-full bg-primary/40 block ml-0.5" />
              </button>
            </div>

            <div className="relative">
              <button className="flex items-center gap-1 px-2 py-1 bg-gray-900 text-white text-[9px] font-bold rounded ml-1 font-[Inter]">
                <Download size={9} /> Download PDF
              </button>
              {saveMenuOpen && (
                <div className="absolute right-0 top-full mt-1 bg-white border border-gray-100 rounded-xl shadow-2xl z-20 w-44 py-1" style={{ animation: 'feat-slideU .2s ease' }}>
                  {[
                    { icon: <div className="w-3.5 h-3.5"><GoogleDriveLogo /></div>, label: 'Google Drive' },
                    { icon: <div className="w-3.5 h-3.5"><OneDriveLogo /></div>, label: 'OneDrive' },
                    { icon: <Download size={12} className="text-primary" />, label: 'Download PDF' },
                    { icon: <Copy size={12} className="text-gray-500" />, label: 'Copy to clipboard' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2.5 px-3 py-2 hover:bg-primary/5 cursor-pointer text-[10px] text-gray-700 transition-colors font-[Inter]">
                      {item.icon} {item.label}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Editor toolbar */}
          {activeTab === 'editor' && (
            <div className="flex items-center gap-1 px-3 py-2 border-b border-gray-100 bg-gray-50 flex-shrink-0 flex-wrap">
              <button className={`w-7 h-7 rounded flex items-center justify-center transition-all ${editorBold ? 'bg-gray-900 text-white' : 'hover:bg-gray-100 text-gray-500'}`}><Bold size={12} /></button>
              <button className={`w-7 h-7 rounded flex items-center justify-center transition-all ${editorItalic ? 'bg-gray-900 text-white' : 'hover:bg-gray-100 text-gray-500'}`}><Italic size={12} /></button>
              <button className="w-7 h-7 rounded flex items-center justify-center hover:bg-gray-100 text-gray-500"><Underline size={12} /></button>
              <span className="w-px h-5 bg-gray-200 mx-1" />
              <button className="w-7 h-7 rounded flex items-center justify-center hover:bg-gray-100 text-gray-500"><AlignLeft size={12} /></button>
              <button className="w-7 h-7 rounded flex items-center justify-center hover:bg-gray-100 text-gray-500"><AlignCenter size={12} /></button>
              <span className="w-px h-5 bg-gray-200 mx-1" />
              <div className="flex items-center gap-1 bg-white border border-gray-200 rounded px-2 py-0.5">
                <Type size={10} className="text-gray-400" />
                <span className="text-[9px] text-gray-600 font-bold font-[Inter] w-5 text-center">{editorFontSize}</span>
              </div>
              <div className="flex items-center gap-1 bg-white border border-gray-200 rounded px-2 py-0.5">
                <span className="text-[9px] text-gray-500 font-[Inter]">Aa</span>
                <span className="text-[9px] text-gray-600 font-[Inter] w-20 truncate">{editorFontFamily.split(',')[0].replace(/'/g, '')}</span>
              </div>
              <span className="w-px h-5 bg-gray-200 mx-1" />
              <button className="flex items-center gap-1 px-2 py-1 bg-primary text-white text-[9px] font-bold rounded ml-auto font-[Inter]">
                <Save size={9} /> Save
              </button>
            </div>
          )}

          {/* Canvas body */}
          <div className="flex-1 overflow-hidden relative">
            {activeTab === 'preview' && (
              <div className="p-4 h-full overflow-hidden bg-[#f8f7f4]">
                {docContent ? (
                  <div className="bg-white rounded-[10px] shadow-sm p-5 h-full overflow-hidden border border-gray-200/60 relative">
                    {docFormat === 'minimalist' ? (
                      <div style={{ fontFamily: 'Georgia, serif', fontSize: 9, color: '#333', lineHeight: 1.75, animation: 'feat-slideU .3s ease' }}>
                        <pre className="whitespace-pre-wrap" style={{ fontFamily: 'Georgia, serif', fontSize: 9 }}>{docContent}</pre>
                      </div>
                    ) : (
                      <ProfessionalDocContent />
                    )}
                  </div>
                ) : (
                  <div className="text-[9px] text-gray-300 p-3 font-mono">// Legal Canvas — waiting for document...</div>
                )}
              </div>
            )}

            {activeTab === 'code' && (
              <div className="h-full bg-[#0d1117] p-4 overflow-hidden font-mono text-[9px] leading-relaxed">
                <div><span className="text-[#7ee787]">&lt;!DOCTYPE html&gt;</span></div>
                <div><span className="text-[#7ee787]">&lt;html</span> <span className="text-[#79c0ff]">lang</span>=<span className="text-[#a5d6ff]">&quot;en&quot;</span><span className="text-[#7ee787]">&gt;</span></div>
                <div className="ml-2"><span className="text-[#7ee787]">&lt;head&gt;</span></div>
                <div className="ml-4"><span className="text-[#7ee787]">&lt;title&gt;</span><span className="text-[#f0f6fc]">Mutual NDA — TechBridge x DataVault</span><span className="text-[#7ee787]">&lt;/title&gt;</span></div>
                <div className="ml-2"><span className="text-[#7ee787]">&lt;/head&gt;</span></div>
                <div className="ml-2"><span className="text-[#7ee787]">&lt;body&gt;</span></div>
                <div className="ml-4"><span className="text-[#7ee787]">&lt;h1</span> <span className="text-[#79c0ff]">class</span>=<span className="text-[#a5d6ff]">&quot;doc-title&quot;</span><span className="text-[#7ee787]">&gt;</span><span className="text-[#f0f6fc]">MUTUAL NON-DISCLOSURE AGREEMENT</span><span className="text-[#7ee787]">&lt;/h1&gt;</span></div>
                <div className="ml-4"><span className="text-[#7ee787]">&lt;div</span> <span className="text-[#79c0ff]">class</span>=<span className="text-[#a5d6ff]">&quot;parties&quot;</span><span className="text-[#7ee787]">&gt;</span><span className="text-[#f0f6fc]">TechBridge Limited (Kenya) · DataVault Uganda</span><span className="text-[#7ee787]">&lt;/div&gt;</span></div>
                <div className="ml-4"><span className="text-[#7ee787]">&lt;section</span> <span className="text-[#79c0ff]">id</span>=<span className="text-[#a5d6ff]">&quot;defs&quot;</span><span className="text-[#7ee787]">&gt;</span></div>
                <div className="ml-6"><span className="text-[#7ee787]">&lt;h2&gt;</span><span className="text-[#f0f6fc]">1. DEFINITIONS</span><span className="text-[#7ee787]">&lt;/h2&gt;</span></div>
                <div className="ml-6"><span className="text-[#7ee787]">&lt;p&gt;</span><span className="text-[#a8b4c0]">&quot;Confidential Information&quot; means...</span><span className="text-[#7ee787]">&lt;/p&gt;</span></div>
                <div className="ml-4"><span className="text-[#7ee787]">&lt;/section&gt;</span></div>
                <div className="ml-2"><span className="text-[#7ee787]">&lt;/body&gt;</span></div>
                <div><span className="text-[#7ee787]">&lt;/html&gt;</span></div>
              </div>
            )}

            {activeTab === 'editor' && (
              <div className="p-4 h-full overflow-hidden bg-[#f8f7f4]">
                <div
                  className="bg-white rounded-md shadow-sm p-5 h-full overflow-hidden"
                  style={{
                    fontFamily: editorFontFamily,
                    fontSize: editorFontSize,
                    fontWeight: editorBold ? 700 : 400,
                    fontStyle: editorItalic ? 'italic' : 'normal',
                    color: '#333',
                    lineHeight: 1.75,
                  }}
                >
                  <pre className="whitespace-pre-wrap" style={{ fontFamily: 'inherit' }}>{docContent}</pre>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </ScreenChrome>
  );
};

export default DocDraftScreen;
