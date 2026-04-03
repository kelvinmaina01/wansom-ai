# Lawlify Legal AI — Volume 3: Frontend UI & Foundation
*Research Copy — 100% Exact Content*

---

## 1. LegalResponse.tsx
**Path:** `components/LegalResponse.tsx`

```typescript
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
            <div className="p-1 px-4 mb-1 text-[16px] font-medium text-gray-800 leading-relaxed text-right w-full">
              {message.content}
            </div>
            <div className="mt-1 text-[10px] font-bold text-gray-300 uppercase tracking-widest mr-4">
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
```

---

## 2. StreamingText.tsx
**Path:** `components/chat/StreamingText.tsx`

```typescript
import React, { useEffect, useRef } from 'react';

interface StreamingTextProps {
  content: string;
  isStreaming: boolean;
}

/**
 * StreamingText renders accumulated text content with:
 * - Inline **bold** → <strong>
 * - Inline [citation] → .cite-badge
 * - Blinking red cursor when streaming
 */
const StreamingText: React.FC<StreamingTextProps> = ({ content, isStreaming }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    
    // Parse the content into formatted HTML
    const html = parseStreamContent(content);
    containerRef.current.innerHTML = html;
    
    // Add cursor if streaming
    if (isStreaming) {
      const cursor = document.createElement('span');
      cursor.className = 'stream-cursor';
      containerRef.current.appendChild(cursor);
    }
  }, [content, isStreaming]);

  return <div ref={containerRef} className="stream-body" />;
};

function parseStreamContent(text: string): string {
  if (!text) return '';
  
  // Split into paragraphs
  const paragraphs = text.split(/\n\n+/);
  
  return paragraphs.map(p => {
    if (!p.trim()) return '';
    
    let html = p.trim();
    
    // Parse PREMIUM FORMATTING TAGS (Simulation Parity)
    html = html.replace(/<red>([\s\S]*?)<\/red>/g, '<strong style="color:#c8102e;font-weight:700">$1</strong>');
    html = html.replace(/<grn>([\s\S]*?)<\/grn>/g, '<strong style="color:#22c55e;font-weight:700">$1</strong>');
    html = html.replace(/<blue>([\s\S]*?)<\/blue>/g, '<strong style="color:#3b82f6;font-weight:700">$1</strong>');
    html = html.replace(/<amb>([\s\S]*?)<\/amb>/g, '<strong style="color:#f59e0b;font-weight:700">$1</strong>');
    html = html.replace(/<purple>([\s\S]*?)<\/purple>/g, '<strong style="color:#a855f7;font-weight:700">$1</strong>');
    html = html.replace(/<bold>([\s\S]*?)<\/bold>/g, '<strong style="font-weight:700;color:#111">$1</strong>');

    // Parse **bold** → <strong>
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Parse [citation text] → cite-badge
    html = html.replace(/\[([^\]]+?)\](?!\()/g, '<span class="cite-badge">$1</span>');
    
    // Parse ### headings
    if (html.startsWith('### ')) {
      return `<h3 style="font-size:14px;font-weight:700;margin:18px 0 6px;color:#111">${html.slice(4)}</h3>`;
    }
    if (html.startsWith('## ')) {
      return `<h2 style="font-size:15px;font-weight:700;margin:20px 0 10px;color:#111;text-transform:uppercase;letter-spacing:0.03em">${html.slice(3)}</h2>`;
    }
    
    // Parse bullet points
    if (html.match(/^[-•]\s/)) {
      const items = html.split(/\n/).filter(l => l.trim());
      const lis = items.map(item => `<li>${item.replace(/^[-•]\s*/, '')}</li>`).join('');
      return `<ul style="margin:12px 0;padding-left:20px;list-style:disc;gap:4px;display:flex;flex-direction:column">${lis}</ul>`;
    }
    
    // Parse numbered lists
    if (html.match(/^\d+\.\s/)) {
      const items = html.split(/\n/).filter(l => l.trim());
      const lis = items.map(item => `<li>${item.replace(/^\d+\.\s*/, '')}</li>`).join('');
      return `<ol style="margin:12px 0;padding-left:20px;gap:6px;display:flex;flex-direction:column">${lis}</ol>`;
    }
    
    return `<p>${html}</p>`;
  }).join('');
}

export default StreamingText;
```

