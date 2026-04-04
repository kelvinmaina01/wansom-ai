/**
 * apply_migration.js
 * Applies the dashboard stats migration directly to Supabase
 * using the Management REST API (pg endpoint).
 * Run: node backend-service/scripts/apply_migration.js
 */
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import https from 'https';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const SUPABASE_URL = process.env.SUPABASE_URL; // e.g. https://xxxxx.supabase.co
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Extract project ref from URL: https://ygtnjiwdrfldpsmakaqo.supabase.co
const PROJECT_REF = SUPABASE_URL.replace('https://', '').replace('.supabase.co', '');

console.log(`[Migration] Project ref: ${PROJECT_REF}`);

const MIGRATION_SQL = `
-- ============================================================
-- activity_logs table
-- ============================================================
CREATE TABLE IF NOT EXISTS public.activity_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  case_id UUID REFERENCES public.cases(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  target TEXT NOT NULL,
  icon TEXT DEFAULT 'FileText',
  metadata JSONB DEFAULT '{}'::JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename='activity_logs' AND policyname='Users can view their own activity logs'
  ) THEN
    CREATE POLICY "Users can view their own activity logs"
      ON public.activity_logs FOR SELECT USING (auth.uid() = user_id);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename='activity_logs' AND policyname='Service role can insert activity logs'
  ) THEN
    CREATE POLICY "Service role can insert activity logs"
      ON public.activity_logs FOR INSERT WITH CHECK (true);
  END IF;
END $$;

-- ============================================================
-- user_stats table
-- ============================================================
CREATE TABLE IF NOT EXISTS public.user_stats (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  total_queries INTEGER DEFAULT 0,
  active_projects INTEGER DEFAULT 0,
  time_saved_hours INTEGER DEFAULT 0,
  statutes_indexed INTEGER DEFAULT 450,
  monthly_revenue DECIMAL(10,2) DEFAULT 0.00,
  billable_hours INTEGER DEFAULT 0,
  billable_target INTEGER DEFAULT 180,
  outstanding_invoices DECIMAL(10,2) DEFAULT 0.00,
  pending_invoices_count INTEGER DEFAULT 0,
  ai_credits_used INTEGER DEFAULT 0,
  ai_credits_total INTEGER DEFAULT 10000,
  docs_processed INTEGER DEFAULT 0,
  drafts_created INTEGER DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.user_stats ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename='user_stats' AND policyname='Users can view their own stats'
  ) THEN
    CREATE POLICY "Users can view their own stats"
      ON public.user_stats FOR SELECT USING (auth.uid() = user_id);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename='user_stats' AND policyname='Backend can upsert stats'
  ) THEN
    CREATE POLICY "Backend can upsert stats"
      ON public.user_stats FOR ALL USING (true) WITH CHECK (true);
  END IF;
END $$;
`;

async function postSQL(sql) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({ query: sql });
    const url = `https://api.supabase.com/v1/projects/${PROJECT_REF}/database/query`;

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SERVICE_KEY}`,
        'Content-Length': Buffer.byteLength(body),
      },
    };

    const req = https.request(url, options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve({ status: res.statusCode, body: JSON.parse(data) }); }
        catch { resolve({ status: res.statusCode, body: data }); }
      });
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

async function verifyTable(tableName) {
  return new Promise((resolve, reject) => {
    const sql = `SELECT COUNT(*) FROM information_schema.tables WHERE table_schema='public' AND table_name='${tableName}'`;
    const body = JSON.stringify({ query: sql });
    const url = `https://api.supabase.com/v1/projects/${PROJECT_REF}/database/query`;

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SERVICE_KEY}`,
        'Content-Length': Buffer.byteLength(body),
      },
    };

    const req = https.request(url, options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          const count = parseInt(parsed?.[0]?.count || parsed?.data?.[0]?.count || '0');
          resolve(count > 0);
        } catch {
          resolve(false);
        }
      });
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

async function main() {
  console.log('[Migration] Applying dashboard stats migration...\n');

  const result = await postSQL(MIGRATION_SQL);
  console.log(`[Migration] Status: ${result.status}`);

  if (result.status >= 200 && result.status < 300) {
    console.log('[Migration] ✅ Migration applied successfully\n');
  } else {
    console.log('[Migration] Response:', JSON.stringify(result.body, null, 2));
  }

  // Verify
  console.log('[Verification] Checking tables in Supabase...\n');
  const tables = ['activity_logs', 'user_stats', 'cases', 'ai_personas', 'chat_histories', 'user_integrations'];
  for (const t of tables) {
    const exists = await verifyTable(t);
    console.log(`  ${exists ? '✅' : '❌'} ${t}`);
  }

  console.log('\n[Done] Migration complete.');
}

main().catch(console.error);
