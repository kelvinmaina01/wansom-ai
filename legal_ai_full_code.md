# Lawlify Legal AI — Full System Codebase (v2.0)
*Consolidated on 2026-04-02 for Research Purposes*

---

## ── TABLE OF CONTENTS ──
1. **BACKEND: THE BRAIN**
   - `modelDispatcher.js` (Agentic Prompt & Gemini 2.0 Flash)
   - `intelligence.js` (SSE Integration & Search Routing)

2. **FRONTEND: STREAMING & PARSING**
   - `useStreamParser.ts` (Non-destructive Tag Extraction)
   - `LegalAI.tsx` (SSE Buffer, Auto-Scroll & Component Coordination)

3. **FRONTEND: UI & RENDERING**
   - `LegalResponse.tsx` (Structured Message Presentation)
   - `StreamingText.tsx` (Premium Formatting Engine: <red>, <grn>, etc.)
   - `PauseCard.tsx` (Dynamic 'Adjustment' Engine for 10k Users)

4. **FOUNDATION: TYPES & STYLES**
   - `types.ts` (Global AI Data Structures)
   - `index.css` (The 'Simulation Parity' Design System)

---

## 1. BACKEND: THE BRAIN

### [modelDispatcher.js](file:///c:/Users/dell/Desktop/lawlify-ai/backend-service/services/modelDispatcher.js)
```javascript
import { GoogleGenerativeAI } from "@google/generative-ai";
import logger from "../utils/logger.js";
import { searchService } from "./searchService.js";
import { intentClassifier } from "./intentClassifier.js";

/**
 * ModelDispatcher
 * The central brain for Lawlify AI. 
 * CONSISTENCY REFACTOR: Consolidating 100% to Gemini 2.0 Flash for all reasoning.
 */
const LEGAL_SYSTEM_PROMPT = `
FIXED SYSTEM PROMPT — GLOBAL LEGAL AI (AFRICA & EAST AFRICA FOCUS)
==================================================================
(Primary Focus: Africa | Deep Focus: East Africa | Coverage: Worldwide)

## IDENTITY
You are a specialized AI legal assistant for legal practitioners worldwide.
Your strongest expertise is in African law, with deepest knowledge in
East Africa. You also handle legal questions from any jurisdiction globally.

## SCOPE — WHAT YOU HANDLE
... (Identity & Tiers) ...

## DYNAMIC INTERACTION (CRITICAL)
You must guide the user through your reasoning process using structural tags. These tags drive the UI components.

1. **STATE UPDATES** (<state>label</state>):
   Emit these at the start of every phase.
   - <state>thinking</state> | <state>searching</state> | <state>reading</state> | <state>drafting</state>

2. **REASONING** (<thought>...</thought>):
   Wrap your inner legal reasoning in these tags.
   CRITICAL: NEVER put your final legal answer inside these tags.

3. **INTERACTIVE COMPONENTS** (<component type="type">JSON</component>):
   - citations, followup_card, pause_card, answer_card, doc_preview, suggestions.

## SEQUENCE EXAMPLE
<state>searching</state>
<thought>Searching for Muruatetu v Republic [2017]...</thought>
<state>drafting</state>
In the **Muruatetu** case, the Supreme Court of Kenya held... (This is the answer)
`;

export class ModelDispatcher {
  get genAI() {
    const key = process.env.GEMINI_API_KEY;
    return new GoogleGenerativeAI(key);
  }

  async dispatchStream(messages, options = {}) {
    const targetModel = "gemini-2.0-flash";
    const model = this.genAI.getGenerativeModel({ 
      model: targetModel,
      systemInstruction: LEGAL_SYSTEM_PROMPT
    });

    const chat = model.startChat({
        history: messages.slice(0, -1).map(m => ({
            role: m.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: m.content }]
        })),
        generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 2048,
        },
    });

    const result = await chat.sendMessageStream(messages[messages.length - 1].content);
    
    return (async function* () {
      for await (const chunk of result.stream) {
        yield { delta: chunk.text(), model: targetModel };
      }
    })();
  }
}
```

### [intelligence.js](file:///c:/Users/dell/Desktop/lawlify-ai/backend-service/routes/intelligence.js)
```javascript
import express from 'express';
import { intelligenceService } from '../services/intelligenceService.js';
const router = express.Router();

/**
 * GET /api/intelligence/analyze/:fileId
 * Main entry point for the S.A.V.R.E. immersive engine.
 */
router.get('/analyze/:fileId', async (req, res) => {
    const { mode = 'summary' } = req.query;
    const file = await supabase.from('files').select('*').eq('id', fileId).single();
    if (!file) return res.status(404).json({ error: 'File not found' });
    
    const analysis = await intelligenceService.processDocument(Buffer.from(arrayBuffer), file.name, { mode });
    res.json({ success: true, ...analysis });
});
```

---

## 2. FRONTEND: STREAMING & PARSING

