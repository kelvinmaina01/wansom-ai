-- Migration: 00011_judicial_analytics_extended
-- Adds the missing processing tables for the Judicial Analytics engine

-- 1. Judgments Table (Raw Data Storage)
CREATE TABLE IF NOT EXISTS public.judgments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    external_id TEXT UNIQUE, -- AfricanLII or Laws.Africa ID
    judge_id UUID REFERENCES public.judges(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    full_text TEXT,
    publication_date DATE,
    court TEXT,
    url TEXT,
    is_parsed BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Rulings Table (Structured Insights)
CREATE TABLE IF NOT EXISTS public.rulings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    judgment_id UUID REFERENCES public.judgments(id) ON DELETE CASCADE,
    judge_id UUID REFERENCES public.judges(id) ON DELETE CASCADE,
    outcome TEXT, -- allowed, dismissed, partially_allowed
    outcome_for TEXT, -- plaintiff, defendant, etc.
    case_type TEXT, -- commercial, civil, etc.
    matter_summary TEXT,
    reasoning_keywords TEXT[],
    key_statutes TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Citations Table
CREATE TABLE IF NOT EXISTS public.citations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    judge_id UUID REFERENCES public.judges(id) ON DELETE CASCADE,
    cited_case TEXT NOT NULL,
    times_cited INTEGER DEFAULT 1,
    case_types TEXT[], -- categories where this citation was used
    last_cited_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Judge Insights (AI Generated Strategic Advice)
CREATE TABLE IF NOT EXISTS public.judge_insights (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    judge_id UUID REFERENCES public.judges(id) ON DELETE CASCADE,
    insight_type TEXT, -- tip, caution, style
    insight_text TEXT NOT NULL,
    confidence TEXT, -- high, medium, low
    based_on_n INTEGER DEFAULT 0, -- number of cases analyzed
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Newsletter Subscriptions
CREATE TABLE IF NOT EXISTS public.newsletter_subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true,
    jurisdictions TEXT[] DEFAULT '{kenya}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- 6. Judge Ruling Rates (Aggregated View/Cache)
CREATE TABLE IF NOT EXISTS public.judge_ruling_rates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    judge_id UUID REFERENCES public.judges(id) ON DELETE CASCADE,
    case_type TEXT NOT NULL,
    total_cases INTEGER DEFAULT 0,
    allow_rate_pct DECIMAL(5,2) DEFAULT 0,
    UNIQUE(judge_id, case_type)
);

-- Function to increment citation count via RPC
CREATE OR REPLACE FUNCTION public.increment_citation(p_judge_id UUID, p_case TEXT, p_case_type TEXT)
RETURNS VOID AS $$
BEGIN
    INSERT INTO public.citations (judge_id, cited_case, times_cited, case_types)
    VALUES (p_judge_id, p_case, 1, ARRAY[p_case_type])
    ON CONFLICT (judge_id, cited_case) 
    DO UPDATE SET 
        times_cited = citations.times_cited + 1,
        case_types = array_append(citations.case_types, p_case_type),
        last_cited_at = NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- RLS
ALTER TABLE public.judgments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rulings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.citations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.judge_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_subscriptions ENABLE ROW LEVEL SECURITY;

-- Select policies
CREATE POLICY "Public read judgments" ON public.judgments FOR SELECT USING (true);
CREATE POLICY "Public read rulings" ON public.rulings FOR SELECT USING (true);
CREATE POLICY "Public read citations" ON public.citations FOR SELECT USING (true);
CREATE POLICY "Public read insights" ON public.judge_insights FOR SELECT USING (true);
CREATE POLICY "Users manage own subscriptions" ON public.newsletter_subscriptions FOR ALL USING (user_id = auth.uid());
