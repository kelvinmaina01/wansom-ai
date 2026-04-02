/**
 * Pure Logic Mirror of useStreamParser.ts
 * To verify the 'No Answers' bug.
 */
class StreamParser {
    constructor() {
        this.buffer = '';
        this.emittedLength = 0;
    }

    parseTagsFromContent(text, callbacks) {
        let cleaned = text;
        let match;

        // 1. <state>
        const stateRegex = /<state>(.*?)<\/state>/g;
        while ((match = stateRegex.exec(cleaned)) !== null) {
            callbacks.onStateChange(match[1], match[1]);
        }
        cleaned = cleaned.replace(stateRegex, '');

        // 2. <thought>
        const thoughtRegex = /<thought>([\s\S]*?)<\/thought>/g;
        while ((match = thoughtRegex.exec(cleaned)) !== null) {
            callbacks.onThought({ title: 'Reasoning', content: match[1] });
        }
        cleaned = cleaned.replace(thoughtRegex, '');

        return cleaned;
    }

    processDelta(delta, callbacks) {
        this.buffer += delta;

        // Unclosed Tag check
        const lastBracket = this.buffer.lastIndexOf('<');
        const lastClosingBracket = this.buffer.lastIndexOf('>');
        if (lastBracket > lastClosingBracket && (this.buffer.length - lastBracket) < 100) {
            console.log('[PARSER] Buffering (Waiting for tag close)...');
            return;
        }

        const cleaned = this.parseTagsFromContent(this.buffer, callbacks);
        
        console.log(`[DEBUG] BufferLen: ${this.buffer.length}, CleanedLen: ${cleaned.length}, EmittedLen: ${this.emittedLength}`);

        if (cleaned.length > this.emittedLength) {
            const newDelta = cleaned.slice(this.emittedLength);
            callbacks.onContent(newDelta);
            this.emittedLength = cleaned.length;
        }
    }
}

// ── TEST ──
console.log('--- START TEST ---');
const p = new StreamParser();
const c = {
    onStateChange: (s) => console.log(' STATE:', s),
    onThought: (t) => console.log(' THOUGHT:', t.title),
    onContent: (d) => console.log(' CONTENT: "' + d.replace(/\n/g, '\\n') + '"')
};

console.log('\nSTEP 1: Thought block');
p.processDelta('<state>searching</state><thought>Looking for case law...</thought>', c);

console.log('\nSTEP 2: The actual Answer started');
p.processDelta('The Muruatetu case is ', c);

console.log('\nSTEP 3: More Answer');
p.processDelta('landmark.', c);

console.log('\nSTEP 4: Another Thought');
p.processDelta('<thought>Wait, let me double check the section</thought>', c);

console.log('\nSTEP 5: Final text');
p.processDelta(' It changed Kenyan law.', c);
