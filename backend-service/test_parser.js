import { useStreamParser } from './hooks/useStreamParser.ts';

// Mocking useStreamParser in a node environment for quick verification
const simulatedAIResponse = `
<state>searching</state>
<thought>Searching for Muruatetu case in Kenyan Supreme Court records...</thought>
<state>reading</state>
<thought>Found Muruatetu & another v Republic [2017] eKLR. This is the landmark case regarding the mandatory death penalty.</thought>
<state>drafting</state>
The Muruatetu case is a significant decision by the Supreme Court of Kenya. It held that the mandatory death penalty for murder is unconstitutional.
`;

function testParser() {
    let accumulatedContent = '';
    let accumulatedThoughts = [];
    let currentState = '';

    const { processSSEChunk, reset } = useStreamParser();
    
    const callbacks = {
        onStateChange: (s, l) => { currentState = s; console.log('[STATE]', s); },
        onThought: (t) => { accumulatedThoughts.push(t); console.log('[THOUGHT]', t.title); },
        onContent: (d) => { accumulatedContent += d; console.log('[CONTENT]', d); },
        onThinking: (d) => {},
        onComponent: (c) => {},
        onSession: (id) => {},
        onError: (err) => {},
        onDone: () => { console.log('[DONE]'); }
    };

    // Simulate chunked SSE
    const chunks = simulatedAIResponse.split('\n');
    for (const line of chunks) {
        if (!line.trim()) continue;
        processSSEChunk(JSON.stringify({ type: 'content', delta: line + '\n' }), callbacks);
    }

    console.log('--- FINAL RESULT ---');
    console.log('Content:', accumulatedContent);
    console.log('Thoughts Count:', accumulatedThoughts.length);
}

// NOTE: Since this is a .ts file using React hooks, we can't run it directly in Node.
// But we can analyze the logic.
console.log('Test structure created. Analyzing useStreamParser.ts logic.');