---

## 3. PauseCard.tsx
**Path:** `components/chat/PauseCard.tsx`

```typescript
import React, { useState } from 'react';
import type { PauseCardData } from '../../types';

interface PauseCardProps {
  data: PauseCardData;
  onContinue: (details: Record<string, string>) => void;
}

const PauseCard: React.FC<PauseCardProps> = ({ data, onContinue }) => {
  const [values, setValues] = useState<Record<string, string>>(() => {
    const defaults: Record<string, string> = {};
    data.fields.forEach(f => { if (f.defaultValue) defaults[f.id] = f.defaultValue; });
    return defaults;
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (fieldId: string, value: string) => {
    if (submitted) return;
    setValues(prev => ({ ...prev, [fieldId]: value }));
  };

  const handleContinue = () => {
    setSubmitted(true);
    setTimeout(() => onContinue(values), 500);
  };

  return (
    <div className="pause-card">
      <div className="pause-header">
        <span style={{ fontSize: 14 }}>⏸</span>
        <span className="pause-title">{data.title || 'AI paused — collecting details'}</span>
      </div>
      <div className="pause-body">
        <div className="pause-desc">{data.description}</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {/* Render fields in pairs (row layout) where possible */}
          {renderFields(data.fields, values, submitted, handleChange)}
        </div>
        <button
          className={`pause-continue ${submitted ? 'submitted' : ''}`}
          onClick={handleContinue}
          disabled={submitted}
        >
          {submitted ? '✓ Details collected — drafting…' : `✦ ${data.buttonText || 'Continue'} →`}
        </button>
      </div>
    </div>
  );
};

function renderFields(
  fields: PauseCardData['fields'],
  values: Record<string, string>,
  disabled: boolean,
  onChange: (id: string, val: string) => void
) {
  const rows: React.ReactNode[] = [];
  let i = 0;
  
  while (i < fields.length) {
    const f1 = fields[i];
    const f2 = i + 1 < fields.length ? fields[i + 1] : null;
    
    // Pair short fields (text + select) in a row, full-width for longer ones
    if (f2 && f1.type !== 'select' && f2.type !== 'select') {
      rows.push(
        <div key={f1.id} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          {renderField(f1, values, disabled, onChange)}
          {renderField(f2, values, disabled, onChange)}
        </div>
      );
      i += 2;
    } else if (f2 && (f1.type === 'select' || f2.type === 'select')) {
      rows.push(
        <div key={f1.id} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          {renderField(f1, values, disabled, onChange)}
          {renderField(f2, values, disabled, onChange)}
        </div>
      );
      i += 2;
    } else {
      rows.push(
        <div key={f1.id}>{renderField(f1, values, disabled, onChange)}</div>
      );
      i += 1;
    }
  }
  
  return rows;
}

function renderField(
  field: PauseCardData['fields'][0],
  values: Record<string, string>,
  disabled: boolean,
  onChange: (id: string, val: string) => void
) {
  const isTextArea = field.type === 'textarea';
  
  return (
    <div style={{ width: '100%' }}>
      <div className="pf-label" style={{ 
        fontSize: '10px', 
        fontWeight: 700, 
        color: 'rgba(255,255,255,0.4)', 
        textTransform: 'uppercase', 
        letterSpacing: '0.05em',
        marginBottom: '6px'
      }}>
        {field.label}
      </div>
      {field.type === 'select' && field.options ? (
        <select
          className="pf-input"
          value={values[field.id] || field.defaultValue || ''}
          onChange={(e) => onChange(field.id, e.target.value)}
          disabled={disabled}
          style={{ 
            width: '100%',
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '10px',
            padding: '10px 14px',
            color: '#fff',
            fontSize: '13px',
            cursor: disabled ? 'default' : 'pointer',
            height: '42px',
            outline: 'none'
          }}
        >
          {field.options.map(opt => (
            <option key={opt} value={opt} style={{ background: '#1a1a1a' }}>{opt}</option>
          ))}
        </select>
      ) : isTextArea ? (
        <textarea
          className="pf-input no-scrollbar"
          placeholder={field.placeholder}
          value={values[field.id] || ''}
          onChange={(e) => onChange(field.id, e.target.value)}
          disabled={disabled}
          rows={3}
          style={{ 
            width: '100%',
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '10px',
            padding: '10px 14px',
            color: '#fff',
            fontSize: '13px',
            resize: 'none',
            outline: 'none'
          }}
        />
      ) : (
        <input
          className="pf-input"
          placeholder={field.placeholder}
          value={values[field.id] || ''}
          onChange={(e) => onChange(field.id, e.target.value)}
          disabled={disabled}
          style={{ 
            width: '100%',
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '10px',
            padding: '10px 14px',
            color: '#fff',
            fontSize: '13px',
            height: '42px',
            outline: 'none'
          }}
        />
      )}
    </div>
  );
}

export default PauseCard;
```

