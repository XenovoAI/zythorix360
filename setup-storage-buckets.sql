-- Setup Storage Buckets for Materials
-- Run this in Supabase SQL Editor

-- Create materials-pdfs bucket (for PDF files)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'materials-pdfs',
  'materials-pdfs',
  true,
  52428800, -- 50MB limit
  ARRAY['application/pdf']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 52428800,
  allowed_mime_types = ARRAY['application/pdf'];

-- Create materials-thumbnails bucket (for thumbnail images)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'materials-thumbnails',
  'materials-thumbnails',
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/jpg', 'image/webp']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];

-- Storage policies for materials-pdfs
DROP POLICY IF EXISTS "Public can view PDFs" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated can upload PDFs" ON storage.objects;
DROP POLICY IF EXISTS "Service role can manage PDFs" ON storage.objects;

CREATE POLICY "Public can view PDFs" ON storage.objects
FOR SELECT USING (bucket_id = 'materials-pdfs');

CREATE POLICY "Authenticated can upload PDFs" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'materials-pdfs' AND
  auth.role() IN ('authenticated', 'service_role')
);

CREATE POLICY "Service role can manage PDFs" ON storage.objects
FOR ALL USING (
  bucket_id = 'materials-pdfs' AND
  auth.role() = 'service_role'
);

-- Storage policies for materials-thumbnails
DROP POLICY IF EXISTS "Public can view thumbnails" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated can upload thumbnails" ON storage.objects;
DROP POLICY IF EXISTS "Service role can manage thumbnails" ON storage.objects;

CREATE POLICY "Public can view thumbnails" ON storage.objects
FOR SELECT USING (bucket_id = 'materials-thumbnails');

CREATE POLICY "Authenticated can upload thumbnails" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'materials-thumbnails' AND
  auth.role() IN ('authenticated', 'service_role')
);

CREATE POLICY "Service role can manage thumbnails" ON storage.objects
FOR ALL USING (
  bucket_id = 'materials-thumbnails' AND
  auth.role() = 'service_role'
);

SELECT 'Storage buckets configured successfully!' as status;
