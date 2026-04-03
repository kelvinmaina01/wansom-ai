-- 009_project_history_distinction.sql

-- 1. Add case_id to chat_histories to link sessions to projects
ALTER TABLE public.chat_histories 
ADD COLUMN IF NOT EXISTS case_id UUID REFERENCES public.cases(id) ON DELETE CASCADE;

-- 2. Add index for faster lookup in the sidebar
CREATE INDEX IF NOT EXISTS idx_chat_histories_case_id ON public.chat_histories(case_id);

-- 3. Update RLS policies (optional, but good for security)
-- Assuming we want to ensure users only see chat histories for cases they are members of
-- This usually depends on existing case_members policies, but adding a check here is safer.
ALTER TABLE public.chat_histories ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view chat history for any case they are a member of
CREATE POLICY "Users can view chats for their cases" 
ON public.chat_histories FOR SELECT 
USING (
  user_id = auth.uid() OR 
  EXISTS (
    SELECT 1 FROM public.case_members 
    WHERE case_id = public.chat_histories.case_id 
    AND user_id = auth.uid()
  )
);