---

## 4. index.css
**Path:** `index.css`

```css
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&family=Inter:wght@400;500;600;700;800;900&display=swap');
@import "tailwindcss";

/* ── GLOBAL DEFAULTS ── */
body {
  @apply bg-white text-black antialiased font-sans;
  margin: 0;
  padding: 0;
  overflow-x: hidden;
}

h1, h2, h3, h4, h5, h6 {
  @apply font-display text-gray-900;
}

/* ── SCROLLBAR (Simulation Parity) ── */
::-webkit-scrollbar { width: 12px; }
::-webkit-scrollbar-track { background: #f9f9f9; }
::-webkit-scrollbar-thumb { 
  background: #d4d4d4; 
  border: 3px solid #f9f9f9; 
  border-radius: 10px; 
}
::-webkit-scrollbar-thumb:hover { background: #b5b5b5; }

/* ── THEME TOKENS ── */
@theme {
  --color-primary: #ef4444;
  --color-primary-hover: #dc2626;
  --color-secondary-green: #22c55e;
  --color-secondary-blue: #3b82f6;
  --color-sidebar: #000000;
  --font-sans: "Poppins", "Inter", ui-sans-serif, system-ui, sans-serif;
  --font-display: "Poppins", sans-serif;
}

/* ── UTILITIES ── */
@layer utilities {
  .bg-dots {
    background-image: radial-gradient(rgba(0, 0, 0, 0.07) 1px, transparent 1px);
    background-size: 24px 24px;
  }
  .no-scrollbar::-webkit-scrollbar { display: none; }
  .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
}

/* ── ANIMATIONS ── */
@keyframes chatMsgIn {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes chatBlink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}
@keyframes chatSpin { to { transform: rotate(360deg); } }

.animate-msg-in { animation: chatMsgIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) both; }

/* ── CHAT SYSTEM (Full Mode) ── */

/* State Pill (Simulation 2.0) */
.state-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 800;
  margin-bottom: 16px;
  transition: all 300ms ease;
  font-family: 'Inter', sans-serif;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
.sp-thinking { background: transparent; border: 1px solid rgba(168,85,247,0.3); color: #a855f7; }
.sp-searching { background: transparent; border: 1px solid rgba(59,130,246,0.3); color: #3b82f6; }
.sp-reading { background: transparent; border: 1px solid rgba(245,158,11,0.3); color: #f59e0b; }
.sp-drafting { background: transparent; border: 1px solid rgba(239,68,68,0.3); color: #ef4444; }
.sp-done { background: rgba(34,197,94,0.05); border: 1px solid rgba(34,197,94,0.3); color: #22c55e; }
.sp-asking { background: transparent; border: 1px solid rgba(168,85,247,0.3); color: #a855f7; }
.sp-paused { background: rgba(245,158,11,0.05); border: 1px solid rgba(245,158,11,0.4); color: #f59e0b; }

.chat-spinner {
  display: inline-block;
  width: 12px; height: 12px;
  border: 1.5px solid currentColor;
  border-top-color: transparent;
  border-radius: 50%;
  animation: chatSpin 0.7s linear infinite;
}

/* Streaming Content */
.stream-cursor {
  display: inline-block;
  width: 2.5px; height: 15px;
  background: #ef4444;
  animation: chatBlink 0.65s step-end infinite;
  vertical-align: text-bottom;
  margin-left: 2px;
  border-radius: 1px;
}

.stream-body {
  color: #1a1a1a;
  line-height: 1.85;
  font-size: 15px; /* Premium readability */
  letter-spacing: -0.01em;
}
.stream-body p { margin-bottom: 16px; }

/* ── INTERACTIVE COMPONENTS ── */

/* Pause Card (Amber Simulation) */
.pause-card {
  background: #111111;
  border: 1px solid rgba(245,158,11,0.4);
  border-radius: 20px;
  overflow: hidden;
  margin: 24px 0;
  box-shadow: 0 12px 48px rgba(0,0,0,0.3);
  animation: chatMsgIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) both;
}
.pause-header {
  background: rgba(245,158,11,0.06);
  border-bottom: 1px solid rgba(245,158,11,0.15);
  padding: 14px 20px;
  display: flex; align-items: center; gap: 10px;
}
.pause-title { 
  font-size: 11px; font-weight: 800; color: #f59e0b; 
  text-transform: uppercase; letter-spacing: 0.08em;
}
.pause-body { padding: 20px; }
.pause-desc { font-size: 13px; color: #999; margin-bottom: 20px; line-height: 1.6; }

.pf-label {
  font-size: 10px; font-weight: 800;
  letter-spacing: 0.1em; text-transform: uppercase;
  color: rgba(255,255,255,0.4); margin-bottom: 6px;
}
.pf-input {
  width: 100%; background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 12px; padding: 12px 16px;
  font-family: 'Inter', sans-serif; font-size: 14px;
  color: #fff; outline: none; transition: all 0.2s;
}
.pf-input:focus { border-color: rgba(245,158,11,0.5); background: rgba(255,255,255,0.05); }

.pause-continue {
  margin-top: 20px; background: #f59e0b;
  color: #000; border: none;
  border-radius: 12px; padding: 14px 24px;
  font-family: 'Inter', sans-serif; font-size: 13px; font-weight: 800;
  cursor: pointer; width: 100%; transition: all 0.2s;
  box-shadow: 0 4px 12px rgba(245,158,11,0.2);
}
.pause-continue:hover { background: #d97706; transform: translateY(-1px); }
.pause-continue.submitted { 
  background: rgba(34,197,94,0.1); 
  color: #22c55e; 
  border: 1px solid rgba(34,197,94,0.3);
  box-shadow: none;
}

/* Answer Card */
.answer-card {
  background: #fff;
  border: 1px solid #eeeeee;
  border-radius: 16px;
  overflow: hidden;
  margin: 16px 0;
  box-shadow: 0 4px 20px rgba(0,0,0,0.03);
}
.ac-header { background: #fafafa; padding: 12px 16px; border-bottom: 1px solid #f0f0f0; }
.ac-row { display: flex; align-items: baseline; gap: 12px; padding: 10px 16px; border-bottom: 1px solid #f9f9f9; }
.ac-label { font-size: 11px; font-weight: 700; color: #999; text-transform: uppercase; width: 160px; }
.ac-value { font-size: 14px; font-weight: 600; color: #111; }

/* ── PREMIUM TEXT FORMATTING (Colors) ── */
red, \x3cred\x3e { color: #f43f5e; font-weight: 700; background: rgba(244,63,94,0.05); padding: 0 4px; border-radius: 4px; }
grn, \x3cgrn\x3e { color: #10b981; font-weight: 700; background: rgba(16,185,129,0.05); padding: 0 4px; border-radius: 4px; }
blue, \x3cblue\x3e { color: #3b82f6; font-weight: 700; background: rgba(59,130,246,0.05); padding: 0 4px; border-radius: 4px; }
amb, \x3camb\x3e { color: #f59e0b; font-weight: 700; background: rgba(245,158,11,0.05); padding: 0 4px; border-radius: 4px; }
purple, \x3cpurple\x3e { color: #a855f7; font-weight: 700; background: rgba(168,85,247,0.05); padding: 0 4px; border-radius: 4px; }
bold, \x3cbold\x3e { font-weight: 800; color: #111; }

/* ── FINAL POLISH ── */
.cite-badge {
  display: inline-flex; align-items: center; gap: 4px;
  background: rgba(239,68,68,0.06); border: 1px solid rgba(239,68,68,0.15);
  border-radius: 6px; padding: 2px 8px; font-size: 11px; font-weight: 800;
  color: #ef4444; cursor: pointer; transition: all 0.2s;
}
.cite-badge:hover { background: rgba(239,68,68,0.1); }
```

