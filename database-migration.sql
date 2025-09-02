-- Database Migration Script
-- Run this in your Supabase SQL Editor to update existing tables

-- Drop existing tables if they exist
DROP TABLE IF EXISTS bookings CASCADE;
DROP TABLE IF EXISTS visa_applications CASCADE;
DROP TABLE IF EXISTS contact_inquiries CASCADE;

-- Recreate tables with new schema
-- Bookings table
CREATE TABLE bookings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  passport_number TEXT NOT NULL,
  departure_city TEXT NOT NULL,
  destination TEXT NOT NULL,
  departure_date DATE NOT NULL,
  return_date DATE, -- NULL for one-way trips
  trip_type TEXT NOT NULL CHECK (trip_type IN ('round-trip', 'one-way')),
  passengers INTEGER NOT NULL DEFAULT 1,
  travel_class TEXT NOT NULL DEFAULT 'economy' CHECK (travel_class IN ('economy', 'business', 'first')),
  preferred_airline TEXT,
  notes TEXT,
  passport_file_url TEXT,
  total_amount DECIMAL(10,2) DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
  payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'refunded')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Visa applications table
CREATE TABLE visa_applications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  applicant_name TEXT NOT NULL,
  applicant_email TEXT NOT NULL,
  visa_type TEXT NOT NULL,
  duration TEXT NOT NULL,
  age INTEGER NOT NULL,
  birth_year INTEGER NOT NULL,
  passport_number TEXT NOT NULL,
  additional_notes TEXT,
  passport_file_url TEXT,
  bank_statement_url TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  application_date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Contact inquiries table
CREATE TABLE contact_inquiries (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'read', 'replied')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ads management table
CREATE TABLE ads (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  ad_type TEXT NOT NULL CHECK (ad_type IN ('banner', 'popup', 'slide-in', 'floating', 'notification')),
  content_type TEXT NOT NULL CHECK (content_type IN ('promotional', 'offer', 'announcement', 'service')),
  image_url TEXT,
  video_url TEXT,
  cta_text TEXT NOT NULL,
  cta_url TEXT NOT NULL,
  target_pages TEXT[], -- Array of pages where ad should show
  target_audience TEXT DEFAULT 'all', -- 'all', 'new_visitors', 'returning_visitors'
  priority INTEGER DEFAULT 1, -- Higher number = higher priority
  is_active BOOLEAN DEFAULT true,
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  max_impressions INTEGER, -- Limit how many times ad can be shown
  current_impressions INTEGER DEFAULT 0,
  click_count INTEGER DEFAULT 0,
  created_by TEXT DEFAULT 'admin',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_created_at ON bookings(created_at DESC);
CREATE INDEX idx_visa_applications_status ON visa_applications(status);
CREATE INDEX idx_visa_applications_created_at ON visa_applications(created_at DESC);
CREATE INDEX idx_contact_inquiries_status ON contact_inquiries(status);
CREATE INDEX idx_contact_inquiries_created_at ON contact_inquiries(created_at DESC);
CREATE INDEX idx_ads_active ON ads(is_active);
CREATE INDEX idx_ads_type ON ads(ad_type);
CREATE INDEX idx_ads_priority ON ads(priority DESC);
CREATE INDEX idx_ads_dates ON ads(start_date, end_date);

-- Enable Row Level Security (RLS) - allow all operations for now
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE visa_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE ads ENABLE ROW LEVEL SECURITY;

-- Create policies to allow all operations (for admin dashboard)
CREATE POLICY "Allow all operations on bookings" ON bookings FOR ALL USING (true);
CREATE POLICY "Allow all operations on visa_applications" ON visa_applications FOR ALL USING (true);
CREATE POLICY "Allow all operations on contact_inquiries" ON contact_inquiries FOR ALL USING (true);
CREATE POLICY "Allow all operations on ads" ON ads FOR ALL USING (true);

-- Insert sample data for testing
INSERT INTO bookings (
  customer_name, customer_email, customer_phone, passport_number, departure_city, destination, 
  departure_date, return_date, trip_type, passengers, travel_class, 
  preferred_airline, notes, status, payment_status
) VALUES (
  'John Doe', 'john@example.com', '+251912345678', 'ET123456789', 'Addis Ababa', 'Dubai',
  '2024-03-15', '2024-03-22', 'round-trip', 2, 'economy',
  'Emirates', 'Window seats preferred', 'pending', 'pending'
);

INSERT INTO visa_applications (
  applicant_name, applicant_email, visa_type, duration, age, 
  birth_year, passport_number, additional_notes, status, application_date
) VALUES (
  'Jane Smith', 'jane@example.com', 'Tourist Visa', '30 days', 28,
  1996, 'ET123456789', 'First time applying', 'pending', '2024-03-10'
);

-- Insert sample ads
INSERT INTO ads (
  title, description, ad_type, content_type, cta_text, cta_url, 
  target_pages, target_audience, priority, is_active, start_date, end_date
) VALUES 
(
  'Summer Travel Special!', 
  'Get 20% off on all international flights. Book now and save big!', 
  'popup', 
  'offer', 
  'Book Now', 
  '/book-ticket', 
  ARRAY['/', '/book-ticket'], 
  'all', 
  5, 
  true, 
  NOW(), 
  NOW() + INTERVAL '30 days'
),
(
  'Visa Application Made Easy', 
  'Professional visa assistance with 99% success rate. Start your application today!', 
  'slide-in', 
  'service', 
  'Apply Now', 
  '/visa-application', 
  ARRAY['/', '/services'], 
  'all', 
  3, 
  true, 
  NOW(), 
  NOW() + INTERVAL '60 days'
),
(
  'Trusted Travel Partner', 
  'Over 10,000 satisfied customers. Your journey starts with SkyEthio Travels!', 
  'banner', 
  'promotional', 
  'Learn More', 
  '/about', 
  ARRAY['/'], 
  'new_visitors', 
  2, 
  true, 
  NOW(), 
  NOW() + INTERVAL '90 days'
),
(
  'New Destinations Added!', 
  'Explore Thailand, Canada, and Uganda with our exclusive packages.', 
  'floating', 
  'announcement', 
  'Explore', 
  '/services', 
  ARRAY['/'], 
  'all', 
  4, 
  true, 
  NOW(), 
  NOW() + INTERVAL '45 days'
);

-- Verify the tables were created correctly
SELECT 'Bookings table created successfully' as message;
SELECT 'Visa applications table created successfully' as message;
SELECT 'Contact inquiries table created successfully' as message;
SELECT 'Ads table created successfully' as message;
