
import React from 'react';
import { motion } from 'motion/react';
import {
  Copy as LucideCopy,
  ThumbsUp,
  ThumbsDown,
  Download as LucideDownload,
  CheckCircle,
  RotateCcw,
  Pencil,
  Scale,
} from 'lucide-react';
import type {
  LegalMessage,
  AIComponent,
  PillState,
  ThoughtEntry,
  FollowUpCardData,
  PauseCardData,
  AnswerCardData,
  CitationData,
  SuggestionsData,
  SourcesBlockData,
  ActionButtonData,
  DocPreviewData,
} from '../types';

// New chat components
import StatePill from './chat/StatePill';
import StreamingText from './chat/StreamingText';
import FollowUpCard from './chat/FollowUpCard';
import PauseCard from './chat/PauseCard';
import AnswerCard from './chat/AnswerCard';
import CitationCards from './chat/CitationCards';
import DocChatPreview from './chat/DocChatPreview';
import SuggestionChips from './chat/SuggestionChips';
import SourcesBlock from './chat/SourcesBlock';
import ActionBar from './chat/ActionBar';

// ═══════════════════════════════════════════════
// Extended message type with structured response data
// ═══════════════════════════════════════════════
export interface StructuredMessage extends LegalMessage {
  /** Current state pill */
  pillState?: PillState;
  pillLabel?: string;
  /** Structured components emitted by AI */
  components?: AIComponent[];
}

interface LegalResponseProps {
  message: StructuredMessage;
  onArtifactClick?: (artifact: { id: string; title: string; versions: any[] }) => void;
  onEditMessage?: (id: string, newContent: string) => void;
  onReloadMessage?: (id: string) => void;
  onFollowUpSubmit?: (answers: Record<string, string>) => void;
  onFollowUpSkip?: () => void;
  onPauseSubmit?: (details: Record<string, string>) => void;
  onSuggestionClick?: (suggestion: string) => void;
  onOpenCanvas?: (tab: 'preview' | 'code' | 'editor', html?: string, title?: string) => void;
  onSaveDocument?: () => void;
  onAction?: (action: string) => void;
}

