-- 00002_files_folders.sql
-- Migration to add Files and Folders tables

-- 1. Folders Table
CREATE TABLE IF NOT EXISTS public.folders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.folders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own folders" ON public.folders FOR ALL USING (auth.uid() = user_id);

-- 2. Files Table
CREATE TABLE IF NOT EXISTS public.files (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    folder_id UUID REFERENCES public.folders(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    size BIGINT NOT NULL,
    type TEXT NOT NULL,
    status TEXT DEFAULT 'analyzing' CHECK (status IN ('analyzing', 'completed', 'error')),
    uploaded_by TEXT,
    tags JSONB DEFAULT '[]'::jsonb,
    is_starred BOOLEAN DEFAULT false,
    storage_path TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.files ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own files" ON public.files FOR ALL USING (auth.uid() = user_id);
