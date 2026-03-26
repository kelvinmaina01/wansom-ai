-- Insert Super Admin User
-- Run this after migration 005_admin_users

-- First, create the admins table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.admins (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    name TEXT NOT NULL,
    role TEXT DEFAULT 'admin' CHECK (role IN ('super_admin', 'admin', 'moderator')),
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;

-- Allow read access (drop first if exists, then create)
DROP POLICY IF EXISTS "Admins can view all admins" ON public.admins;
CREATE POLICY "Admins can view all admins" 
  ON public.admins FOR SELECT TO authenticated USING (true);

-- Insert Kelvin as Super Admin
INSERT INTO public.admins (email, password_hash, name, role) 
VALUES 
    
ON CONFLICT (email) DO NOTHING
RETURNING id, email, name, role;

 