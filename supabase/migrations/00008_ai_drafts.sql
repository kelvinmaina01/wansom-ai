-- AI Drafts schema migration
CREATE TABLE IF NOT EXISTS ai_drafts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'document',
    status TEXT NOT NULL DEFAULT 'draft',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE ai_drafts ENABLE ROW LEVEL SECURITY;

-- Create Policies
CREATE POLICY "Users can view their own drafts" 
ON ai_drafts FOR SELECT 
TO authenticated 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own drafts" 
ON ai_drafts FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own drafts" 
ON ai_drafts FOR UPDATE 
TO authenticated 
USING (auth.uid() = user_id) 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own drafts" 
ON ai_drafts FOR DELETE 
TO authenticated 
USING (auth.uid() = user_id);

-- Create updated_at trigger
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON ai_drafts
  FOR EACH ROW EXECUTE PROCEDURE moddatetime (updated_at);
