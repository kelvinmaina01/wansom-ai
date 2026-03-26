-- Fix for onboarding_responses table
-- Run this if you already ran the migrations and got an error about foreign key

-- Drop the table if it exists with wrong type
DROP TABLE IF EXISTS public.onboarding_responses CASCADE;

-- Recreate with correct UUID type
CREATE TABLE IF NOT EXISTS public.onboarding_responses (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL UNIQUE,
  discovery_source TEXT,
  team_name     TEXT,
  social_links  JSONB,
  terms_accepted BOOLEAN NOT NULL DEFAULT false,
  onboarding_completed_at TIMESTAMPTZ,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.onboarding_responses ENABLE ROW LEVEL SECURITY;

-- RLS Policy - users can only access their own data
CREATE POLICY "Users can manage own onboarding data"
  ON public.onboarding_responses
  FOR ALL
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Index
CREATE INDEX IF NOT EXISTS idx_onboarding_responses_user_id
  ON public.onboarding_responses(user_id);
