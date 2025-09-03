-- Fix database policies to allow public access to events page
-- Run this in your Supabase SQL Editor

-- Update the events policy to allow public access to published events
DROP POLICY IF EXISTS "Anyone can read published events" ON events;
CREATE POLICY "Anyone can read published events" ON events FOR SELECT USING (status = 'published');

-- Update organization profiles to allow public access for event display
DROP POLICY IF EXISTS "Anyone can read org profiles" ON organization_profiles;
CREATE POLICY "Anyone can read org profiles" ON organization_profiles FOR SELECT USING (true);

-- Verify the policies were created
SELECT schemaname, tablename, policyname, cmd, qual 
FROM pg_policies 
WHERE tablename IN ('events', 'organization_profiles') 
ORDER BY tablename, policyname;