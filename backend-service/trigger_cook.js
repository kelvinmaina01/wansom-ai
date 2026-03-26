import { createClient } from '@supabase/supabase-js';
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

const DOC_ID = "a1b63a06-7ade-4ab8-a41f-ee1140f36af7";
const BUCKET = "raw-documents";
const FILE_PATH = "1773620741600-dsgj1r.pdf";

async function run() {
    try {
        console.log(`Generating signed URL for ${FILE_PATH}...`);
        const { data: { signedUrl }, error } = await supabase
            .storage
            .from(BUCKET)
            .createSignedUrl(FILE_PATH, 3600);

        if (error) throw error;
        console.log("Signed URL:", signedUrl);

        console.log("Triggering PageIndex indexing...");
        const response = await axios.post("http://localhost:8000/index", {
            file_url: signedUrl,
            document_id: DOC_ID,
            model: "gemini-2.5-flash-lite"
        });
        console.log("PageIndex Response:", response.data);

    } catch (err) {
        console.error("Error:", err.message);
    }
}

run();
