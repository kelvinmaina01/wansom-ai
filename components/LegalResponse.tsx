
import React from 'react';
import { LegalMessage } from '../types';
import { 
  Copy, 
  Bookmark, 
  ShieldCheck,
  ExternalLink,
  Share2,
  Download,
  Printer,
  MoreHorizontal
} from 'lucide-react';

interface LegalResponseProps {
  message: LegalMessage;
}

const LegalResponse: React.FC<LegalResponseProps> = ({ message }) => {
  const isAssistant = message.role === 'assistant';

  if (!isAssistant) {
    return (
      <div className="flex justify-end mb-8">
        <div className="max-w-[80%] p-6 rounded-3xl bg-black text-white font-bold shadow-xl shadow-black/10 tracking-tight">
          {message.content}
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-start mb-12 group animate-in slide-in-from-bottom-4 duration-500">
      <div className="max-w-full w-full bg-white/70 backdrop-blur-md border border-white/20 rounded-[2.5rem] shadow-2xl shadow-black/5 overflow-hidden">
        {/* Header/Status Bar */}
        <div className="bg-gray-50/50 border-b border-gray-100 px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-secondary-green" />
            <span className="text-[10px] font-bold text-secondary-green uppercase tracking-widest">Verified Response • Kenyan Jurisdiction</span>
          </div>
          <div className="flex items-center gap-2">
            <ActionButton icon={<Copy className="w-4 h-4" />} label="Copy" title="Copy to Clipboard" />
            <ActionButton icon={<Bookmark className="w-4 h-4" />} label="Save" title="Save to Case File" />
            <div className="w-px h-4 bg-gray-200 mx-1" />
            <ActionButton icon={<Share2 className="w-4 h-4" />} label="Share" title="Share with Team" />
            <ActionButton icon={<Download className="w-4 h-4" />} label="Export" title="Download as PDF/Doc" />
            <ActionButton icon={<Printer className="w-4 h-4" />} label="Print" title="Print Document" />
            <ActionButton icon={<MoreHorizontal className="w-4 h-4" />} title="More Actions" />
          </div>
        </div>

        {/* Content Body */}
        <div className="p-10">
          <div className="prose prose-slate max-w-none text-black leading-relaxed">
            <div className="text-xl whitespace-pre-wrap font-medium tracking-tight">
               {message.content.split('\n').map((line, i) => {
                 // Red: Primary Headings & Brand Identity (The "Heartbeat")
                 if (line.startsWith('### ')) return <h3 key={i} className="text-3xl font-bold text-primary mt-10 mb-6 tracking-tighter">{line.replace('### ', '')}</h3>;
                 
                 // Black: Structural Sub-headings & Dominant Foundation
                 if (line.startsWith('## ')) return <h2 key={i} className="text-4xl font-extrabold text-black mt-12 mb-8 tracking-tighter border-b border-gray-100 pb-4">{line.replace('## ', '')}</h2>;
                 
                 // Blue: Statutory Quotes & References (The "Source")
                 if (line.startsWith('> ')) return <blockquote key={i} className="border-l-4 border-secondary-blue bg-secondary-blue/5 p-6 my-8 rounded-r-2xl italic text-secondary-blue font-serif">{line.replace('> ', '')}</blockquote>;
                 
                 // Green: Actionable Compliance & Recommendations
                 if (line.toLowerCase().startsWith('recommendation:') || line.toLowerCase().startsWith('step:')) {
                   return <p key={i} className="my-6 p-4 bg-secondary-green/5 border border-secondary-green/20 rounded-xl text-secondary-green font-bold tracking-tight">{line}</p>;
                 }

                 if (line.startsWith('**')) {
                   return <p key={i} className="my-6"><strong className="text-black font-bold tracking-tight">{line.replace(/\*\*/g, '')}</strong></p>;
                 }
                 
                 if (line.trim() === "") return <div key={i} className="h-4" />;
                 
                 // Black: Dominant Body Text
                 return <p key={i} className="mb-4 text-gray-800">{line}</p>;
               })}
            </div>
          </div>

          {/* Structured Citations Section */}
          {message.citations && message.citations.length > 0 && (
            <div className="mt-10 pt-8 border-t border-gray-100">
              <h4 className="text-[10px] font-bold text-gray-400 mb-6">Statutory Citations & References</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {message.citations.map((cite, idx) => {
                  const colors = [
                    'bg-secondary-blue/5 border-secondary-blue/10 text-secondary-blue',
                    'bg-secondary-green/5 border-secondary-green/10 text-secondary-green',
                    'bg-primary/5 border-primary/10 text-primary'
                  ];
                  const colorClass = colors[idx % colors.length];
                  const [bg, border, text] = colorClass.split(' ');

                  return (
                    <div key={idx} className={`flex flex-col p-5 bg-white border border-gray-100 rounded-2xl group/cite hover:border-secondary-blue/30 transition-all shadow-sm`}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-secondary-blue tracking-wider">{cite.statute}</span>
                        {cite.section && <span className="text-[9px] font-bold bg-secondary-green text-white px-2 py-1 rounded-lg tracking-widest">Sec {cite.section}</span>}
                      </div>
                      <p className="text-sm text-black/70 font-medium">{cite.description}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* External Verification Links */}
          {message.sources && message.sources.length > 0 && (
            <div className="mt-8 flex flex-wrap gap-3">
              {message.sources.map((source, i) => (
                <a 
                  key={i} 
                  href={source.uri} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-[10px] font-bold text-black bg-gray-50 border border-gray-200 px-4 py-2 rounded-xl hover:bg-black hover:text-white hover:border-black transition-all"
                >
                  <ExternalLink className="w-3 h-3" />
                  {source.title}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LegalResponse;

const ActionButton = ({ icon, label, title }: { icon: React.ReactNode, label?: string, title?: string }) => (
  <button 
    title={title}
    className="flex items-center gap-2 text-gray-400 hover:text-primary transition-all p-2 hover:bg-white rounded-xl group/btn active:scale-95"
  >
    {icon}
    {label && <span className="text-[10px] font-bold hidden xl:block">{label}</span>}
  </button>
);
