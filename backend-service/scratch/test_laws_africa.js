import axios from 'axios';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const TOKEN = process.env.LAWS_AFRICA_API_KEY || 'a4ca083d9482df68afd15b64939acf51917ae419';
const BASE_URL = 'https://api.laws.africa/v3';

async function testConnection() {
    console.log("--- Laws.Africa API Test ---");
    console.log(`Target: ${BASE_URL}/search`);
    console.log(`Using Token: ${TOKEN.substring(0, 5)}...`);

    try {
        const response = await axios.get(`${BASE_URL}/search`, {
            params: {
                q: 'Mabeya', // Searching for the judge we seeded
                page_size: 2
            },
            headers: {
                'Authorization': `Token ${TOKEN}`
            }
        });

        console.log("SUCCESS!");
        console.log(`Status: ${response.status}`);
        const results = response.data.results || response.data || [];
        console.log(`Found ${results.length} results.`);
        
        if (results.length > 0) {
            console.log("\nSample Result:");
            console.log(`Title: ${results[0].title || results[0].name}`);
            console.log(`URL: ${results[0].url}`);
        }

    } catch (error) {
        console.error("CONNECTION FAILED");
        if (error.response) {
            console.error(`Status: ${error.response.status}`);
            console.error(`Data: ${JSON.stringify(error.response.data)}`);
        } else {
            console.error(`Error: ${error.message}`);
        }
    }
}

testConnection();
