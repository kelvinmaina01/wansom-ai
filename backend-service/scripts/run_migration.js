// Run this once to apply the dashboard stats migration directly via Supabase REST
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '.env') });

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function runMigration() {
  console.log('[Migration] Connecting to Supabase:', process.env.SUPABASE_URL);

  const sqls = [
    // Activity Logs
    `CREATE TABLE IF NOT EXISTS public.activity_logs (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
      case_id UUID REFERENCES public.cases(id) ON DELETE CASCADE,
      action TEXT NOT NULL,
      target TEXT NOT NULL,
      icon TEXT DEFAULT 'FileText',
      metadata JSONB DEFAULT '{}'::JSONB,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    )`,

    `ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY`,

    `DO $$ BEGIN
       IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='activity_logs' AND policyname='Users can view their own activity logs') THEN
         CREATE POLICY "Users can view their own activity logs"
           ON public.activity_logs FOR SELECT USING (auth.uid() = user_id);
       END IF;
     END $$`,

    `DO $$ BEGIN
       IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='activity_logs' AND policyname='Service role can insert activity logs') THEN
         CREATE POLICY "Service role can insert activity logs"
           ON public.activity_logs FOR INSERT WITH CHECK (true);
       END IF;
     END $$`,

    // User Stats
    `CREATE TABLE IF NOT EXISTS public.user_stats (
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
    )`,

    `ALTER TABLE public.user_stats ENABLE ROW LEVEL SECURITY`,

    `DO $$ BEGIN
       IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='user_stats' AND policyname='Users can view their own stats') THEN
         CREATE POLICY "Users can view their own stats"
           ON public.user_stats FOR SELECT USING (auth.uid() = user_id);
       END IF;
     END $$`,

    `DO $$ BEGIN
       IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='user_stats' AND policyname='Service role can upsert stats') THEN
         CREATE POLICY "Service role can upsert stats"
           ON public.user_stats FOR ALL WITH CHECK (true);
       END IF;
     END $$`,
  ];

  for (const sql of sqls) {
    const label = sql.trim().split('\n')[0].substring(0, 60) + '...';
    const { error } = await supabase.rpc('exec_sql', { query: sql }).catch(() => ({ error: { message: 'rpc not available' } }));
    
    if (error) {
      // Fallback: try direct postgrest call
      console.log(`[Migration] RPC failed for: ${label}`);
      console.log(`[Migration] Error: ${error.message}`);
    } else {
      console.log(`[Migration] ✓ ${label}`);
    }
  }

  // Verify tables exist
  console.log('\n[Verification] Checking tables...');
  
  const { data: actLogs, error: actErr } = await supabase
    .from('activity_logs')
    .select('id')
    .limit(1);
  console.log('activity_logs:', actErr ? `❌ ${actErr.message}` : '✅ EXISTS');

  const { data: stats, error: statsErr } = await supabase
    .from('user_stats')
    .select('id')
    .limit(1);
  console.log('user_stats:', statsErr ? `❌ ${statsErr.message}` : '✅ EXISTS');

  // Check existing tables
  const { data: cases } = await supabase.from('cases').select('id').limit(1);
  console.log('cases:', cases !== null ? '✅ EXISTS' : '❌ MISSING');

  const { data: personas } = await supabase.from('ai_personas').select('id').limit(1);
  console.log('ai_personas:', personas !== null ? '✅ EXISTS' : '❌ MISSING');

  console.log('\n[Done]');
}

runMigration().catch(console.error);
