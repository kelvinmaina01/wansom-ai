import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenerativeAI } from "@google/generative-ai";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../backend-service/.env') });

const key = process.env.GEMINI_API_KEY;

async function debugModels() {
    console.log(`[TEST] Using key: ${key ? (key.slice(0, 5) + '...' + key.slice(-4)) : 'MISSING'}`);
    
    try {
        const genAI = new GoogleGenerativeAI(key);
        // The listModels method might not be on genAI direct in older versions or might be different.
        // Actually, for @google/generative-ai v0.x, it's not and you have to use the REST API.
        
        console.log('[TEST] Checking accessibility with minimal model name...');
        const modelsToTry = ['gemini-1.5-flash', 'gemini-1.5-pro', 'gemini-pro', 'gemini-1.5-flash-latest'];
        
        for (const m of modelsToTry) {
            try {
                console.log(`[TRYING] ${m}...`);
                const model = genAI.getGenerativeModel({ model: m });
                const result = await model.generateContent("test");
                console.log(`[SUCCESS] ${m} works!`);
                process.exit(0);
            } catch (e) {
                console.log(`[FAILED] ${m}: ${e.message}`);
                // Check if it's a 403 (Forbidden) which means API key issue vs 404 (Not Found).
            }
        }
    } catch (error) {
        console.error(`[FATAL] ${error.message}`);
    }
}

debugModels();
