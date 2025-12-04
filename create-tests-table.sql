-- Create tests table for PDF downloads
-- Run this in your Supabase SQL Editor

-- Tests table
CREATE TABLE IF NOT EXISTS tests (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(50) NOT NULL CHECK (category IN ('NEET', 'JEE', 'Physics', 'Chemistry', 'Biology', 'Mathematics')),
    difficulty VARCHAR(20) DEFAULT 'Medium' CHECK (difficulty IN ('Easy', 'Medium', 'Hard')),
    duration INTEGER DEFAULT 60, -- in minutes
    questions INTEGER DEFAULT 30,
    pdf_url TEXT,
    thumbnail_url TEXT,
    is_free BOOLEAN DEFAULT false,
    price INTEGER DEFAULT 0,
    attempts INTEGER DEFAULT 0,
    downloads INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Test downloads tracking table
CREATE TABLE IF NOT EXISTS test_downloads (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    user_email VARCHAR(255),
    test_id UUID REFERENCES tests(id) ON DELETE CASCADE,
    test_title VARCHAR(255),
    test_type VARCHAR(20) DEFAULT 'paid' CHECK (test_type IN ('free', 'paid')),
    payment_id UUID REFERENCES payments(id),
    downloaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_downloads ENABLE ROW LEVEL SECURITY;

-- RLS Policies for tests (public read access)
CREATE POLICY "Tests are viewable by everyone" ON tests FOR SELECT USING (true);

-- RLS Policies for test downloads (user can only see their own)
CREATE POLICY "Users can view own test downloads" ON test_downloads FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own test downloads" ON test_downloads FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Service role has full access
CREATE POLICY "Service role full access tests" ON tests FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access test_downloads" ON test_downloads FOR ALL USING (auth.role() = 'service_role');

-- Create indexes for better performance
CREATE INDEX idx_tests_category ON tests(category);
CREATE INDEX idx_tests_difficulty ON tests(difficulty);
CREATE INDEX idx_tests_is_free ON tests(is_free);
CREATE INDEX idx_test_downloads_user_id ON test_downloads(user_id);
CREATE INDEX idx_test_downloads_test_id ON test_downloads(test_id);

-- Insert sample data
INSERT INTO tests (title, description, category, difficulty, duration, questions, is_free, price, attempts, downloads) VALUES
('NEET Full Mock Test 1', 'Complete NEET mock test with 180 questions covering Physics, Chemistry, and Biology', 'NEET', 'Medium', 180, 180, false, 199, 1250, 450),
('JEE Main Practice Test', 'JEE Main pattern test with Physics, Chemistry, and Mathematics', 'JEE', 'Medium', 180, 90, false, 149, 980, 320),
('Physics Chapter Test - Mechanics', 'Comprehensive test on mechanics and motion', 'Physics', 'Easy', 60, 30, true, 0, 2100, 890),
('Chemistry - Organic Reactions', 'Advanced organic chemistry reactions test', 'Chemistry', 'Hard', 45, 25, false, 99, 1560, 540),
('Biology - Human Physiology', 'Detailed test on human body systems', 'Biology', 'Medium', 60, 40, true, 0, 1890, 670),
('Mathematics - Calculus', 'Calculus problems with integration and differentiation', 'Mathematics', 'Hard', 90, 35, false, 129, 1120, 380);
