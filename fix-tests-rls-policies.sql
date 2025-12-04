-- Fix RLS policies for tests table to allow admin operations
-- Run this in your Supabase SQL Editor

-- Drop existing policies
DROP POLICY IF EXISTS "Tests are viewable by everyone" ON tests;
DROP POLICY IF EXISTS "Service role full access tests" ON tests;
DROP POLICY IF EXISTS "Users can view own test downloads" ON test_downloads;
DROP POLICY IF EXISTS "Users can insert own test downloads" ON test_downloads;
DROP POLICY IF EXISTS "Service role full access test_downloads" ON test_downloads;

-- Tests table policies
-- Public read access
CREATE POLICY "Tests are viewable by everyone" 
ON tests FOR SELECT 
USING (true);

-- Allow authenticated users to insert (we'll check admin in app logic)
CREATE POLICY "Authenticated users can insert tests" 
ON tests FOR INSERT 
TO authenticated
WITH CHECK (true);

-- Allow authenticated users to update (we'll check admin in app logic)
CREATE POLICY "Authenticated users can update tests" 
ON tests FOR UPDATE 
TO authenticated
USING (true)
WITH CHECK (true);

-- Allow authenticated users to delete (we'll check admin in app logic)
CREATE POLICY "Authenticated users can delete tests" 
ON tests FOR DELETE 
TO authenticated
USING (true);

-- Service role has full access
CREATE POLICY "Service role full access tests" 
ON tests FOR ALL 
USING (auth.role() = 'service_role');

-- Test downloads policies
-- Users can view their own downloads
CREATE POLICY "Users can view own test downloads" 
ON test_downloads FOR SELECT 
USING (auth.uid() = user_id);

-- Users can insert their own downloads
CREATE POLICY "Users can insert own test downloads" 
ON test_downloads FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Service role has full access
CREATE POLICY "Service role full access test_downloads" 
ON test_downloads FOR ALL 
USING (auth.role() = 'service_role');

-- Grant necessary permissions
GRANT ALL ON tests TO authenticated;
GRANT ALL ON test_downloads TO authenticated;