### [useStreamParser.ts](file:///c:/Users/dell/Desktop/lawlify-ai/hooks/useStreamParser.ts)
```typescript
/**
 * FIX: Non-destructive parsing. Handles tag extraction without 
 * breaking the main content stream by tracking processing offsets.
 */
export function useStreamParser() {
  const bufferRef = useRef('');
  const processedIndexRef = useRef(0);

  const processSSEChunk = useCallback((rawData: string, callbacks: StreamCallbacks) => {
      const chunk = JSON.parse(rawData);
      if (chunk.type === 'content') {
          bufferRef.current += chunk.delta || '';
          let cleanedContent = bufferRef.current;
          
          // Non-destructive tag removal for length tracking
          cleanedContent = cleanedContent.replace(/<thought>[\s\S]*?<\/thought>/g, '');
          cleanedContent = cleanedContent.replace(/<state>.*?<\/state>/g, '');
          cleanedContent = cleanedContent.replace(/<component\s+type="[^"]+">[\s\S]*?<\/component>/g, '');

          if (cleanedContent.length > processedIndexRef.current) {
            const newDelta = cleanedContent.slice(processedIndexRef.current);
            callbacks.onContent(newDelta, chunk.model);
            processedIndexRef.current = cleanedContent.length;
          }
      }
  }, []);
}
```

### [LegalAI.tsx](file:///c:/Users/dell/Desktop/lawlify-ai/components/LegalAI.tsx)
```typescript
/**
 * Lawlify AI Core Workspace.
 * Implements SSE Chunk Reassembly and Reactive Auto-Scroll.
 */
const LegalAI = () => {
    // 1. SSE BUFFER (Prevents partial chunk loss)
    let streamingBuffer = '';
    while (!done) {
        const chunk = decoder.decode(value, { stream: true });
        streamingBuffer += chunk;
        const lines = streamingBuffer.split('\n');
        streamingBuffer = lines.pop() || ''; // Buffer trailing fragment

        for (const line of lines) {
            if (line.startsWith('data: ')) {
                processSSEChunk(line.slice(6), {
                    onContent: (delta) => setMessages(prev => updateContent(prev, delta))
                });
            }
        }
    }

    // 2. REACTIVE AUTO-SCROLL (Follows streaming response)
    useEffect(() => {
        const lastMsg = messages[messages.length - 1]?.content || '';
        const behavior = lastMsg.length < 50 ? 'smooth' : 'auto';
        if (!isUserScrollingUpRef.current) {
            chatEndRef.current.scrollIntoView({ behavior, block: 'end' });
        }
    }, [messages.length, messages[messages.length-1]?.content]);
}
```

---

## 3. FRONTEND: UI & RENDERING

### [LegalResponse.tsx](file:///c:/Users/dell/Desktop/lawlify-ai/components/LegalResponse.tsx)
```typescript
/**
 * Renders structured AI responses with States, Thoughts, and Components.
 */
const LegalResponse = ({ message }) => {
    const isAssistant = message.role === 'assistant';
    const components = message.components || [];
    
    return (
        <div className="flex-1 w-full">
            {/* 1. State Hub */}
            <StatePill state={message.pillState} label={message.pillLabel} />

            {/* 2. Content Engine */}
            <StreamingText content={message.content} isStreaming={message.isGenerating} />

            {/* 3. Dynamic Component Injection */}
            {components.map(comp => (
                <ComponentRenderer type={comp.type} data={comp.data} />
            ))}
        </div>
    );
}
```

### [StreamingText.tsx](file:///c:/Users/dell/Desktop/lawlify-ai/components/chat/StreamingText.tsx)
```typescript
/**
 * Premium Formatting Engine for Legal High-Fidelity.
 */
function parseStreamContent(text: string): string {
    let html = text.trim();
    // Simulation Parity Colors
    html = html.replace(/<red>(.*?)<\/red>/g, '<strong style="color:#c8102e">$1</strong>');
    html = html.replace(/<grn>(.*?)<\/grn>/g, '<strong style="color:#22c55e">$1</strong>');
    html = html.replace(/<blue>(.*?)<\/blue>/g, '<strong style="color:#3b82f6">$1</strong>');
    html = html.replace(/<bold>(.*?)<\/bold>/g, '<strong style="font-weight:700;color:#111">$1</strong>');
    return html;
}
```

### [PauseCard.tsx](file:///c:/Users/dell/Desktop/lawlify-ai/components/chat/PauseCard.tsx)
```typescript
/**
 * AI-Driven 'Adjustment' Engine.
 * Form labels and fields are generated dynamically by the AI.
 */
const PauseCard = ({ data, onContinue }) => {
    return (
        <div className="pause-card">
            <div className="pause-header">
                <span className="pause-title">{data.title || 'AI paused — collecting details'}</span>
            </div>
            <div className="pause-body">
                <div className="pause-desc">{data.description}</div>
                <div className="pause-grid">
                    {data.fields.map(field => <FieldRenderer field={field} />)}
                </div>
                <button onClick={handleContinue}>{data.buttonText || 'Continue'}</button>
            </div>
        </div>
    );
};
```

---

## 4. FOUNDATION: TYPES & STYLES

### [types.ts](file:///c:/Users/dell/Desktop/lawlify-ai/types.ts)
```typescript
export type PillState = 'thinking' | 'searching' | 'reading' | 'drafting' | 'asking' | 'paused' | 'done' | 'streaming';

export interface AIComponent {
  type: 'followup_card' | 'pause_card' | 'answer_card' | 'citations' | 'doc_preview' | 'suggestions';
  data: any;
}
```

### [index.css](file:///c:/Users/dell/Desktop/lawlify-ai/index.css)
```css
/* Simulation Parity Aesthetics */
.stream-cursor {
  width: 2.5px; height: 15px; background: #ef4444;
  animation: chatBlink 0.65s step-end infinite;
}
.pause-card {
  background: #111; border: 1px solid #f59e0b;
  border-radius: 20px; box-shadow: 0 12px 48px rgba(0,0,0,0.3);
}
.sp-thinking { border: 1px solid rgba(168,85,247,0.3); color: #a855f7; }
```
