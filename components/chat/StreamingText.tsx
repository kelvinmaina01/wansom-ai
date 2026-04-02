
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
