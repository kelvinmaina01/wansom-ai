-- Initial Schema for Lawlify AI

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Users table (Extends Supabase Auth or Firebase Auth user claims if needed)
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
CREATE POLICY "Users can view own settings" ON public.user_settings FOR SELECT USING (auth.uid() = id);
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
CREATE POLICY "Users can manage own drafts" ON public.drafts FOR ALL USING (auth.uid() = user_id);

-- 7. Notifications
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT NOT NULL,
    category TEXT,
    read BOOLEAN DEFAULT false,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own notifications" ON public.notifications FOR ALL USING (auth.uid() = user_id);

-- 8. Activities
CREATE TABLE IF NOT EXISTS public.activities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    action TEXT NOT NULL,
    target TEXT NOT NULL,
    icon TEXT,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own activities" ON public.activities FOR ALL USING (auth.uid() = user_id);
