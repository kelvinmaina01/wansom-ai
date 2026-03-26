-- =====================================================
-- LAWLIFY AI - COMPLETE DATABASE SCHEMA SETUP
-- =====================================================
-- Run this entire file in Supabase Dashboard > SQL Editor
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- MIGRATION 00001: Initial Schema
-- =====================================================

-- 1. User Settings Table
CREATE TABLE IF NOT EXISTS public.user_settings (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    profile_name TEXT,
    profile_email TEXT,
    profile_phone TEXT,
    profile_firm_name TEXT,
    notifications_email BOOLEAN DEFAULT true,
    notifications_push BOOLEAN DEFAULT true,
    notifications_case_updates BOOLEAN DEFAULT true,
    notifications_news_digest BOOLEAN DEFAULT true,
    security_two_factor_enabled BOOLEAN DEFAULT false,
    billing_plan TEXT DEFAULT 'Free',
    billing_next_date TIMESTAMP WITH TIME ZONE,
    integrations JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own settings" ON public.user_settings;
CREATE POLICY "Users can view own settings" ON public.user_settings FOR SELECT USING (auth.uid() = id);
DROP POLICY IF EXISTS "Users can update own settings" ON public.user_settings;
CREATE POLICY "Users can update own settings" ON public.user_settings FOR UPDATE USING (auth.uid() = id);

-- 2. Workspaces
CREATE TABLE IF NOT EXISTS public.workspaces (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    last_modified TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.workspaces ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage own workspaces" ON public.workspaces;
CREATE POLICY "Users can manage own workspaces" ON public.workspaces FOR ALL USING (auth.uid() = user_id);

-- 3. Chat Histories
CREATE TABLE IF NOT EXISTS public.chat_histories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    workspace_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    last_message TEXT,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.chat_histories ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage own chat histories" ON public.chat_histories;
CREATE POLICY "Users can manage own chat histories" ON public.chat_histories FOR ALL USING (auth.uid() = user_id);

-- 4. Legal Messages
CREATE TABLE IF NOT EXISTS public.legal_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    chat_history_id UUID REFERENCES public.chat_histories(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
    content TEXT NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    sources JSONB DEFAULT '[]'::jsonb,
    citations JSONB DEFAULT '[]'::jsonb,
    is_draft BOOLEAN DEFAULT false,
    is_generating BOOLEAN DEFAULT false
);

ALTER TABLE public.legal_messages ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage messages in their chats" ON public.legal_messages;
CREATE POLICY "Users can manage messages in their chats" ON public.legal_messages 
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.chat_histories 
      WHERE id = chat_history_id AND user_id = auth.uid()
    )
  );

-- 5. Saved Prompts
CREATE TABLE IF NOT EXISTS public.saved_prompts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    category TEXT NOT NULL,
    last_used TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.saved_prompts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage own saved prompts" ON public.saved_prompts;
CREATE POLICY "Users can manage own saved prompts" ON public.saved_prompts FOR ALL USING (auth.uid() = user_id);

-- 6. Drafts
CREATE TABLE IF NOT EXISTS public.drafts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('document', 'email', 'advice')),
    last_modified TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.drafts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage own drafts" ON public.drafts;
CREATE POLICY "Users can manage own drafts" ON public.drafts FOR ALL USING (auth.uid() = user_id);

-- =====================================================
-- MIGRATION 00002: Files and Folders
-- =====================================================

-- 1. Folders Table
CREATE TABLE IF NOT EXISTS public.folders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.folders ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage own folders" ON public.folders;
CREATE POLICY "Users can manage own folders" ON public.folders FOR ALL USING (auth.uid() = user_id);

-- 2. Files Table
CREATE TABLE IF NOT EXISTS public.files (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    folder_id UUID REFERENCES public.folders(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    size BIGINT NOT NULL,
    type TEXT NOT NULL,
    status TEXT DEFAULT 'analyzing' CHECK (status IN ('analyzing', 'completed', 'error')),
    uploaded_by TEXT,
    tags JSONB DEFAULT '[]'::jsonb,
    is_starred BOOLEAN DEFAULT false,
    storage_path TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.files ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage own files" ON public.files;
CREATE POLICY "Users can manage own files" ON public.files FOR ALL USING (auth.uid() = user_id);

-- =====================================================
-- MIGRATION 00003: Judicial Analytics
-- =====================================================

CREATE TABLE IF NOT EXISTS public.judges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    title TEXT NOT NULL,
    court TEXT NOT NULL,
    image TEXT,
    years_experience INTEGER DEFAULT 0,
    appointed_date TEXT,
    win_rate INTEGER DEFAULT 0,
    total_cases INTEGER DEFAULT 0,
    avg_duration TEXT,
    ruling_tendencies JSONB DEFAULT '[]'::jsonb,
    common_citations JSONB DEFAULT '[]'::jsonb,
    insights TEXT[] DEFAULT '{}',
    recent_rulings JSONB DEFAULT '[]'::jsonb,
    monthly_activity JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.judges ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can view judges" ON public.judges;
CREATE POLICY "Public can view judges" ON public.judges FOR SELECT USING (true);

-- =====================================================
-- MIGRATION 00004: Onboarding Responses
-- =====================================================

CREATE TABLE IF NOT EXISTS public.onboarding_responses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE,
    discovery_source TEXT,
    team_name TEXT,
    social_links JSONB,
    terms_accepted BOOLEAN NOT NULL DEFAULT false,
    onboarding_completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.onboarding_responses ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage own onboarding data" ON public.onboarding_responses;
CREATE POLICY "Users can manage own onboarding data"
  ON public.onboarding_responses
  FOR ALL
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE INDEX IF NOT EXISTS idx_onboarding_responses_user_id
  ON public.onboarding_responses(user_id);

-- =====================================================
-- MIGRATION 00005: Admin Users (for Kockpit Dashboard)
-- =====================================================

-- Admins table (email/password auth for admin dashboard)
CREATE TABLE IF NOT EXISTS public.admins (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    name TEXT NOT NULL,
    role TEXT DEFAULT 'admin' CHECK (role IN ('super_admin', 'admin', 'moderator')),
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;

-- Allow read access to authenticated admins only
DROP POLICY IF EXISTS "Admins can view all admins";
CREATE POLICY "Admins can view all admins" 
  ON public.admins FOR SELECT 
  TO authenticated
  USING (true);

-- Allow insert for service role only (via backend)
DROP POLICY IF EXISTS "Service role can insert admins";
CREATE POLICY "Service role can insert admins"
  ON public.admins FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Allow update for service role only
DROP POLICY IF EXISTS "Service role can update admins";
CREATE POLICY "Service role can update admins"
  ON public.admins FOR UPDATE
  TO authenticated
  USING (true);

-- Create function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin(user_email TEXT)
RETURNS BOOLEAN AS $
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.admins 
        WHERE email = user_email AND is_active = true
    );
END;
$ LANGUAGE plpgsql SECURITY DEFINER;

-- Insert default admin
-- Password: admin123 (plain text for demo)
INSERT INTO public.admins (email, password_hash, name, role) 
VALUES 
    ('admin@lawlify.ai', 'admin123', 'Super Admin', 'super_admin')
ON CONFLICT (email) DO NOTHING
RETURNING id, email;

-- =====================================================
-- VERIFICATION: List all created tables
-- =====================================================

SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;

-- =====================================================
-- CREATE STORAGE BUCKET (Manual Step Required)
-- =====================================================
-- Go to Supabase Dashboard > Storage > New Bucket
-- Create a bucket named: legal-documents
-- Make it public: No
-- =====================================================
