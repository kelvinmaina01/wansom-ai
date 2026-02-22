
import React from 'react';
import { LegalMessage } from '../types';
import { 
  Copy, 
  Bookmark, 
  ShieldCheck,
  ExternalLink
} from 'lucide-react';

interface LegalResponseProps {
  message: LegalMessage;
}

const LegalResponse: React.FC<LegalResponseProps> = ({ message }) => {
  const isAssistant = message.role === 'assistant';

  if (!isAssistant) {
    return (
      <div className="flex justify-end mb-8">
        <div className="max-w-[80%] p-6 rounded-3xl bg-black text-white font-bold shadow-xl shadow-black/10">
          {message.content}
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-start mb-12 group animate-in slide-in-from-bottom-4 duration-500">
      <div className="max-w-4xl w-full bg-white border border-gray-100 rounded-[2.5rem] shadow-2xl shadow-black/5 overflow-hidden">
        {/* Header/Status Bar */}
        <div className="bg-gray-50/50 border-b border-gray-100 px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-primary" />
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Lawlify Verified Response • Kenyan Jurisdiction</span>
          </div>
          <div className="flex items-center gap-4">
            <button className="text-gray-400 hover:text-primary transition-all p-1.5 hover:bg-white rounded-lg" title="Copy for Drafting">
              <Copy className="w-4 h-4" />
            </button>
            <button className="text-gray-400 hover:text-primary transition-all p-1.5 hover:bg-white rounded-lg" title="Save to Case File">
              <Bookmark className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-10">
          <div className="prose prose-slate max-w-none text-black leading-relaxed">
            <div className="text-xl whitespace-pre-wrap font-medium">
               {message.content.split('\n').map((line, i) => {
                 if (line.startsWith('### ')) return <h3 key={i} className="text-2xl font-black text-black mt-8 mb-4 tracking-tight">{line.replace('### ', '')}</h3>;
                 if (line.startsWith('**')) return <p key={i} className="my-4"><strong className="text-black font-black">{line.replace(/\*\*/g, '')}</strong></p>;
                 return <p key={i} className="mb-4">{line}</p>;
               })}
            </div>
          </div>

          {/* Structured Citations Section */}
          {message.citations && message.citations.length > 0 && (
            <div className="mt-10 pt-8 border-t border-gray-100">
              <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-6">Statutory Citations & References</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {message.citations.map((cite, idx) => (
                  <div key={idx} className="flex flex-col p-5 bg-primary/5 rounded-2xl border border-primary/10 group/cite hover:border-primary/30 transition-all">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-black text-primary uppercase tracking-wider">{cite.statute}</span>
                      {cite.section && <span className="text-[9px] font-black bg-black text-white px-2 py-1 rounded-lg uppercase tracking-widest">Sec {cite.section}</span>}
                    </div>
                    <p className="text-sm text-black/70 font-medium">{cite.description}</p>
                  </div>
                ))}
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
                  className="inline-flex items-center gap-2 text-[10px] font-black text-black bg-gray-50 border border-gray-200 px-4 py-2 rounded-xl hover:bg-black hover:text-white hover:border-black transition-all uppercase tracking-widest"
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
