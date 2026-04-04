-- 1. Add INSERT policy for user_settings
CREATE POLICY "Users can insert own settings" ON public.user_settings FOR INSERT WITH CHECK (auth.uid() = id);

-- 2. Create RPC for deleting the user
CREATE OR REPLACE FUNCTION public.delete_user()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- We delete from auth.users, which cascades to user_settings, workspaces, etc
  -- Note: We must be SUPERUSER or run as SECURITY DEFINER to bypass RLS on auth table
  DELETE FROM auth.users WHERE id = auth.uid();
END;
$$;

-- 3. Create RPC for wiping workspace data
CREATE OR REPLACE FUNCTION public.reset_workspace_data()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Delete from workspaces, cascading will handle cases, files, etc.
  DELETE FROM public.workspaces WHERE user_id = auth.uid();
  
  -- Re-create a default workspace since we just wiped them
  INSERT INTO public.workspaces (user_id, name, type)
  VALUES (auth.uid(), 'Personal Workspace', 'Case Preparation');
END;
$$;
