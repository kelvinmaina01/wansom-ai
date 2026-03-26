-- Migration: 00004_onboarding_responses
-- Stores onboarding questionnaire data collected during new user sign-up

CREATE TABLE IF NOT EXISTS public.onboarding_responses (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL UNIQUE,
  discovery_source TEXT,          -- How they heard about Lawlify
  team_name     TEXT,             -- Team / firm name entered during onboarding
  social_links  JSONB,            -- { linkedin, x, youtube, email, ... }
  terms_accepted BOOLEAN NOT NULL DEFAULT false,
  onboarding_completed_at TIMESTAMPTZ,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Row Level Security
ALTER TABLE public.onboarding_responses ENABLE ROW LEVEL SECURITY;

-- Users can only read/write their own onboarding row
-- NOTE: Backend uses service role key which bypasses RLS.
-- This policy only applies to direct client-side Supabase calls (if any).
CREATE POLICY "Users can manage own onboarding data"
  ON public.onboarding_responses
  FOR ALL
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Index for fast lookup by user_id
CREATE INDEX IF NOT EXISTS idx_onboarding_responses_user_id
  ON public.onboarding_responses(user_id);
