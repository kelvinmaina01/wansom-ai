-- Add enrichment fields to legal_messages to support Claude-style UI persistence
ALTER TABLE public.legal_messages 
ADD COLUMN IF NOT EXISTS thinking TEXT,
ADD COLUMN IF NOT EXISTS artifact JSONB;

-- Ensure workspace_id in chat_histories is nullable to support general chats
ALTER TABLE public.chat_histories 
ALTER COLUMN workspace_id DROP NOT NULL;

-- Add indexes for better performance on large chat histories
CREATE INDEX IF NOT EXISTS idx_legal_messages_chat_history_id ON public.legal_messages(chat_history_id);
CREATE INDEX IF NOT EXISTS idx_chat_histories_user_id ON public.chat_histories(user_id);
