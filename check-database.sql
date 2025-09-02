-- Quick Database Check Script
-- Run this to verify your database is set up correctly

-- Check if all tables exist
SELECT 
  CASE 
    WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'ads') 
    THEN '✅ Ads table exists'
    ELSE '❌ Ads table missing'
  END as ads_status;

SELECT 
  CASE 
    WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'bookings') 
    THEN '✅ Bookings table exists'
    ELSE '❌ Bookings table missing'
  END as bookings_status;

SELECT 
  CASE 
    WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'visa_applications') 
    THEN '✅ Visa applications table exists'
    ELSE '❌ Visa applications table missing'
  END as visa_status;

-- Check if ads table has the right structure
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'ads' 
ORDER BY ordinal_position;

-- Check if there are any ads in the table
SELECT COUNT(*) as total_ads FROM ads;

-- Check if RLS is enabled
SELECT 
  schemaname, 
  tablename, 
  rowsecurity as rls_enabled
FROM pg_tables 
WHERE tablename IN ('ads', 'bookings', 'visa_applications', 'contact_inquiries');

-- Test inserting a sample ad (will fail if table structure is wrong)
INSERT INTO ads (
  title, description, ad_type, content_type, cta_text, cta_url, 
  target_pages, target_audience, priority, is_active
) VALUES (
  'Test Ad', 'This is a test ad', 'popup', 'promotional', 'Test', '/', 
  ARRAY['/'], 'all', 1, true
) ON CONFLICT DO NOTHING;

-- Clean up test ad
DELETE FROM ads WHERE title = 'Test Ad';

SELECT 'Database check completed!' as message;
