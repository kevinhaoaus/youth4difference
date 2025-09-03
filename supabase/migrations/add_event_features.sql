-- Add new fields to events table
ALTER TABLE events 
ADD COLUMN IF NOT EXISTS category TEXT,
ADD COLUMN IF NOT EXISTS volunteer_roles JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS event_image_url TEXT,
ADD COLUMN IF NOT EXISTS short_description TEXT;

-- Add category constraint
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'valid_category'
    ) THEN
        ALTER TABLE events 
        ADD CONSTRAINT valid_category CHECK (
            category IS NULL OR category IN (
                'environment', 'education', 'community', 
                'health', 'animals', 'arts', 'sports', 'other'
            )
        );
    END IF;
END $$;

-- Add character limit constraint for short description
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'short_description_length'
    ) THEN
        ALTER TABLE events 
        ADD CONSTRAINT short_description_length CHECK (
            short_description IS NULL OR char_length(short_description) <= 500
        );
    END IF;
END $$;

-- Add new fields to organization_profiles table
ALTER TABLE organization_profiles
ADD COLUMN IF NOT EXISTS logo_url TEXT,
ADD COLUMN IF NOT EXISTS contact_email TEXT;

-- Create storage buckets for images (run in Supabase dashboard)
-- Note: These commands should be run in the Supabase dashboard as they require storage admin access
/*
INSERT INTO storage.buckets (id, name, public) 
VALUES 
  ('event-images', 'event-images', true),
  ('org-logos', 'org-logos', true)
ON CONFLICT (id) DO NOTHING;

-- Set up storage policies
CREATE POLICY "Public can view images" ON storage.objects 
FOR SELECT USING (bucket_id IN ('event-images', 'org-logos'));

CREATE POLICY "Orgs can upload images" ON storage.objects 
FOR INSERT WITH CHECK (
  auth.uid() IS NOT NULL AND 
  bucket_id IN ('event-images', 'org-logos')
);

CREATE POLICY "Orgs can update own images" ON storage.objects 
FOR UPDATE USING (
  auth.uid() IS NOT NULL AND 
  bucket_id IN ('event-images', 'org-logos')
);

CREATE POLICY "Orgs can delete own images" ON storage.objects 
FOR DELETE USING (
  auth.uid() IS NOT NULL AND 
  bucket_id IN ('event-images', 'org-logos')
);
*/

-- Update existing events with default category if needed
UPDATE events 
SET category = 'community' 
WHERE category IS NULL;

-- Sample volunteer roles for reference (not inserted, just documentation)
-- Common volunteer roles:
-- 'Event Setup', 'Registration Desk', 'Activity Leader', 
-- 'Photography', 'Clean-up Crew', 'Food Service', 
-- 'First Aid', 'Social Media', 'Transport Helper'