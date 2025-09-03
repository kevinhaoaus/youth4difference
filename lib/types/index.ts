// Centralized type definitions
export interface User {
  id: string
  email: string
  user_type: 'student' | 'organization'
}

export interface Event {
  id: string
  org_id: string
  title: string
  description: string
  short_description?: string
  category?: EventCategory
  volunteer_roles?: string[]
  event_image_url?: string
  location_address: string
  start_datetime: string
  end_datetime: string
  max_volunteers: number
  social_tags?: string[]
  status: 'draft' | 'published' | 'cancelled'
  organization_profiles?: {
    org_name: string
    contact_email?: string
    contact_phone?: string
    logo_url?: string
  }
  _count?: {
    registrations: number
  }
}

export type EventCategory = 
  | 'environment' 
  | 'education' 
  | 'community' 
  | 'health' 
  | 'animals' 
  | 'arts' 
  | 'sports' 
  | 'other'

export interface StudentProfile {
  user_id: string
  full_name: string
  student_id?: string
  university?: string
  phone?: string
  bio?: string
  interests?: string[]
  total_hours: number
}

export interface OrganizationProfile {
  user_id: string
  org_name: string
  contact_person_name?: string
  contact_phone?: string
  contact_email?: string
  website_url?: string
  logo_url?: string
  description?: string
  verification_status: 'pending' | 'verified' | 'rejected'
}

export interface EventRegistration {
  id: string
  event_id: string
  user_id: string
  registration_date: string
  attendance_status: 'registered' | 'attended' | 'cancelled'
  hours_completed?: number
}

// Error type for better error handling
export interface AppError {
  message: string
  code?: string
  details?: unknown
}