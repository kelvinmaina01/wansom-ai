-- =====================================================
-- LAWLIFY AI - WORKSPACE COLLABORATION MIGRATION
-- =====================================================

-- 1. Create Workspace Role Enum
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'workspace_role') THEN
        CREATE TYPE public.workspace_role AS ENUM ('admin', 'editor', 'viewer');
    END IF;
END $$;

-- 2. Create Workspace Members Table
CREATE TABLE IF NOT EXISTS public.workspace_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    role public.workspace_role NOT NULL DEFAULT 'viewer',
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(workspace_id, user_id)
);

-- Enable RLS for Members
ALTER TABLE public.workspace_members ENABLE ROW LEVEL SECURITY;

-- 3. Create Workspace Invitations Table
CREATE TABLE IF NOT EXISTS public.workspace_invitations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    role public.workspace_role NOT NULL DEFAULT 'viewer',
    inviter_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    token TEXT UNIQUE NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined', 'expired')),
    expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '7 days'),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for Invitations
ALTER TABLE public.workspace_invitations ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 4. UPDATE RLS POLICIES FOR SHARED ACCESS
-- =====================================================

-- 4.1 Workspaces
DROP POLICY IF EXISTS "Users can manage own workspaces" ON public.workspaces;
CREATE POLICY "Members can view workspace" ON public.workspaces
FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM public.workspace_members
        WHERE workspace_id = id AND user_id = auth.uid()
    )
);

CREATE POLICY "Admins can update workspace" ON public.workspaces
FOR UPDATE USING (
    EXISTS (
        SELECT 1 FROM public.workspace_members
        WHERE workspace_id = id AND user_id = auth.uid() AND role = 'admin'
    )
);

-- 4.2 Chat Histories
DROP POLICY IF EXISTS "Users can manage own chat histories" ON public.chat_histories;
CREATE POLICY "Members can view chat histories" ON public.chat_histories
FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM public.workspace_members
        WHERE workspace_id = chat_histories.workspace_id AND user_id = auth.uid()
    )
);

CREATE POLICY "Editors can manage chat histories" ON public.chat_histories
FOR ALL USING (
    EXISTS (
        SELECT 1 FROM public.workspace_members
        WHERE workspace_id = chat_histories.workspace_id 
        AND user_id = auth.uid() 
        AND role IN ('admin', 'editor')
    )
);

-- 4.3 Files
DROP POLICY IF EXISTS "Users can manage own files" ON public.files;
CREATE POLICY "Members can view files" ON public.files
FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM public.workspace_members
        WHERE workspace_id = (SELECT workspace_id FROM public.folders WHERE id = folder_id)
        AND user_id = auth.uid()
    ) OR user_id = auth.uid() -- Backwards compatibility for personal files
);

-- 4.4 Invitations Policies
CREATE POLICY "Admins can manage invitations" ON public.workspace_invitations
FOR ALL USING (
    EXISTS (
        SELECT 1 FROM public.workspace_members
        WHERE workspace_id = public.workspace_invitations.workspace_id 
        AND user_id = auth.uid() 
        AND role = 'admin'
    )
);

-- 4.5 Members Policies
CREATE POLICY "Members can view teammates" ON public.workspace_members
FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM public.workspace_members AS m
        WHERE m.workspace_id = public.workspace_members.workspace_id 
        AND m.user_id = auth.uid()
    )
);

-- =====================================================
-- 5. INITIALIZE EXISTING WORKSPACES
-- =====================================================
-- For any existing workspaces, make the creator an admin in members table
INSERT INTO public.workspace_members (workspace_id, user_id, role)
SELECT id, user_id, 'admin'::public.workspace_role
FROM public.workspaces
ON CONFLICT (workspace_id, user_id) DO NOTHING;
