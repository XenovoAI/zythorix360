-- Fix Storage Buckets Configuration
-- Run this in Supabase SQL Editor

-- First, check if buckets exist
SELECT id, name, public FROM storage.buckets WHERE id IN ('materials-pdfs', 'materials-thumbnails');

-- Update existing buckets (don't delete, just update configuration)
UPDATE storage.buckets 
SET 
  public = true,
  file_size_limit = 52428800,
  allowed_mime_types = ARRAY['application/pdf']
WHERE id = 'materials-pdfs';

UPDATE storage.buckets 
SET 
  public = true,
  file_size_limit = 10485760,
  allowed_mime_types = ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
WHERE id = 'materials-thumbnails';

-- If buckets don't exist, create them
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'materials-pdfs',
  'materials-pdfs',
  true,
  52428800,
  ARRAY['application/pdf']
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'materials-thumbnails',
  'materials-thumbnails',
  true,
  10485760,
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;

-- Drop all existing policies
DROP POLICY IF EXISTS "Public can view PDFs" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated can upload PDFs" ON storage.objects;
DROP POLICY IF EXISTS "Service role can manage PDFs" ON storage.objects;
DROP POLICY IF EXISTS "Public can view thumbnails" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated can upload thumbnails" ON storage.objects;
DROP POLICY IF EXISTS "Service role can manage thumbnails" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view materials PDFs" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view materials thumbnails" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload PDFs" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload thumbnails" ON storage.objects;

-- Create simple public access policies for PDFs
CREATE POLICY "Anyone can view materials PDFs"
ON storage.objects FOR SELECT
USING (bucket_id = 'materials-pdfs');

CREATE POLICY "Authenticated users can upload PDFs"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'materials-pdfs' AND
  auth.role() = 'authenticated'
);

CREATE POLICY "Authenticated users can update PDFs"
ON storage.objects FOR UPDATE
USING (bucket_id = 'materials-pdfs' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete PDFs"
ON storage.objects FOR DELETE
USING (bucket_id = 'materials-pdfs' AND auth.role() = 'authenticated');

-- Create simple public access policies for thumbnails
CREATE POLICY "Anyone can view materials thumbnails"
ON storage.objects FOR SELECT
USING (bucket_id = 'materials-thumbnails');

CREATE POLICY "Authenticated users can upload thumbnails"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'materials-thumbnails' AND
  auth.role() = 'authenticated'
);

CREATE POLICY "Authenticated users can update thumbnails"
ON storage.objects FOR UPDATE
USING (bucket_id = 'materials-thumbnails' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete thumbnails"
ON storage.objects FOR DELETE
USING (bucket_id = 'materials-thumbnails' AND auth.role() = 'authenticated');

-- Verify buckets are created
SELECT 
  id, 
  name, 
  public,
  file_size_limit,
  allowed_mime_types
FROM storage.buckets 
WHERE id IN ('materials-pdfs', 'materials-thumbnails');

-- Verify policies are created
SELECT 
  schemaname,
  tablename,
  policyname
FROM pg_policies 
WHERE tablename = 'objects' 
  AND policyname LIKE '%materials%'
ORDER BY policyname;

SELECT '✅ Storage buckets fixed successfully!' as status;
