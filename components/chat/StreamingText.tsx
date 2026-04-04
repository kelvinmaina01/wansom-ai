
import React, { useMemo } from 'react';

interface StreamingTextProps {
  content: string;
  isStreaming: boolean;
}

// ─── Inline node types ───────────────────────────────────────────────────────
type InlineNode =
  | { t: 'text';   v: string }
  | { t: 'bold';   v: string }
  | { t: 'red';    v: string }
  | { t: 'grn';    v: string }
  | { t: 'blue';   v: string }
  | { t: 'amb';    v: string }
  | { t: 'purple'; v: string }
  | { t: 'cite';   v: string };

// ─── Block types ─────────────────────────────────────────────────────────────
type Block =
  | { kind: 'p';  nodes: InlineNode[] }
  | { kind: 'h2'; text: string }
  | { kind: 'h3'; text: string }
  | { kind: 'ul'; items: InlineNode[][] }
  | { kind: 'ol'; items: InlineNode[][] };

/**
 * parseInline — converts a raw text string into typed inline nodes.
 * Uses a single pass with a combined regex so formatting tags like
 * <red>...</red> and **bold** are handled before React renders them.
 *
 * WHY THIS APPROACH:
 * The old StreamingText used containerRef.current.innerHTML = html.
 * Tailwind's purge scans .tsx source files — class names that only appear
 * as runtime strings (e.g. 'stream-red') get purged from the CSS bundle.
 * Rendering pure React elements with className strings that exist in JSX
 * guarantees Tailwind (and Vite's CSS tree-shaker) preserves them.
 */
function parseInline(text: string): InlineNode[] {
  const nodes: InlineNode[] = [];

  // Single combined regex — order matters (longer tags first)
  const re = /<red>([\s\S]*?)<\/red>|<grn>([\s\S]*?)<\/grn>|<blue>([\s\S]*?)<\/blue>|<amb>([\s\S]*?)<\/amb>|<purple>([\s\S]*?)<\/purple>|<bold>([\s\S]*?)<\/bold>|\*\*([\s\S]*?)\*\*|\[([^\]]+?)\](?!\()/g;

  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = re.exec(text)) !== null) {
    // Plain text before this match
    if (match.index > lastIndex) {
      nodes.push({ t: 'text', v: text.slice(lastIndex, match.index) });
    }

    if (match[1] !== undefined) nodes.push({ t: 'red',    v: match[1] });
    else if (match[2] !== undefined) nodes.push({ t: 'grn',    v: match[2] });
    else if (match[3] !== undefined) nodes.push({ t: 'blue',   v: match[3] });
    else if (match[4] !== undefined) nodes.push({ t: 'amb',    v: match[4] });
    else if (match[5] !== undefined) nodes.push({ t: 'purple', v: match[5] });
    else if (match[6] !== undefined) nodes.push({ t: 'bold',   v: match[6] });
    else if (match[7] !== undefined) nodes.push({ t: 'bold',   v: match[7] }); // **bold**
    else if (match[8] !== undefined) nodes.push({ t: 'cite',   v: match[8] }); // [citation]

    lastIndex = re.lastIndex;
  }

  // Trailing plain text
  if (lastIndex < text.length) {
    nodes.push({ t: 'text', v: text.slice(lastIndex) });
  }

  return nodes;
}

function renderInline(nodes: InlineNode[], keyPrefix: string): React.ReactNode[] {
  return nodes.map((n, i) => {
    const key = `${keyPrefix}-${i}`;
    switch (n.t) {
      case 'text':   return <React.Fragment key={key}>{n.v}</React.Fragment>;
      case 'bold':   return <strong key={key} className="stream-bold">{n.v}</strong>;
      case 'red':    return <strong key={key} className="stream-red">{n.v}</strong>;
      case 'grn':    return <strong key={key} className="stream-grn">{n.v}</strong>;
      case 'blue':   return <strong key={key} className="stream-blue">{n.v}</strong>;
      case 'amb':    return <strong key={key} className="stream-amb">{n.v}</strong>;
      case 'purple': return <strong key={key} className="stream-purple">{n.v}</strong>;
      case 'cite':   return <span   key={key} className="cite-badge">{n.v}</span>;
      default:       return null;
    }
  });
}

function parseContent(text: string): Block[] {
  if (!text) return [];
  const blocks: Block[] = [];

  for (const raw of text.split(/\n\n+/)) {
    const trimmed = raw.trim();
    if (!trimmed) continue;

    if (trimmed.startsWith('## ')) {
      blocks.push({ kind: 'h2', text: trimmed.slice(3) });

    } else if (trimmed.startsWith('### ')) {
      blocks.push({ kind: 'h3', text: trimmed.slice(4) });

    } else if (trimmed.match(/^[-•]\s/m)) {
      const items = trimmed
        .split('\n')
        .filter(l => l.trim())
        .map(l => parseInline(l.replace(/^[-•]\s*/, '')));
      blocks.push({ kind: 'ul', items });

    } else if (trimmed.match(/^\d+\.\s/m)) {
      const items = trimmed
        .split('\n')
        .filter(l => l.trim())
        .map(l => parseInline(l.replace(/^\d+\.\s*/, '')));
      blocks.push({ kind: 'ol', items });

    } else {
      blocks.push({ kind: 'p', nodes: parseInline(trimmed) });
    }
  }

  return blocks;
}

const StreamingText: React.FC<StreamingTextProps> = ({ content, isStreaming }) => {
  // useMemo: only re-parses when content actually changes
  const blocks = useMemo(() => parseContent(content), [content]);

  return (
    <div className="stream-body">
      {blocks.map((block, bi) => {
        const isLast = bi === blocks.length - 1;

        switch (block.kind) {
          case 'h2':
            return <h2 key={bi} className="stream-h2">{block.text}</h2>;

          case 'h3':
            return <h3 key={bi} className="stream-h3">{block.text}</h3>;

          case 'ul':
            return (
              <ul key={bi} className="stream-list">
                {block.items.map((nodes, li) => (
                  <li key={li} className="stream-list-item">
                    {renderInline(nodes, `${bi}-${li}`)}
                  </li>
                ))}
              </ul>
            );

          case 'ol':
            return (
              <ol key={bi} className="stream-list" style={{ listStyle: 'decimal' }}>
                {block.items.map((nodes, li) => (
                  <li key={li} className="stream-list-item">
                    {renderInline(nodes, `${bi}-${li}`)}
                  </li>
                ))}
              </ol>
            );

          case 'p':
          default:
            return (
              <p key={bi} className="stream-paragraph">
                {renderInline(block.nodes, `${String(bi)}`)}
                {isStreaming && isLast && <span className="stream-cursor" />}
              </p>
            );
        }
      })}

      {/* Cursor when buffer is empty (first tokens arriving) */}
      {isStreaming && blocks.length === 0 && (
        <span className="stream-cursor" />
      )}
    </div>
  );
};

export default StreamingText;
