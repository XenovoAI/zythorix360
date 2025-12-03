-- Fix RLS Policies for Purchases Table
-- Run this in Supabase SQL Editor

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view own purchases" ON purchases;
DROP POLICY IF EXISTS "Users can insert own purchases" ON purchases;
DROP POLICY IF EXISTS "Service role full access purchases" ON purchases;

-- Create new policies
-- 1. Users can view their own purchases
CREATE POLICY "Users can view own purchases" 
ON purchases FOR SELECT 
USING (auth.uid() = user_id);

-- 2. Users can insert their own purchases
CREATE POLICY "Users can insert own purchases" 
ON purchases FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- 3. Service role has full access
CREATE POLICY "Service role full access purchases" 
ON purchases FOR ALL 
USING (auth.role() = 'service_role');

-- 4. Authenticated users can check if they purchased (for purchase status check)
CREATE POLICY "Authenticated users can check purchases" 
ON purchases FOR SELECT 
USING (auth.role() = 'authenticated');

-- Verify policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd 
FROM pg_policies 
WHERE tablename = 'purchases';

SELECT 'Purchases RLS policies fixed!' as status;