---

## 5. types.ts
**Path:** `types.ts`

```typescript
export enum AppView {
  OVERVIEW = 'overview',
  LEGAL_AI = 'legal-ai',
  FILES = 'files',
  LEGAL_SPECIALISTS = 'legal-specialists',
  INTEGRATIONS = 'integrations',
  JUDICIAL_ANALYTICS = 'judicial-analytics',
  SETTINGS = 'settings',
  HISTORY = 'history',
  PROFILE = 'profile',
  AGENTIC_MENTORSHIP = 'agentic-mentorship',
  LIBRARY = 'library',
  CASE_MANAGEMENT = 'case-management',
  DOCUMENT_INSIGHTS = 'document-insights',
  INTELLIGENCE_HUB = 'intelligence-hub'
}

export enum WorkspaceType {
  CONTRACT_REVIEW = 'Contract Review',
  CASE_PREP = 'Case Preparation',
  LEGAL_RESEARCH = 'Legal Research',
  DRAFTING = 'Drafting'
}

export interface LegalCitation {
  statute: string;
  section?: string;
  description: string;
}

export interface LegalMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  sources?: Array<{ title: string; uri: string }>;
  citations?: LegalCitation[];
  thinking?: string;
  artifact?: {
    id: string;
    title: string;
    type?: 'document' | 'casefile' | 'affidavit' | 'legal_memo' | 'contract';
    renderMode?: 'markdown' | 'html' | 'react' | 'legal-doc';
    versions: Array<{
      content: string;
      timestamp: Date;
      author?: string;
      metadata?: Record<string, any>;
    }>;
  };
  isDraft?: boolean;
  isGenerating?: boolean;
  statusFeed?: string[];
  followup?: {
    questions: Array<{
      id: string;
      text: string;
      type: 'choice' | 'multi-choice' | 'text';
      options?: string[];
      placeholder?: string;
    }>;
    currentIndex: number;
    total: number;
    answers: Record<string, string | string[]>;
  };
}

export interface LegalSpecialist {
  id: string;
  name: string;
  description: string;
  icon: string;
  practiceAreas: string[];
  instructions: string;
  isPremade?: boolean;
  category?: string;
  color?: string;
  jurisdictions?: string[];
  links?: Array<{ label: string; url: string }>;
  suggestions?: Array<{
    label: string;
    description: string;
    icon: string;
    prompt: string;
    color: 'red' | 'black' | 'blue' | 'green' | 'grey';
  }>;
  supportedDocuments?: string[];
}

export interface UserSettings {
  profile: {
    name: string;
    email: string;
    phone: string;
    firmName: string;
    avatarUrl?: string;
  };
  notifications: {
    email: boolean;
    push: boolean;
    caseUpdates: boolean;
    newsDigest: boolean;
  };
  security: {
    twoFactorEnabled: boolean;
  };
  billing: {
    plan: 'Free' | 'Pro' | 'Enterprise';
    nextBillingDate: Date;
  };
  integrations: {
    [key: string]: boolean;
  };
}

export interface Workspace {
  id: string;
  name: string;
  type: WorkspaceType;
  lastModified: Date;
}

export interface SavedPrompt {
  id: string;
  title: string;
  content: string;
  category: string;
  lastUsed: Date;
}

export interface Persona {
  id: string;
  name: string;
  role: string;
  description: string;
  instructions: string;
  avatar?: string;
}

export interface Draft {
  id: string;
  title: string;
  content: string;
  type: 'document' | 'email' | 'advice';
  projectName?: string;
  category?: string;
  lastModified: Date;
}

export interface ChatHistory {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
  messages: LegalMessage[];
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  timestamp: Date;
  read: boolean;
  category?: 'Case Law' | 'Regulation' | 'System' | 'Update';
}

export interface Activity {
  id: string;
  user: string;
  action: string;
  target: string;
  timestamp: Date;
  icon?: string;
}

export interface Project {
  id: string;
  name: string;
  client: string;
  status: 'In Progress' | 'On Hold' | 'Completed';
  progress: number;
  dueDate: Date;
  type: string;
}

// ═══════════════════════════════════════════════
// NEW: Structured AI Response System Types
// ═══════════════════════════════════════════════

/** The 8 animation states for the StatePill */
export type PillState = 'thinking' | 'searching' | 'reading' | 'drafting' | 'asking' | 'paused' | 'done' | 'streaming';

/** A single entry in the Thoughts panel */
export interface ThoughtEntry {
  id: string;
  type: 'search' | 'read' | 'calc' | 'doc' | 'check';
  title: string;
  subtitle: string;
  sources?: string[];
  status: 'live' | 'done';
}

/** AI-generated follow-up question card */
export interface FollowUpCardData {
  intro: string;
  questions: Array<{
    id: string;
    question: string;
    options?: string[];
    allowFreeText?: boolean;
    placeholder?: string;
  }>;
}

/** AI-generated pause card for document detail collection */
export interface PauseCardData {
  title?: string;
  description: string;
  buttonText?: string;
  fields: Array<{
    id: string;
    label: string;
    placeholder: string;
    type: 'text' | 'select' | 'textarea';
    options?: string[];
    defaultValue?: string;
  }>;
}

/** AI-generated structured answer card */
export interface AnswerCardData {
  title: string;
  rows: Array<{
    label: string;
    value: string;
    status: 'good' | 'warn' | 'bad' | 'neutral';
  }>;
}

/** Citation card data — expandable in a grid */
export interface CitationData {
  type: 'statute' | 'case' | 'web';
  title: string;
  subtitle: string;
  fullText: string;
  url: string;
}

/** Sources block — compact list of cited sources */
export interface SourcesBlockData {
  sources: string[];
}

/** Action button in the response */
export interface ActionButtonData {
  label: string;
  style: 'primary' | 'secondary' | 'drive';
  action: string; // identifier for the action
}

/** Follow-up suggestion chips */
export interface SuggestionsData {
  suggestions: string[];
}

/** Document preview data for in-chat preview */
export interface DocPreviewData {
  title: string;
  previewHtml: string;
  fullHtml: string;
}

/** A structured component emitted by the AI */
export interface AIComponent {
  type: 'followup_card' | 'pause_card' | 'answer_card' | 'citations' | 'doc_preview' | 'suggestions' | 'sources' | 'actions';
  data: FollowUpCardData | PauseCardData | AnswerCardData | CitationData[] | DocPreviewData | SuggestionsData | SourcesBlockData | ActionButtonData[];
}

/** A single chunk from the SSE stream */
export type AIResponseChunk =
  | { type: 'session'; chatId: string }
  | { type: 'state_change'; state: PillState; stateLabel: string }
  | { type: 'thought'; thought: Omit<ThoughtEntry, 'id'> }
  | { type: 'content'; delta: string; model?: string }
  | { type: 'thinking'; delta: string; model?: string }
  | { type: 'component'; component: AIComponent }
  | { type: 'metadata'; citations: LegalCitation[] }
  | { type: 'error'; message: string }
  | { type: 'done' };

/** Canvas panel state */
export interface CanvasState {
  isOpen: boolean;
  activeTab: 'preview' | 'code' | 'editor';
  documentHtml: string;
  documentTitle: string;
}
```
