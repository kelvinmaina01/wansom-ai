-- Migration: 005_admin_users
-- Creates admin users table for Kockpit authentication

-- Admins table (email/password auth for admin dashboard)
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

-- Allow read access to authenticated admins only
CREATE POLICY "Admins can view all admins" 
  ON public.admins FOR SELECT 
  TO authenticated
  USING (true);

-- Allow insert for service role only (via backend)
CREATE POLICY "Service role can insert admins"
  ON public.admins FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Allow update for service role only
CREATE POLICY "Service role can update admins"
  ON public.admins FOR UPDATE
  TO authenticated
  USING (true);

-- Create function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin(user_email TEXT)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.admins 
        WHERE email = user_email AND is_active = true
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Insert default admin 
-- Password: admin123 (plain text for demo)
INSERT INTO public.admins (email, password_hash, name, role) 
VALUES 
    ('admin@lawlify.ai', 'admin123', 'Super Admin', 'super_admin')
ON CONFLICT (email) DO NOTHING
RETURNING id, email;
