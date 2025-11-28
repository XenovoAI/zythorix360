-- Fix RLS Policies for Admin Access
-- Run this in Supabase SQL Editor

-- Drop existing restrictive policies on materials
DROP POLICY IF EXISTS "Materials are viewable by everyone" ON materials;
DROP POLICY IF EXISTS "Service role full access materials" ON materials;

-- Create new policies for materials
-- 1. Everyone can view materials
CREATE POLICY "Anyone can view materials" 
ON materials FOR SELECT 
USING (true);

-- 2. Authenticated users can insert materials
CREATE POLICY "Authenticated users can insert materials" 
ON materials FOR INSERT 
WITH CHECK (auth.role() = 'authenticated');

-- 3. Authenticated users can update materials
CREATE POLICY "Authenticated users can update materials" 
ON materials FOR UPDATE 
USING (auth.role() = 'authenticated');

-- 4. Authenticated users can delete materials
CREATE POLICY "Authenticated users can delete materials" 
ON materials FOR DELETE 
USING (auth.role() = 'authenticated');

-- 5. Service role has full access
CREATE POLICY "Service role full access materials" 
ON materials FOR ALL 
USING (auth.role() = 'service_role');

-- Verify policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'materials';

SELECT 'RLS policies fixed! Admins can now insert materials.' as status;
