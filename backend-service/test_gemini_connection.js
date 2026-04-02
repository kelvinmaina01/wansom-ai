import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenerativeAI } from "@google/generative-ai";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env from the backend directory
dotenv.config({ path: path.resolve(__dirname, '../backend-service/.env') });

const key = process.env.GEMINI_API_KEY;

async function testGemini() {
    console.log(`[TEST] Using key: ${key ? (key.slice(0, 5) + '...' + key.slice(-4)) : 'MISSING'}`);
    
    if (!key || key.includes('your_gemini')) {
        console.error('[ERROR] Gemini API key is missing or is a placeholder.');
        process.exit(1);
    }

    try {
        const genAI = new GoogleGenerativeAI(key);
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
        
        console.log('[TEST] Sending test message to gemini-2.0-flash...');
        const result = await model.generateContent("Hello, are you working? Respond with 'YES' only.");
        const response = await result.response;
        const text = response.text();
        
        console.log(`[RESULT] Gemini Response: ${text}`);
        if (text.trim().toUpperCase().includes('YES')) {
            console.log('[SUCCESS] Gemini API is working correctly!');
        } else {
            console.log('[WARNING] Gemini responded, but not with "YES". Still indicates connection works.');
        }
    } catch (error) {
        console.error(`[FAILURE] Gemini API Error: ${error.message}`);
    }
}

testGemini();
