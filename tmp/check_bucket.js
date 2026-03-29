import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../backend-service/.env') });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkBucket() {
  const { data, error } = await supabase.storage.getBucket('legal-documents');
  if (error) {
    console.log('Bucket missing or error:', error.message);
    // Try to create it
    const { data: newData, error: createError } = await supabase.storage.createBucket('legal-documents', {
      public: false,
      allowedMimeTypes: ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/png', 'image/jpeg'],
      fileSizeLimit: 52428800 // 50MB
    });
    if (createError) {
      console.error('Failed to create bucket:', createError.message);
    } else {
      console.log('Bucket "legal-documents" created successfully');
    }
  } else {
    console.log('Bucket "legal-documents" exists');
  }
}

checkBucket();
