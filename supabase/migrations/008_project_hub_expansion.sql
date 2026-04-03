-- 008_project_hub_expansion.sql
-- 1. Create Activity Log Table
CREATE TABLE IF NOT EXISTS public.case_activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    case_id UUID REFERENCES public.cases(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    details JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Indices for performance
CREATE INDEX IF NOT EXISTS idx_case_activities_case_id ON public.case_activities(case_id);
CREATE INDEX IF NOT EXISTS idx_case_activities_created_at ON public.case_activities(created_at DESC);

-- Enable RLS
ALTER TABLE public.case_activities ENABLE ROW LEVEL SECURITY;

-- Policy: Members can view activities
CREATE POLICY "Members can view activities" 
ON public.case_activities FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.case_members 
    WHERE case_id = case_activities.case_id 
    AND user_id = auth.uid()
  )
);

-- 2. Add 'Archived' status constraint logic (Application level, but documented here)
-- No changes needed to DDL for status if it's a simple text column.
