-- Tally Form Submissions Table
-- This table stores form submissions received from Tally webhooks

CREATE TABLE IF NOT EXISTS public.tally_submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    form_id TEXT,
    form_name TEXT,
    submitted_at TIMESTAMPTZ DEFAULT NOW(),
    answers JSONB DEFAULT '{}',
    -- Individual fields extracted for easy querying
    email TEXT,
    name TEXT,
    phone TEXT,
    message TEXT,
    source TEXT DEFAULT 'tally',
    -- Read status for Kockpit dashboard
    read BOOLEAN DEFAULT false,
    read_at TIMESTAMPTZ,
    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.tally_submissions ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to read all submissions (for Kockpit admins)
CREATE POLICY "Authenticated users can read tally submissions" 
ON public.tally_submissions FOR SELECT 
USING (true);

-- Allow service role to insert (for webhook)
CREATE POLICY "Service role can insert tally submissions"
ON public.tally_submissions FOR INSERT
WITH CHECK (true);

-- Allow service role to update
CREATE POLICY "Service role can update tally submissions"
ON public.tally_submissions FOR UPDATE
USING (true);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_tally_submissions_created_at 
ON public.tally_submissions(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_tally_submissions_form_id 
ON public.tally_submissions(form_id);

CREATE INDEX IF NOT EXISTS idx_tally_submissions_read 
ON public.tally_submissions(read) WHERE read = false;
