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
        // listModels was added in newer versions of the SDK. Let's check if it exists.
        
        // Actually, let's use the native fetch to list models via the REST API.
        const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${key}`;
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.models) {
            console.log('[SUCCESS] Available Models:');
            data.models.forEach(m => console.log(` - ${m.name} (${m.displayName})`));
        } else {
            console.error('[ERROR] Could not list models:', JSON.stringify(data, null, 2));
        }
    } catch (error) {
        console.error(`[FATAL] ${error.message}`);
    }
}

listModels();
