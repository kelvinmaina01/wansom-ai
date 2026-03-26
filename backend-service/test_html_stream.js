
import { modelDispatcher } from './services/modelDispatcher.js';
import dotenv from 'dotenv';
dotenv.config();

async function testHtmlGeneration() {
    console.log("Testing HTML/CSS Generation for Documents...");
    const query = "Draft a simple Mutual NDA for two Kenyan companies.";
    
    try {
        const stream = modelDispatcher.dispatchStream(query, { context: { isCoworkMode: true } });
        let hasHtml = false;
        
        for await (const chunk of stream) {
            if (chunk.type === 'content') {
                process.stdout.write(chunk.delta);
                if (chunk.delta.includes('<code_block language="html">') || chunk.delta.includes('<html>')) {
                    hasHtml = true;
                }
            }
        }
        
        console.log("\n\n-------------------");
        console.log("HTML Detected:", hasHtml);
        if (hasHtml) {
            console.log("SUCCESS: Backend is following HTML/CSS instructions.");
        } else {
            console.log("FAILURE: No HTML detected. Check LEGAL_SYSTEM_PROMPT.");
        }
    } catch (err) {
        console.error("Test Error:", err.message);
    }
}

testHtmlGeneration();
