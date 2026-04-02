import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenerativeAI } from "@google/generative-ai";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../backend-service/.env') });

const key = process.env.GEMINI_API_KEY;

async function listModels() {
    console.log(`[TEST] Using key: ${key ? (key.slice(0, 5) + '...' + key.slice(-4)) : 'MISSING'}`);
    
    try {
        const genAI = new GoogleGenerativeAI(key);
        // In the latest SDK, listModels is not directly on genAI. 
        // We might need to use the REST API or just guess based on common names.
        // Actually, let's just try gemini-1.5-flash-latest which is the most reliable.
        
        const models = ['gemini-1.5-flash-latest', 'gemini-1.5-pro-latest', 'gemini-pro', 'gemini-1.5-flash'];
        
        for (const m of models) {
            try {
                console.log(`[TRYING] ${m}...`);
                const model = genAI.getGenerativeModel({ model: m });
                const result = await model.generateContent("test");
                const response = await result.response;
                console.log(`[SUCCESS] ${m} works!`);
                process.exit(0);
            } catch (e) {
                console.log(`[FAILED] ${m}: ${e.message}`);
            }
        }
    } catch (error) {
        console.error(`[FATAL] ${error.message}`);
    }
}

listModels();
