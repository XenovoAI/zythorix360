-- Clear all tests from the database
-- Run this in your Supabase SQL Editor

-- Delete all test downloads first (foreign key constraint)
DELETE FROM test_downloads;

-- Delete all tests
DELETE FROM tests;

-- Reset any sequences if needed
-- This ensures clean state

-- Verify deletion
SELECT COUNT(*) as remaining_tests FROM tests;
SELECT COUNT(*) as remaining_downloads FROM test_downloads;
