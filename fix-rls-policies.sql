-- Fix RLS Policies for Materials Table
-- This will allow public read access to materials

-- Disable RLS temporarily to check if that's the issue
ALTER TABLE materials DISABLE ROW LEVEL SECURITY;

-- Or keep RLS enabled but allow anonymous access
ALTER TABLE materials ENABLE ROW LEVEL SECURITY;

-- Drop all existing policies
DROP POLICY IF EXISTS "Materials are viewable by everyone" ON materials;
DROP POLICY IF EXISTS "Enable read access for all users" ON materials;
DROP POLICY IF EXISTS "Service role full access materials" ON materials;
DROP POLICY IF EXISTS "Enable insert for service role only" ON materials;
DROP POLICY IF EXISTS "Enable update for service role only" ON materials;
DROP POLICY IF EXISTS "Enable delete for service role only" ON materials;

-- Create a simple policy that allows everyone to read
CREATE POLICY "Allow public read access" 
ON materials FOR SELECT 
TO anon, authenticated
USING (true);

-- Allow service role to do everything
CREATE POLICY "Allow service role full access" 
ON materials FOR ALL 
TO service_role
USING (true)
WITH CHECK (true);

-- Verify the table has data
SELECT COUNT(*) as total_materials FROM materials;

-- If no data, insert sample materials
INSERT INTO materials (title, description, subject, class, is_free, price, downloads) 
SELECT * FROM (VALUES
    ('Physics - Laws of Motion', 'Complete chapter notes covering Newton''s laws, friction, and circular motion', 'Physics', 'Class 11', true, 0, 245),
    ('Chemistry - Organic Chemistry', 'Introduction to organic chemistry including nomenclature and reactions', 'Chemistry', 'Class 11', false, 99, 189),
    ('Biology - Human Physiology', 'Detailed notes on digestive, respiratory, and circulatory systems', 'Biology', 'Class 12', false, 149, 312),
    ('Mathematics - Calculus', 'Limits, derivatives, and integration with solutions', 'Mathematics', 'Class 12', true, 0, 567),
    ('Physics - Electromagnetism', 'Complete electromagnetic theory', 'Physics', 'Class 12', false, 129, 198),
    ('Chemistry - Chemical Kinetics', 'Rate of reactions and mechanisms', 'Chemistry', 'Class 12', false, 99, 156),
    ('Biology - Genetics', 'Mendelian genetics and DNA structure', 'Biology', 'Class 12', true, 0, 423),
    ('Mathematics - Coordinate Geometry', 'Lines, circles, and conic sections', 'Mathematics', 'Class 11', false, 79, 234)
) AS v(title, description, subject, class, is_free, price, downloads)
WHERE NOT EXISTS (SELECT 1 FROM materials LIMIT 1);

-- Show all materials
SELECT id, title, subject, is_free, price FROM materials;
