-- Clear Sample Data Script
-- Run this in Supabase SQL Editor to remove all sample/test data

-- Delete all existing materials
DELETE FROM materials;

-- Delete all material downloads
DELETE FROM material_downloads;

-- Delete all purchases
DELETE FROM purchases;

-- Delete all payments
DELETE FROM payments;

-- Delete all influencer orders
DELETE FROM influencer_orders;

-- Optional: Delete all influencers (uncomment if you want to start fresh)
-- DELETE FROM influencers;

-- Reset sequences (optional, keeps IDs clean)
-- This ensures new materials start with fresh data

SELECT 'Sample data cleared successfully!' as status;