const LegalResponse: React.FC<LegalResponseProps> = ({
  message,
  onArtifactClick,
  onEditMessage,
  onReloadMessage,
  onFollowUpSubmit,
  onFollowUpSkip,
  onPauseSubmit,
  onSuggestionClick,
  onOpenCanvas,
  onSaveDocument,
  onAction,
}) => {
  const isAssistant = message.role === 'assistant';
  const [feedback, setFeedback] = React.useState<'up' | 'down' | null>(null);
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Copy failed:', err);
    }
  };

  // ── USER MESSAGE ──
  if (!isAssistant) {
    return (
      <div className="flex justify-end mb-6 group animate-msg-in">
        <div className="relative flex flex-col items-end max-w-[70%]">
          {/* Hover actions */}
          <div className="absolute -bottom-8 right-0 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-white border border-gray-100 rounded-xl px-2 py-1 shadow-xl z-20">
            <button onClick={handleCopy} title="Copy" className="p-1.5 text-gray-400 hover:text-black transition-colors">
              {copied ? <CheckCircle className="w-3.5 h-3.5 text-green-500" /> : <LucideCopy className="w-3.5 h-3.5" />}
            </button>
            <button onClick={() => onEditMessage?.(message.id, message.content)} title="Edit" className="p-1.5 text-gray-400 hover:text-black transition-colors">
              <Pencil className="w-3.5 h-3.5" />
            </button>
            <button onClick={() => onReloadMessage?.(message.id)} title="Regenerate" className="p-1.5 text-gray-400 hover:text-black transition-colors">
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="flex-1 flex flex-col items-end">
            <div className="bg-white p-4 px-6 md:px-8 mb-2 rounded-3xl shadow-sm border border-gray-100 text-[16px] font-medium text-gray-800 leading-relaxed max-w-full">
              {message.content}
            </div>
            <div className="text-[10px] font-bold text-gray-300 uppercase tracking-widest mr-4">
              You • {message.timestamp.toLocaleTimeString('en-KE', { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── ASSISTANT MESSAGE ──
  // Extract structured components by type for ordered rendering
  const components = message.components || [];
  const followUpCards = components.filter(c => c.type === 'followup_card');
  const pauseCards = components.filter(c => c.type === 'pause_card');
  const answerCards = components.filter(c => c.type === 'answer_card');
  const citationSets = components.filter(c => c.type === 'citations');
  const docPreviews = components.filter(c => c.type === 'doc_preview');
  const suggestionSets = components.filter(c => c.type === 'suggestions');
  const sourcesSets = components.filter(c => c.type === 'sources');
  const actionSets = components.filter(c => c.type === 'actions');

  return (
    <div className="mb-14 animate-msg-in w-full">
      <div className="flex items-start gap-5 w-full">
        {/* AI Avatar */}
        <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white flex-shrink-0 mt-0.5 relative shadow-lg shadow-primary/20 ring-4 ring-white transition-all group-hover:scale-110">
          <Scale className="w-5 h-5" />
          <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-white shadow-sm" />
        </div>

      {/* Message Body */}
      <div className="flex-1 w-full">

        {/* 1. State Pill — always shown during generation */}
        {message.pillState && message.pillState !== 'streaming' && (
          <StatePill state={message.pillState} label={message.pillLabel || ''} />
        )}

        {/* 2. Follow-Up Card (before content, when AI is asking) */}
        {followUpCards.map((comp, i) => (
          <FollowUpCard
            key={`fup-${i}`}
            data={comp.data as FollowUpCardData}
            onSubmit={(answers) => onFollowUpSubmit?.(answers)}
            onSkip={() => onFollowUpSkip?.()}
          />
        ))}

        {/* 3. Pause Card (before content, when AI is collecting doc details) */}
        {pauseCards.map((comp, i) => (
          <PauseCard
            key={`pause-${i}`}
            data={comp.data as PauseCardData}
            onContinue={(details) => onPauseSubmit?.(details)}
          />
        ))}

        {/* 4. Streaming Text Content */}
        {message.content && (
          <StreamingText
            content={message.content}
            isStreaming={!!message.isGenerating}
          />
        )}

        {/* 5. Answer Cards */}
        {answerCards.map((comp, i) => (
          <AnswerCard key={`ac-${i}`} data={comp.data as AnswerCardData} />
        ))}

        {/* 6. Document Preview (in-chat) */}
        {docPreviews.map((comp, i) => {
          const docData = comp.data as DocPreviewData;
          return (
            <DocChatPreview
              key={`doc-${i}`}
              data={docData}
              onOpenCanvas={(tab) => onOpenCanvas?.(tab, docData.fullHtml, docData.title)}
              onSave={() => onSaveDocument?.()}
            />
          );
        })}

        {/* 7. Citation Cards Grid */}
        {citationSets.map((comp, i) => (
          <CitationCards key={`cites-${i}`} citations={comp.data as CitationData[]} />
        ))}

        {/* 8. Sources Block */}
        {sourcesSets.map((comp, i) => (
          <SourcesBlock key={`src-${i}`} data={comp.data as SourcesBlockData} />
        ))}

        {/* 9. Action Buttons */}
        {actionSets.map((comp, i) => (
          <ActionBar
            key={`act-${i}`}
            actions={comp.data as ActionButtonData[]}
            onAction={(action) => onAction?.(action)}
          />
        ))}

        {/* 10. Suggestion Chips */}
        {suggestionSets.map((comp, i) => (
          <SuggestionChips
            key={`sugg-${i}`}
            suggestions={(comp.data as SuggestionsData).suggestions}
            onSelect={(s) => onSuggestionClick?.(s)}
          />
        ))}

        {/* Legacy: Artifact trigger (existing system) */}
        {!message.isGenerating && message.artifact && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={() => onArtifactClick?.(message.artifact!)}
            className="mt-4 w-full p-4 rounded-xl bg-gray-900 text-white flex items-center justify-between group overflow-hidden relative"
          >
            <div className="flex items-center gap-3 relative z-10">
              <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                <Scale className="w-4 h-4" />
              </div>
              <div className="text-left">
                <p className="text-[9px] font-bold uppercase tracking-widest opacity-60">Document Generated</p>
                <p className="text-sm font-bold tracking-tight">{message.artifact.title}</p>
              </div>
            </div>
            <span className="text-[10px] font-bold uppercase bg-white/10 px-3 py-1 rounded-full tracking-widest relative z-10">
              Open Canvas →
            </span>
          </motion.button>
        )}

        {/* Bottom actions bar for finished messages */}
        {!message.isGenerating && message.content && (
          <div className="flex items-center gap-1 mt-3 opacity-0 hover:opacity-100 transition-opacity">
            <button onClick={handleCopy} className="p-1.5 text-gray-400 hover:text-gray-700 transition-colors" title="Copy">
              {copied ? <CheckCircle className="w-3.5 h-3.5 text-green-500" /> : <LucideCopy className="w-3.5 h-3.5" />}
            </button>
            <button onClick={() => setFeedback('up')} className={`p-1.5 transition-colors ${feedback === 'up' ? 'text-green-500' : 'text-gray-400 hover:text-gray-700'}`} title="Helpful">
              <ThumbsUp className="w-3.5 h-3.5" />
            </button>
            <button onClick={() => setFeedback('down')} className={`p-1.5 transition-colors ${feedback === 'down' ? 'text-red-500' : 'text-gray-400 hover:text-gray-700'}`} title="Not helpful">
              <ThumbsDown className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
    </div>
  );
};

export default LegalResponse;
