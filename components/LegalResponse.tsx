import React from 'react';
import { motion } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
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
      <div className="flex justify-end mb-12">
        <div className="max-w-[70%] px-8 py-4 rounded-2xl bg-gray-900 text-white font-bold shadow-lg shadow-black/5 tracking-tight text-lg">
          {message.content}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col mb-24 animate-in slide-in-from-bottom-4 duration-500 max-w-6xl mx-auto w-full">
      {/* Response Content */}
      <div className="prose prose-slate max-w-none text-black leading-relaxed mb-12">
        <div className="text-xl font-medium tracking-tight">
          <ReactMarkdown 
            remarkPlugins={[remarkGfm]}
            components={{
              h1: ({ children }) => <h1 className="text-4xl md:text-5xl font-extrabold text-black mt-16 mb-8 tracking-tighter leading-none">{children}</h1>,
              h2: ({ children }) => <h2 className="text-3xl font-extrabold text-black mt-12 mb-6 tracking-tighter">{children}</h2>,
              h3: ({ children }) => <h3 className="text-2xl font-bold text-primary mt-10 mb-5 tracking-tighter uppercase">{children}</h3>,
              p: ({ children }) => <p className="mb-6 text-gray-900 text-lg leading-relaxed">{children}</p>,
              blockquote: ({ children }) => (
                <blockquote className="border-l-4 border-black bg-gray-50 p-6 my-8 rounded-r-2xl italic text-gray-700 font-serif">
                  {children}
                </blockquote>
              ),
              strong: ({ children }) => <span className="font-extrabold text-black tracking-tight">{children}</span>,
              ul: ({ children }) => <ul className="space-y-4 mb-8 list-none">{children}</ul>,
              li: ({ children }) => (
                <li className="flex items-start gap-3">
                  <div className="mt-2 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                  <span className="text-gray-900 text-lg">{children}</span>
                </li>
              ),
              code: ({ children }) => (
                <code className="bg-gray-100 text-primary px-2 py-0.5 rounded font-mono text-sm border border-gray-200">
                  {children}
                </code>
              )
            }}
          >
            {message.content}
          </ReactMarkdown>
          {message.isGenerating && (
            <motion.span 
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 0.8, repeat: Infinity }}
              className="inline-block w-2 h-6 bg-primary ml-1 align-middle"
            />
          )}
        </div>
      </div>

      {/* Citations in Cards */}
      {message.citations && message.citations.length > 0 && (
        <div className="mb-16">
          <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] mb-8">Statutory References & Precedents</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {message.citations.map((cite, idx) => (
              <div key={idx} className="bg-white border border-gray-100 rounded-[2rem] p-8 shadow-sm hover:shadow-xl transition-all group/cite">
                <div className="flex items-center justify-between mb-4">
                  <div className="px-3 py-1 bg-primary/10 text-primary text-[9px] font-black rounded-lg uppercase tracking-widest">
                    {cite.statute}
                  </div>
                  {cite.section && <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Section {cite.section}</span>}
                </div>
                <p className="text-sm text-black font-semibold leading-relaxed line-clamp-3">{cite.description}</p>
                <div className="mt-6 flex justify-end">
                   <button className="text-[10px] font-bold text-primary group-hover/cite:translate-x-1 transition-transform flex items-center gap-1 uppercase tracking-widest">
                     View Source <ExternalLink className="w-3 h-3" />
                   </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer Meta & Actions - Only show when generation is complete and not an error */}
      {!message.isGenerating && message.content && !message.content.toLowerCase().includes("error") && (
        <div className="pt-8 border-t border-gray-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-8 animate-in fade-in slide-in-from-top-2 duration-700">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-green-600" />
              <span className="text-[10px] font-bold text-green-600 uppercase tracking-widest">Verified Intelligence Response</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-black/40">
              <span>{message.timestamp.toLocaleDateString('en-KE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
              <span className="opacity-30">•</span>
              <span>{message.timestamp.toLocaleTimeString('en-KE', { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <ActionButton icon={<Copy className="w-4 h-4" />} label="Copy" title="Copy to Clipboard" />
            <ActionButton icon={<Bookmark className="w-4 h-4" />} label="Save" title="Save to Case File" />
            <div className="w-px h-6 bg-gray-100 mx-2" />
            <ActionButton icon={<Share2 className="w-4 h-4" />} label="Share" title="Share with Team" />
            <ActionButton icon={<Download className="w-4 h-4" />} label="Export" title="Export as PDF" />
            <ActionButton icon={<Printer className="w-4 h-4" />} label="Print" title="Print Document" />
            <ActionButton icon={<MoreHorizontal className="w-4 h-4" />} title="More Actions" />
          </div>
        </div>
      )}

      {/* Sources (Subtle) */}
      {message.sources && message.sources.length > 0 && (
        <div className="mt-8 flex flex-wrap gap-2 opacity-40 hover:opacity-100 transition-opacity">
          {message.sources.map((source, i) => (
            <a 
              key={i} 
              href={source.uri} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[9px] font-bold text-black uppercase tracking-widest hover:underline"
            >
              • {source.title}
            </a>
          ))}
        </div>
      )}
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
