import { useCallback, useRef } from 'react';
import type {
  PillState, ThoughtEntry, AIComponent,
} from '../types';

/**
 * Parses the SSE stream from /api/chat and dispatches typed events.
 * 
 * FIX: Non-destructive parsing. This version handles tag extraction without 
 * breaking the main content stream by tracking processing offsets 
 * instead of destructive string replacement.
 */

interface StreamCallbacks {
  onStateChange: (state: PillState, label: string) => void;
  onThought: (thought: Omit<ThoughtEntry, 'id'>) => void;
  onContent: (delta: string, model?: string) => void;
  onThinking: (delta: string) => void;
  onComponent: (component: AIComponent) => void;
  onSession: (chatId: string) => void;
  onError: (message: string) => void;
  onDone: () => void;
}

export function useStreamParser() {
  const bufferRef = useRef('');
  const processedIndexRef = useRef(0);
  const emittedThoughtsRef = useRef<Set<string>>(new Set());
  const emittedComponentsRef = useRef<Set<string>>(new Set());

  const processSSEChunk = useCallback((rawData: string, callbacks: StreamCallbacks) => {
    try {
      const chunk = JSON.parse(rawData);

      switch (chunk.type) {
        case 'session':
          callbacks.onSession(chunk.chatId);
          break;
        case 'state_change':
          callbacks.onStateChange(chunk.state, chunk.stateLabel);
          break;
        case 'thought':
          callbacks.onThought(chunk.thought);
          break;
        case 'content': {
          const delta = chunk.delta || '';
          bufferRef.current += delta;
          
          // ── TAG EXTRACTION & CONTENT EMISSION (NON-DESTRUCTIVE) ──
          const currentBuffer = bufferRef.current;
          
          // 1. Extract States (thinking, searching, etc.)
          const stateRegex = /<state>(.*?)<\/state>/g;
          let stateMatch;
          while ((stateMatch = stateRegex.exec(currentBuffer)) !== null) {
            // We can emit states multiple times, UI handles it
            callbacks.onStateChange(stateMatch[1] as PillState, stateMatch[1]);
          }

          // 2. Extract Thoughts
          const thoughtRegex = /<thought>([\s\S]*?)<\/thought>/g;
          let thoughtMatch;
          while ((thoughtMatch = thoughtRegex.exec(currentBuffer)) !== null) {
            const thoughtContent = thoughtMatch[1];
            // Use content as key to avoid double-emitting same thought in one stream
            if (!emittedThoughtsRef.current.has(thoughtContent)) {
              callbacks.onThought({
                type: 'read',
                title: 'Reasoning',
                subtitle: 'Brain',
                status: 'done',
                sources: []
              });
              emittedThoughtsRef.current.add(thoughtContent);
            }
          }

          // 3. Extract Components
          const compRegex = /<component\s+type="([^"]+)">([\s\S]*?)<\/component>/g;
          let compMatch;
          while ((compMatch = compRegex.exec(currentBuffer)) !== null) {
            const compRaw = compMatch[0];
            if (!emittedComponentsRef.current.has(compRaw)) {
              try {
                const data = JSON.parse(compMatch[2]);
                callbacks.onComponent({ type: compMatch[1] as AIComponent['type'], data });
                emittedComponentsRef.current.add(compRaw);
              } catch (e) {
                // Partial JSON, skip for now
              }
            }
          }

          // 4. EMIT PLAIN CONTENT (CLEANED)
          // We find all text that is NOT inside a tag <...>
          // But we only emit the NEW part by tracking our absolute buffer index.
          
          let cleanedContent = currentBuffer;
          // Temporarily remove ALL tags to see what the "clean" text looks like
          cleanedContent = cleanedContent.replace(/<thought>[\s\S]*?<\/thought>/g, '');
          cleanedContent = cleanedContent.replace(/<state>.*?<\/state>/g, '');
          cleanedContent = cleanedContent.replace(/<component\s+type="[^"]+">[\s\S]*?<\/component>/g, '');
          cleanedContent = cleanedContent.replace(/<status>.*?<\/status>/g, '');
          
          // Also protect against partial tags at the very end of the buffer
          // If the buffer ends with an unclosed <, we don't know if it's text or a tag yet.
          const lastOpen = cleanedContent.lastIndexOf('<');
          const lastClose = cleanedContent.lastIndexOf('>');
          if (lastOpen > lastClose && (cleanedContent.length - lastOpen) < 100) {
            cleanedContent = cleanedContent.slice(0, lastOpen);
          }

          if (cleanedContent.length > processedIndexRef.current) {
            const newDelta = cleanedContent.slice(processedIndexRef.current);
            callbacks.onContent(newDelta, chunk.model);
            processedIndexRef.current = cleanedContent.length;
          }
          
          break;
        }
        case 'thinking':
          callbacks.onThinking(chunk.delta || '');
          break;
        case 'component':
          callbacks.onComponent(chunk.component);
          break;
        case 'error':
          callbacks.onError(chunk.message);
          break;
        default:
          break;
      }
    } catch (e) {
      console.warn('SSE parse error:', e);
    }
  }, []);

  const reset = useCallback(() => {
    bufferRef.current = '';
    processedIndexRef.current = 0;
    emittedThoughtsRef.current.clear();
    emittedComponentsRef.current.clear();
  }, []);

  return { processSSEChunk, reset };
}
