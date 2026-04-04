import { useCallback, useRef } from 'react';
import type { PillState, ThoughtEntry, AIComponent } from '../types';

/**
 * useStreamParser — Fixed O(1) streaming parser
 *
 * ROOT CAUSE FIX: The old version rebuilt `cleanedContent` from the full
 * buffer on every chunk, so `processedIndexRef` pointed to the wrong position
 * once any tag was stripped. Result: onContent was never called after the
 * first <state> or <thought> tag appeared → blank page.
 *
 * FIX: Track `emittedCleanLengthRef` — the number of characters already
 * emitted from the cleaned string. We only take the slice FORWARD from that
 * point, so the index never drifts regardless of tag stripping.
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
  // Raw accumulated buffer — grows monotonically, never shrunk
  const rawBufferRef = useRef('');
  // How many characters of the CLEAN string we've already emitted
  const emittedCleanLengthRef = useRef(0);
  // Dedup guards
  const emittedThoughtKeysRef = useRef<Set<string>>(new Set());
  const emittedComponentKeysRef = useRef<Set<string>>(new Set());

  const processSSEChunk = useCallback((rawData: string, callbacks: StreamCallbacks) => {
    try {
      const chunk = JSON.parse(rawData);

      switch (chunk.type) {

        // ── Top-level structured events (from scalable backend) ──
        case 'session':
          callbacks.onSession(chunk.chatId);
          break;

        case 'state_change':
          callbacks.onStateChange(
            chunk.state as PillState,
            chunk.stateLabel || chunk.state
          );
          break;

        case 'thought':
          if (chunk.thought) callbacks.onThought(chunk.thought);
          break;

        case 'component':
          if (chunk.component) callbacks.onComponent(chunk.component);
          break;

        case 'thinking':
          callbacks.onThinking(chunk.delta || '');
          break;

        case 'error':
          callbacks.onError(chunk.message || 'Unknown error');
          break;

        case 'done':
          callbacks.onDone();
          break;

        // ── Hybrid content chunks (current backend: tags embedded in text) ──
        case 'content': {
          const delta = chunk.delta || '';
          if (!delta) break;

          rawBufferRef.current += delta;
          const buf = rawBufferRef.current;

          // ── 1. EXTRACT STATE TAGS ──
          // Matches: <state>searching</state>
          // Also:    <state type="searching" label="Searching Kenya Law…"/>
          const stateRe = /<state(?:\s+type="([^"]*)")?(?:\s+label="([^"]*)")?>([\s\S]*?)<\/state>/g;
          let sm: RegExpExecArray | null;
          while ((sm = stateRe.exec(buf)) !== null) {
            const stateVal = ((sm[1] || sm[3]) || '').trim() as PillState;
            const label = ((sm[2] || sm[3]) || stateVal).trim();
            if (stateVal) {
              callbacks.onStateChange(stateVal, label);
            }
          }

          // ── 2. EXTRACT THOUGHT TAGS ──
          const thoughtRe = /<thought>([\s\S]*?)<\/thought>/g;
          let tm: RegExpExecArray | null;
          while ((tm = thoughtRe.exec(buf)) !== null) {
            const key = tm[1].trim().slice(0, 100);
            if (!emittedThoughtKeysRef.current.has(key)) {
              emittedThoughtKeysRef.current.add(key);
              try {
                // Try JSON thought (structured backend)
                const thought = JSON.parse(tm[1]);
                callbacks.onThought(thought);
              } catch {
                // Plain text thought (current backend)
                callbacks.onThought({
                  type: 'read',
                  title: tm[1].trim().slice(0, 60),
                  subtitle: '',
                  status: 'done',
                  sources: [],
                });
              }
            }
          }

          // ── 3. EXTRACT COMPONENT TAGS ──
          const compRe = /<component\s+type="([^"]+)">([\s\S]*?)<\/component>/g;
          let cm: RegExpExecArray | null;
          while ((cm = compRe.exec(buf)) !== null) {
            const key = cm[0].slice(0, 100);
            if (!emittedComponentKeysRef.current.has(key)) {
              try {
                const data = JSON.parse(cm[2].trim());
                callbacks.onComponent({ type: cm[1] as AIComponent['type'], data });
                emittedComponentKeysRef.current.add(key);
              } catch {
                // Partial JSON — skip, retry on next chunk when closing tag arrives
              }
            }
          }

          // ── 4. EMIT CLEAN CONTENT (THE KEY FIX) ──
          // Strip ALL known tags to produce the display text
          let clean = buf
            .replace(/<state(?:[^>]*)>[\s\S]*?<\/state>/g, '')
            .replace(/<thought>[\s\S]*?<\/thought>/g, '')
            .replace(/<component\s+type="[^"]*">[\s\S]*?<\/component>/g, '')
            .replace(/<status>[^<]*<\/status>/g, '');

          // Guard: if the buffer ends mid-tag (partial '<'), don't emit that
          // portion yet — we don't know if it's text or a tag opener.
          const lastLt = clean.lastIndexOf('<');
          const lastGt = clean.lastIndexOf('>');
          if (lastLt > lastGt && clean.length - lastLt < 150) {
            clean = clean.slice(0, lastLt);
          }

          // Only emit the portion we haven't emitted yet
          if (clean.length > emittedCleanLengthRef.current) {
            const newText = clean.slice(emittedCleanLengthRef.current);
            emittedCleanLengthRef.current = clean.length;
            // Only send if there's actual visible content
            if (newText) {
              callbacks.onContent(newText, chunk.model);
            }
          }
          break;
        }

        default:
          // Unknown chunk type — ignore gracefully
          break;
      }
    } catch (e) {
      // JSON parse failed — could be a keep-alive comment or malformed line
      console.warn('[StreamParser] Skipping malformed chunk:', e);
    }
  }, []);

  const reset = useCallback(() => {
    rawBufferRef.current = '';
    emittedCleanLengthRef.current = 0;
    emittedThoughtKeysRef.current.clear();
    emittedComponentKeysRef.current.clear();
  }, []);

  return { processSSEChunk, reset };
}
