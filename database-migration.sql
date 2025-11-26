-- Zythorix360 Database Migration Script
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Materials table
CREATE TABLE materials (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    subject VARCHAR(50) NOT NULL CHECK (subject IN ('Physics', 'Chemistry', 'Biology', 'Mathematics')),
    class VARCHAR(20) NOT NULL CHECK (class IN ('Class 10', 'Class 11', 'Class 12', 'Dropper')),
    pdf_url TEXT,
    thumbnail_url TEXT,
    is_free BOOLEAN DEFAULT false,
    price INTEGER DEFAULT 0,
    downloads INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Payments table
CREATE TABLE payments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    amount INTEGER NOT NULL,
    payment_method VARCHAR(50) DEFAULT 'razorpay',
    transaction_id VARCHAR(255),
    razorpay_order_id VARCHAR(255),
    razorpay_payment_id VARCHAR(255),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
    subscription_type VARCHAR(50),
    coupon_code VARCHAR(50),
    original_amount INTEGER,
    discount_amount INTEGER DEFAULT 0,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Purchases table
CREATE TABLE purchases (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    material_id UUID REFERENCES materials(id) ON DELETE CASCADE,
    payment_id UUID REFERENCES payments(id),
    amount INTEGER NOT NULL,
    status VARCHAR(20) DEFAULT 'completed',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Material downloads table
CREATE TABLE material_downloads (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    user_email VARCHAR(255),
    material_id UUID REFERENCES materials(id) ON DELETE CASCADE,
    material_title VARCHAR(255),
    material_type VARCHAR(20) DEFAULT 'paid' CHECK (material_type IN ('free', 'paid')),
    payment_id UUID REFERENCES payments(id),
    downloaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Influencers table
CREATE TABLE influencers (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    coupon_code VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    commission_rate DECIMAL(5,2) DEFAULT 10.00,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Influencer orders table
CREATE TABLE influencer_orders (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    influencer_id UUID REFERENCES influencers(id) ON DELETE SET NULL,
    order_amount DECIMAL(10,2) NOT NULL,
    discount_amount DECIMAL(10,2) DEFAULT 0,
    commission_amount DECIMAL(10,2) NOT NULL,
    coupon_used VARCHAR(50) NOT NULL,
    customer_email VARCHAR(255),
    material_id UUID REFERENCES materials(id) ON DELETE SET NULL,
    payment_id VARCHAR(255),
    status VARCHAR(50) DEFAULT 'completed',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE material_downloads ENABLE ROW LEVEL SECURITY;
ALTER TABLE influencers ENABLE ROW LEVEL SECURITY;
ALTER TABLE influencer_orders ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Materials (public read access)
CREATE POLICY "Materials are viewable by everyone" ON materials FOR SELECT USING (true);

-- Payments (user can only see their own)
CREATE POLICY "Users can view own payments" ON payments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own payments" ON payments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own payments" ON payments FOR UPDATE USING (auth.uid() = user_id);

-- Purchases (user can only see their own)
CREATE POLICY "Users can view own purchases" ON purchases FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own purchases" ON purchases FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Material downloads (user can only see their own)
CREATE POLICY "Users can view own downloads" ON material_downloads FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own downloads" ON material_downloads FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Service role has full access to all tables
CREATE POLICY "Service role full access materials" ON materials FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access payments" ON payments FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access purchases" ON purchases FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access downloads" ON material_downloads FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access influencers" ON influencers FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access influencer_orders" ON influencer_orders FOR ALL USING (auth.role() = 'service_role');

-- Create indexes for better performance
CREATE INDEX idx_materials_subject ON materials(subject);
CREATE INDEX idx_materials_class ON materials(class);
CREATE INDEX idx_materials_is_free ON materials(is_free);
CREATE INDEX idx_payments_user_id ON payments(user_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_purchases_user_id ON purchases(user_id);
CREATE INDEX idx_purchases_material_id ON purchases(material_id);
CREATE INDEX idx_downloads_user_id ON material_downloads(user_id);
CREATE INDEX idx_downloads_material_id ON material_downloads(material_id);
CREATE INDEX idx_influencers_coupon ON influencers(coupon_code);
CREATE INDEX idx_influencers_email ON influencers(email);
CREATE INDEX idx_influencer_orders_influencer_id ON influencer_orders(influencer_id);
CREATE INDEX idx_influencer_orders_created_at ON influencer_orders(created_at);

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES ('materials', 'materials', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('thumbnails', 'thumbnails', true);

-- Storage policies
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'materials');
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'thumbnails');
CREATE POLICY "Service role can upload" ON storage.objects FOR INSERT WITH CHECK (auth.role() = 'service_role');
CREATE POLICY "Service role can update" ON storage.objects FOR UPDATE USING (auth.role() = 'service_role');
CREATE POLICY "Service role can delete" ON storage.objects FOR DELETE USING (auth.role() = 'service_role');