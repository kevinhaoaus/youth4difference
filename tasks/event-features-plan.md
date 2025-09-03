# Event Features Implementation Plan

## Current Event Structure Analysis

### Currently Implemented Fields:
✅ **Date & Time**: `start_datetime`, `end_datetime` (stored as timestamps)
✅ **Location**: `location_address` (text field)
✅ **Description**: `description` (unlimited text)
✅ **Organization Name**: Available through `organization_profiles` table join
✅ **Social Tags**: `social_tags` (JSONB array) - used as informal categories

### Currently Missing Fields:
❌ **Category**: No formal category field (only social_tags)
❌ **Volunteer Roles Needed**: Not implemented
❌ **Description Character Limit**: No 500 char limit enforced
❌ **Organization Contact Details**: Stored in org profile but not displayed on events
❌ **Event Images**: No image support
❌ **Organization Logo**: No logo support

## Implementation Plan

### Phase 1: Database Schema Updates

#### 1.1 Update Events Table
```sql
ALTER TABLE events 
ADD COLUMN category TEXT,
ADD COLUMN volunteer_roles JSONB DEFAULT '[]',
ADD COLUMN event_image_url TEXT,
ADD COLUMN short_description TEXT CHECK (char_length(short_description) <= 500);

-- Add category constraint
ALTER TABLE events 
ADD CONSTRAINT valid_category CHECK (
  category IN ('environment', 'education', 'community', 'health', 'animals', 'arts', 'sports', 'other')
);
```

#### 1.2 Update Organization Profiles Table
```sql
ALTER TABLE organization_profiles
ADD COLUMN logo_url TEXT,
ADD COLUMN contact_email TEXT;
```

### Phase 2: Frontend Updates

#### 2.1 Create Event Form Updates (`/app/org/create-event/page.tsx`)
- [ ] Add category dropdown with predefined options
- [ ] Add volunteer roles field (dynamic list)
- [ ] Add short description field with 500 char counter
- [ ] Add image upload for event image
- [ ] Auto-populate organization contact from profile

#### 2.2 Event Display Updates (`/components/ui/event-card.tsx`)
- [ ] Display category badge
- [ ] Show volunteer roles needed
- [ ] Display organization logo
- [ ] Show contact details (email, phone)
- [ ] Display event image if available

#### 2.3 Organization Dashboard Updates (`/app/org/dashboard/page.tsx`)
- [ ] Display all event details in list view
- [ ] Add organization logo upload
- [ ] Update contact details form

### Phase 3: Image Upload Implementation

#### 3.1 Supabase Storage Setup
```sql
-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) 
VALUES 
  ('event-images', 'event-images', true),
  ('org-logos', 'org-logos', true);

-- Set up storage policies
CREATE POLICY "Public can view images" ON storage.objects 
FOR SELECT USING (bucket_id IN ('event-images', 'org-logos'));

CREATE POLICY "Orgs can upload images" ON storage.objects 
FOR INSERT WITH CHECK (
  auth.uid() IS NOT NULL AND 
  bucket_id IN ('event-images', 'org-logos')
);
```

#### 3.2 Image Upload Components
- [ ] Create reusable ImageUpload component
- [ ] Add image preview functionality
- [ ] Implement file size and type validation

### Phase 4: UI/UX Improvements

#### 4.1 Event Categories
- Environment 🌱
- Education 📚
- Community 🏘️
- Health ❤️
- Animals 🐾
- Arts 🎨
- Sports ⚽
- Other 📌

#### 4.2 Volunteer Roles Examples
- Event Setup
- Registration Desk
- Activity Leader
- Photography
- Clean-up Crew
- Food Service
- First Aid
- Social Media
- Transport Helper

### Phase 5: Backend API Updates

#### 5.1 Update Event Creation
- [ ] Handle new fields in create event API
- [ ] Validate category selection
- [ ] Process image uploads
- [ ] Auto-fill org contact details

#### 5.2 Update Event Fetching
- [ ] Include all new fields in queries
- [ ] Join with org profiles for contact details
- [ ] Return image URLs

## Implementation Order

1. **Database Migration** (Priority: High)
   - Create migration file with new columns
   - Update RLS policies if needed
   - Test with sample data

2. **Backend Updates** (Priority: High)
   - Update Supabase queries
   - Add validation logic
   - Handle image uploads

3. **Create Event Form** (Priority: High)
   - Add new input fields
   - Implement validation
   - Add image upload

4. **Event Display** (Priority: Medium)
   - Update event cards
   - Show new information
   - Display images

5. **Organization Features** (Priority: Medium)
   - Logo upload
   - Contact details management
   - Enhanced dashboard

## Technical Considerations

### Image Storage
- Use Supabase Storage for images
- Limit file size to 5MB
- Accept formats: JPG, PNG, WebP
- Implement image optimization

### Data Validation
- Category must be from predefined list
- Short description max 500 chars
- Volunteer roles as array of strings
- Contact email format validation

### Performance
- Lazy load images
- Cache organization logos
- Optimize database queries
- Use proper indexes

## Migration Strategy

1. Create new columns as nullable first
2. Backfill existing data where possible
3. Update frontend gradually
4. Make fields required after testing

## Testing Requirements

- [ ] Test image upload with various file types
- [ ] Verify character limit on description
- [ ] Test category filtering
- [ ] Validate contact details display
- [ ] Check responsive design with images
- [ ] Test volunteer roles display

## Success Metrics

- All events have categories
- 80% of events include volunteer roles
- Organization logos displayed
- Contact details easily accessible
- Image loading performance < 2s

## Timeline Estimate

- Phase 1 (Database): 2 hours
- Phase 2 (Frontend): 4 hours
- Phase 3 (Images): 3 hours
- Phase 4 (UI/UX): 2 hours
- Phase 5 (Backend): 2 hours
- Testing: 2 hours

**Total: ~15 hours**