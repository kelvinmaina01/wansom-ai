import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { LegalMessage } from '../types';
import { 
  Copy as LucideCopy, 
  ThumbsUp,
  ThumbsDown,
  ExternalLink as LucideExternalLink,
  Share2 as LucideShare2,
  Download as LucideDownload,
  MoreHorizontal,
  ChevronDown as LucideChevronDown,
  ChevronRight as LucideChevronRight,
  Scale as LucideScale,
  Sparkles as LucideSparkles,
  Globe as LucideGlobe,
  Loader2,
  AlertCircle,
  FileText as LucideFileText,
  BrainCircuit,
  CheckCircle,
  RotateCcw,
  Pencil,
  Trash2,
  Check,
  PenLine,
  FileText,
  Scale
} from 'lucide-react';
import FollowUpCard from './FollowUpCard';
import { 
  AlertTriangle, 
  Info, 
  CheckCircle2, 
  HelpCircle, 
  Flag,
  Calendar,
  Lock,
  ArrowRight
} from 'lucide-react';

interface SmartCardProps {
  theme?: 'red' | 'blue' | 'purple' | 'teal' | 'amber' | 'green' | 'gray';
  title: string;
  icon?: string;
  badge?: string;
  citation?: string;
  children: React.ReactNode;
}

const SmartCard: React.FC<SmartCardProps> = ({ theme = 'blue', title, icon, badge, citation, children }) => {
  const themeClasses = {
    red: 'border-red-500 bg-red-50/50 text-red-900',
    blue: 'border-blue-500 bg-blue-50/50 text-blue-900',
    purple: 'border-purple-500 bg-purple-50/50 text-purple-900',
    teal: 'border-emerald-500 bg-emerald-50/50 text-emerald-900',
    amber: 'border-amber-500 bg-amber-50/50 text-amber-900',
    green: 'border-green-500 bg-green-50/50 text-green-900',
    gray: 'border-gray-500 bg-gray-50/50 text-gray-900'
  };

  const badgeClasses = {
    red: 'bg-red-100 text-red-700',
    blue: 'bg-blue-100 text-blue-700',
    purple: 'bg-purple-100 text-purple-700',
    teal: 'bg-emerald-100 text-emerald-700',
    amber: 'bg-amber-100 text-amber-700',
    green: 'bg-green-100 text-green-700',
    gray: 'bg-gray-100 text-gray-700'
  };

  return (
    <div className={`my-6 border-l-4 rounded-r-2xl p-6 shadow-sm ${themeClasses[theme]} transition-all hover:shadow-md`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          {icon && <span className="text-xl">{icon}</span>}
          <h4 className="font-black uppercase tracking-tight text-sm">{title}</h4>
        </div>
        {badge && (
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-tighter ${badgeClasses[theme]}`}>
            {badge}
          </span>
        )}
      </div>
      <div className="text-[15px] leading-relaxed font-medium">
        {children}
      </div>
      {citation && (
        <div className="mt-4 pt-4 border-t border-black/5 text-[10px] font-bold opacity-40 uppercase tracking-widest flex items-center gap-1">
          <LucideFileText className="w-3 h-3" /> Source: {citation}
        </div>
      )}
    </div>
  );
};

const LogoCursor = () => (
  <motion.div
    initial={{ scale: 0.5, opacity: 0 }}
    animate={{ 
      scale: [1, 1.2, 1],
      opacity: 1
    }}
    transition={{ 
      duration: 1.5,
      repeat: Infinity,
      ease: "easeInOut"
    }}
    className="flex items-center justify-center ml-2"
  >
    <div className="w-6 h-6 bg-primary rounded-lg flex items-center justify-center shadow-lg shadow-primary/20">
      <Scale className="w-4 h-4 text-white" />
    </div>
  </motion.div>
);

interface LegalResponseProps {
  message: LegalMessage;
  onArtifactClick?: (artifact: { id: string; title: string; versions: any[] }) => void;
  onEditMessage?: (id: string, newContent: string) => void;
  onReloadMessage?: (id: string) => void;
  onFollowUpSubmit?: (answers: Record<string, string | string[]>) => void;
}

const GoogleDriveIcon = ({ size = 14 }: { size?: number }) => (
  <img 
    src="/google-drive.png" 
    alt="Google Drive" 
    style={{ width: size, height: size, objectFit: 'contain' }}
  />
);

const StatusIcon = ({ type }: { type: string }) => {
  const t = type.toLowerCase();
  if (t.includes('search')) return <LucideGlobe className="w-4 h-4 text-primary animate-pulse" />;
  if (t.includes('connect')) return <LucideSparkles className="w-4 h-4 text-orange-500 animate-pulse" />;
  if (t.includes('prepar') || t.includes('draft') || t.includes('🏗️')) return <LucideFileText className="w-4 h-4 text-blue-500 animate-pulse" />;
  if (t.includes('analyz') || t.includes('🤔')) return <LucideScale className="w-4 h-4 text-green-500 animate-pulse" />;
  if (t.includes('librar') || t.includes('database') || t.includes('📚')) return <LucideScale className="w-4 h-4 text-orange-500 animate-pulse" />;
  if (t.includes('longer') || t.includes('slow')) return <AlertCircle className="w-4 h-4 text-yellow-500 italic" />;
  return <Loader2 className="w-4 h-4 text-gray-400 animate-spin" />;
};

const StatusFeed = ({ feed }: { feed: string[] }) => (
  <div className="flex flex-col gap-3 mb-8 ml-1">
    {feed.map((status, idx) => (
      <motion.div 
        key={idx}
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center gap-3 text-sm font-medium text-gray-500 tracking-tight"
      >
        <StatusIcon type={status} />
        <span className={status.toLowerCase().includes('longer') ? 'italic text-gray-400' : ''}>
          {status}
        </span>
      </motion.div>
    ))}
  </div>
);

const LegalResponse: React.FC<LegalResponseProps> = ({ 
  message, 
  onArtifactClick,
  onEditMessage,
  onReloadMessage,
  onFollowUpSubmit
}) => {
  const isAssistant = message.role === 'assistant';
  const [isThinkingOpen, setIsThinkingOpen] = React.useState(true);
  const [feedback, setFeedback] = React.useState<'up' | 'down' | null>(null);
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const handleExport = () => {
    const blob = new Blob([message.content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `lawlify-response-${new Date().getTime()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Auto-collapse thinking when generation moves to content
  React.useEffect(() => {
    if (!message.isGenerating && message.content.length > 0) {
      setIsThinkingOpen(false);
    }
  }, [message.isGenerating, message.content.length]);

  if (!isAssistant) {
    return (
      <div className="flex justify-end mb-12 group">
        <div className="relative flex flex-col items-end max-w-[70%]">
          {/* User Message Actions */}
          <div className="absolute -bottom-10 right-0 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-white border border-gray-100 rounded-xl px-2 py-1 shadow-xl z-20">
             <button 
                onClick={handleCopy}
                title="Copy prompt"
                className="p-1.5 text-gray-400 hover:text-black transition-colors"
              >
                {copied ? <CheckCircle className="w-3.5 h-3.5 text-green-500" /> : <LucideCopy className="w-3.5 h-3.5" />}
              </button>
              <button 
                onClick={() => onEditMessage?.(message.id, message.content)}
                title="Edit and resend"
                className="p-1.5 text-gray-400 hover:text-black transition-colors"
              >
                <Pencil className="w-3.5 h-3.5" />
              </button>
              <button 
                onClick={() => onReloadMessage?.(message.id)}
                title="Regenerate response"
                className="p-1.5 text-gray-400 hover:text-black transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
          </div>

          <div className="px-6 py-3 rounded-[20px] rounded-tr-[5px] bg-gray-900 text-white font-bold shadow-lg shadow-black/5 tracking-tight text-base z-10">
            {message.content}
          </div>
          <div className="mt-1.5 text-[9px] font-bold text-gray-400 uppercase tracking-widest mr-2">
            You • {message.timestamp.toLocaleTimeString('en-KE', { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col mb-24 animate-in fade-in duration-700 max-w-6xl mx-auto w-full">

      {/* Claude-style Status Feed */}
      {message.isGenerating && message.statusFeed && message.statusFeed.length > 0 && (
        <StatusFeed feed={message.statusFeed} />
      )}

      {/* Claude-style Thinking Block */}
      {message.thinking && (
        <div className="mb-8">
          <button 
            onClick={() => setIsThinkingOpen(!isThinkingOpen)}
            className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 rounded-[15px] transition-colors text-gray-500 font-bold"
          >
            {isThinkingOpen ? <LucideChevronDown className="w-4 h-4" /> : <LucideChevronRight className="w-4 h-4" />}
            <BrainCircuit className="w-4 h-4" />
            <span className="text-xs uppercase tracking-widest">{message.isGenerating && !message.content ? 'Thinking Process...' : `Thought Process`}</span>
          </button>
          
          <AnimatePresence>
            {isThinkingOpen && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="mt-4 ml-6 pl-4 border-l-2 border-gray-200">
                  <div className="prose prose-slate max-w-none text-gray-500 italic text-[15px] leading-relaxed">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {message.thinking}
                    </ReactMarkdown>
                    {message.isGenerating && !message.content && (
                      <span className="inline-block w-2.5 h-4 bg-gray-400 ml-1 align-middle animate-pulse" />
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Response Content */}
      {(message.content || (!message.thinking && message.isGenerating)) && (
      <div className="prose prose-slate max-w-none text-black leading-relaxed mb-12">
        <div className="relative">
          <div className="text-xl font-medium tracking-tight relative">
            <ReactMarkdown 
              remarkPlugins={[remarkGfm]}
              components={{
                h1: ({ children }) => <h1 className="text-4xl md:text-5xl font-extrabold text-primary mt-16 mb-8 tracking-tighter leading-snug">{children}</h1>,
                h2: ({ children }) => <h2 className="text-2xl md:text-3xl font-extrabold text-primary mt-12 mb-6 tracking-tight border-b-2 border-gray-100 pb-2">{children}</h2>,
                h3: ({ children }) => <h3 className="text-xl md:text-2xl font-bold text-primary mt-10 mb-4 tracking-tight flex items-center gap-2 group">
                  <span className="w-1 h-6 bg-primary/20 rounded-full group-hover:bg-primary transition-colors" />
                  {children}
                </h3>,
                p: ({ children }) => <p className="mb-6 text-gray-800 text-lg leading-relaxed antialiased">{children}</p>,
                blockquote: ({ children }) => (
                  <blockquote className="border-l-4 border-primary/40 bg-gray-50/50 p-8 my-10 rounded-r-[15px] italic text-gray-700 font-serif text-xl leading-relaxed shadow-sm">
                    {children}
                  </blockquote>
                ),
                strong: ({ children }) => <strong className="font-black text-black tracking-tight">{children}</strong>,
                a: ({ children, href }) => (
                  <a 
                    href={href} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-green-600 font-bold hover:underline decoration-green-300 underline-offset-4 transition-all"
                  >
                    {children}
                  </a>
                ),
                ul: ({ children }) => <ul className="space-y-5 mb-10 list-none mt-4">{children}</ul>,
                ol: ({ children }) => <ol className="space-y-5 mb-10 list-decimal ml-6 mt-4">{children}</ol>,
                li: ({ children }) => (
                  <li className="flex items-start gap-4 group/li">
                    <div className="mt-2.5 w-2 h-2 rounded-full bg-primary/20 group-hover/li:bg-primary shrink-0 transition-all duration-300 group-hover/li:scale-125" />
                    <span className="text-gray-900 text-[17px] leading-relaxed">{children}</span>
                  </li>
                ),
                code: ({ children, className, ...props }: any) => {
                  const match = /language-(\w+)/.exec(className || '');
                  const lang = match ? match[1] : '';
                  const content = String(children).replace(/\n$/, '');

                  if (lang === 'html') {
                    return (
                      <div className="my-8 border border-gray-100 rounded-[15px] bg-gray-50/50 overflow-hidden shadow-sm">
                        <pre className="p-8 text-[13px] font-mono leading-relaxed text-gray-600 overflow-x-auto selection:bg-primary selection:text-white">
                          {children}
                        </pre>
                      </div>
                    );
                  }

                  if (lang === 'smartcard') {
                    // Extract attributes from the meta string (e.g., ```smartcard title="Title" theme="blue")
                    const meta = (props as any).node?.data?.meta || '';
                    const title = meta.match(/title="([^"]+)"/)?.[1] || 'Intelligence Card';
                    const theme = (meta.match(/theme="([^"]+)"/)?.[1] || 'blue') as any;
                    const icon = meta.match(/icon="([^"]+)"/)?.[1] || '⚖️';
                    const badge = meta.match(/badge="([^"]+)"/)?.[1];
                    const citation = meta.match(/citation="([^"]+)"/)?.[1];

                    return (
                      <SmartCard 
                        title={title}
                        theme={theme}
                        icon={icon}
                        badge={badge}
                        citation={citation}
                      >
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
                      </SmartCard>
                    );
                  }

                  return (
                    <code className="bg-gray-100/80 text-primary px-2 py-0.5 rounded-lg font-mono text-[13px] border border-gray-200/50">
                      {children}
                    </code>
                  );
                }
              }}
            >
              {message.content}
            </ReactMarkdown>
            {message.isGenerating && <LogoCursor />}
          </div>
        </div>
      </div>
      )}

      {/* Follow-up Question Card */}
      {message.followup && (
        <FollowUpCard 
          questions={message.followup.questions}
          onClose={() => {}} // Could hide it
          onSubmit={(answers) => onFollowUpSubmit?.(answers)}
        />
      )}

      {/* Citations in Cards */}
      {message.citations && message.citations.length > 0 && (
        <div className="mb-16">
          <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] mb-8">Statutory References & Precedents</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {message.citations.map((cite, idx) => (
              <div key={idx} className="bg-white border border-gray-100 rounded-[15px] p-8 shadow-sm hover:shadow-xl transition-all group/cite">
                <div className="flex items-center justify-between mb-4">
                  <div className="px-3 py-1 bg-primary/10 text-primary text-[9px] font-black rounded-lg uppercase tracking-widest">
                    {cite.statute}
                  </div>
                  {cite.section && <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Section {cite.section}</span>}
                </div>
                <p className="text-sm text-black font-semibold leading-relaxed line-clamp-3">{cite.description}</p>
                <div className="mt-6 flex justify-end">
                   <button className="text-[10px] font-bold text-primary group-hover/cite:translate-x-1 transition-transform flex items-center gap-1 uppercase tracking-widest">
                     View Source <LucideExternalLink className="w-3 h-3" />
                   </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Artifact Card (Claude-style) */}
      {message.artifact && (
        <div className="mb-12">
          <motion.div 
            whileHover={{ scale: 1.01, y: -2 }}
            className="group flex flex-col md:flex-row items-center gap-4 p-4 md:p-5 bg-white border border-gray-100 rounded-[15px] shadow-sm hover:shadow-xl transition-all cursor-pointer relative"
            onClick={() => onArtifactClick?.(message.artifact!)}
          >
            {/* Artifact Icon Overlay */}
               <LucideFileText className="w-8 h-8 text-gray-300" />

            <div className="flex-1 text-center md:text-left">
              <h4 className="font-bold text-gray-900 tracking-tight mb-1">{message.artifact.title}</h4>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                {message.artifact.type?.toUpperCase() || 'DOCUMENT'} • {message.artifact.versions.length} Version{message.artifact.versions.length > 1 ? 's' : ''}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button 
                onClick={(e) => e.stopPropagation()}
                className="w-10 h-10 bg-white border border-gray-100 rounded-xl flex items-center justify-center hover:bg-gray-50 transition-all shadow-sm"
              >
                <GoogleDriveIcon />
              </button>
              <button 
                 onClick={(e) => { e.stopPropagation(); /* download logic */ }}
                 className="px-6 py-2.5 bg-gray-900 text-white text-[11px] font-black uppercase tracking-tight rounded-xl hover:bg-primary transition-all shadow-lg shadow-black/5 flex items-center gap-2"
              >
                <LucideDownload className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Footer Meta & Actions */}
      {!message.isGenerating && message.content && !message.content.toLowerCase().includes("error") && (
        <div className="pt-8 border-t border-gray-100 flex items-center justify-between gap-8 animate-in fade-in slide-in-from-top-2 duration-700 pb-12">
          <div className="flex items-center gap-6">
            {/* Feedback Buttons */}
            <div className="flex items-center gap-1">
              <button 
                onClick={() => setFeedback('up')}
                className={`flex items-center gap-2 p-2.5 rounded-[15px] transition-all group ${feedback === 'up' ? 'text-green-600' : 'text-gray-400 hover:text-black'}`}
              >
                <ThumbsUp className="w-4 h-4" />
                <span className="text-[9px] font-black uppercase tracking-widest hidden group-hover:block animate-in slide-in-from-left-1 duration-300">Helpful</span>
              </button>
              <button 
                onClick={() => setFeedback('down')}
                className={`flex items-center gap-2 p-2.5 rounded-[15px] transition-all group ${feedback === 'down' ? 'text-red-600' : 'text-gray-400 hover:text-black'}`}
              >
                <ThumbsDown className="w-4 h-4" />
                <span className="text-[9px] font-black uppercase tracking-widest hidden group-hover:block animate-in slide-in-from-left-1 duration-300">Not Helpful</span>
              </button>
            </div>

            <div className="flex flex-col gap-0.5">
              <div className="flex items-center gap-2 text-[10px] font-bold text-black/40 uppercase tracking-widest">
                <span>{message.timestamp.toLocaleTimeString('en-KE', { hour: '2-digit', minute: '2-digit' })}</span>
                <span className="opacity-30">•</span>
                <span>{message.timestamp.toLocaleDateString('en-KE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <ActionButton 
              icon={copied ? <CheckCircle className="w-4 h-4 text-green-500" /> : <LucideCopy className="w-4 h-4" />} 
              label={copied ? "Copied" : "Copy"} 
              title="Copy to Clipboard" 
              onClick={handleCopy}
            />
            <ActionButton 
              icon={<LucideShare2 className="w-4 h-4" />} 
              label="Share" 
              title="Share with Team" 
              onClick={() => alert("Sharing link copied to clipboard (Mock)")}
            />
            <ActionButton 
              icon={<LucideDownload className="w-4 h-4" />} 
              label="Export" 
              title="Export as Markdown" 
              onClick={handleExport}
            />
            <div className="w-px h-6 bg-gray-100 mx-1" />
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

const ActionButton = ({ icon, label, title, onClick }: { icon: React.ReactNode, label?: string, title?: string, onClick?: () => void }) => (
  <button 
    title={title}
    onClick={onClick}
    className="flex items-center gap-2 text-gray-400 hover:text-black transition-all p-2.5 group relative active:scale-95"
  >
    <div className="relative z-10 transition-transform duration-300">
      {icon}
    </div>
    {label && (
      <span className="text-[10px] font-black uppercase tracking-widest hidden group-hover:block animate-in slide-in-from-left-2 duration-300 relative z-10">
        {label}
      </span>
    )}
  </button>
);
