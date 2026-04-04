-- Create Activity Logs Table
CREATE TABLE IF NOT EXISTS public.activity_logs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    case_id UUID REFERENCES public.cases(id) ON DELETE CASCADE,
    action TEXT NOT NULL, -- e.g., 'drafted', 'analyzed', 'completed'
    target TEXT NOT NULL, -- e.g., 'NDA for Project Alpha'
    icon TEXT DEFAULT 'FileText',
    metadata JSONB DEFAULT '{}'::JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for Activity Logs
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own activity logs"
    ON public.activity_logs FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Service role can insert activity logs"
    ON public.activity_logs FOR INSERT
    WITH CHECK (true); -- Usually inserts happen via backend

-- Create User Stats Table
CREATE TABLE IF NOT EXISTS public.user_stats (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
    total_queries INTEGER DEFAULT 0,
    active_projects INTEGER DEFAULT 0,
    time_saved_hours INTEGER DEFAULT 0,
    statutes_indexed INTEGER DEFAULT 0,
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

-- Enable RLS for User Stats
ALTER TABLE public.user_stats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own stats"
    ON public.user_stats FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Service role can update stats"
    ON public.user_stats FOR UPDATE
    USING (true);

CREATE POLICY "Service role can insert stats"
    ON public.user_stats FOR INSERT
    WITH CHECK (true);

-- Create trigger to auto-create user_stats when user is created
CREATE OR REPLACE FUNCTION public.handle_new_user_stats() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_stats (user_id)
  VALUES (new.id);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new users
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'on_auth_user_created_stats') THEN
    CREATE TRIGGER on_auth_user_created_stats
      AFTER INSERT ON auth.users
      FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user_stats();
  END IF;
END
$$;
