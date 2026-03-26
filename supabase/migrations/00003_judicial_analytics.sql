-- 00003_judicial_analytics.sql
-- Migration to add Judges table for Analytics

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
CREATE POLICY "Public can view judges" ON public.judges FOR SELECT USING (true);
