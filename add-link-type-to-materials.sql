-- Add link_type column to materials table
-- This allows each material to have a unique system ID based on its type

-- Add the link_type column
ALTER TABLE materials 
ADD COLUMN IF NOT EXISTS link_type VARCHAR(50);

-- Add a check constraint to ensure valid link types
ALTER TABLE materials 
ADD CONSTRAINT check_link_type 
CHECK (link_type IN ('notes', 'question-bank', 'practice-papers', 'revision', 'formula-sheet', 'concept-map', 'video-notes', 'solved-examples', 'previous-year', 'mock-test'));

-- Create an index for better query performance
CREATE INDEX IF NOT EXISTS idx_materials_link_type ON materials(link_type);

-- Update existing materials with default link_type (optional)
-- You can customize this based on your existing data
UPDATE materials 
SET link_type = 'notes' 
WHERE link_type IS NULL;

-- Add comment to document the column
COMMENT ON COLUMN materials.link_type IS 'System ID for material type: notes, question-bank, practice-papers, revision, formula-sheet, concept-map, video-notes, solved-examples, previous-year, mock-test';
