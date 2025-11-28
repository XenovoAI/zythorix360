-- Add Sample Materials
-- Run this in Supabase SQL Editor

-- First, let's check and fix RLS policies for materials table
DROP POLICY IF EXISTS "Materials are viewable by everyone" ON materials;
DROP POLICY IF EXISTS "Service role full access materials" ON materials;

-- Create proper RLS policies
CREATE POLICY "Enable read access for all users" ON materials
FOR SELECT USING (true);

CREATE POLICY "Enable insert for service role only" ON materials
FOR INSERT WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Enable update for service role only" ON materials
FOR UPDATE USING (auth.role() = 'service_role');

CREATE POLICY "Enable delete for service role only" ON materials
FOR DELETE USING (auth.role() = 'service_role');

-- Insert sample materials
INSERT INTO materials (title, description, subject, class, is_free, price, downloads) VALUES
('Physics - Laws of Motion', 'Complete chapter notes covering Newton''s laws, friction, and circular motion with solved examples', 'Physics', 'Class 11', true, 0, 245),
('Chemistry - Organic Chemistry Basics', 'Introduction to organic chemistry including nomenclature, isomerism, and basic reactions', 'Chemistry', 'Class 11', false, 99, 189),
('Biology - Human Physiology', 'Detailed notes on digestive, respiratory, circulatory, and excretory systems', 'Biology', 'Class 12', false, 149, 312),
('Mathematics - Calculus', 'Limits, derivatives, and integration with step-by-step solutions', 'Mathematics', 'Class 12', true, 0, 567),
('Physics - Electromagnetism', 'Complete electromagnetic theory including Maxwell''s equations', 'Physics', 'Class 12', false, 129, 198),
('Chemistry - Chemical Kinetics', 'Rate of reactions, order, and mechanisms with practice problems', 'Chemistry', 'Class 12', false, 99, 156),
('Biology - Genetics and Evolution', 'Mendelian genetics, DNA structure, and evolutionary concepts', 'Biology', 'Class 12', true, 0, 423),
('Mathematics - Coordinate Geometry', 'Lines, circles, parabolas, and hyperbolas with solved examples', 'Mathematics', 'Class 11', false, 79, 234);

-- Verify insertion
SELECT COUNT(*) as total_materials FROM materials;
SELECT * FROM materials ORDER BY created_at DESC;
