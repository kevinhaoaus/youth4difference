export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          user_type: 'student' | 'organization'
          created_at: string
        }
        Insert: {
          id?: string
          email: string
          user_type: 'student' | 'organization'
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          user_type?: 'student' | 'organization'
          created_at?: string
        }
      }
      student_profiles: {
        Row: {
          id: string
          user_id: string
          first_name: string
          last_name: string
          university: string | null
          phone_number: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          first_name: string
          last_name: string
          university?: string | null
          phone_number?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          first_name?: string
          last_name?: string
          university?: string | null
          phone_number?: string | null
          created_at?: string
        }
      }
      organization_profiles: {
        Row: {
          id: string
          user_id: string
          org_name: string
          contact_person_name: string | null
          contact_phone: string | null
          website_url: string | null
          description: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          org_name: string
          contact_person_name?: string | null
          contact_phone?: string | null
          website_url?: string | null
          description?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          org_name?: string
          contact_person_name?: string | null
          contact_phone?: string | null
          website_url?: string | null
          description?: string | null
          created_at?: string
        }
      }
      events: {
        Row: {
          id: string
          org_id: string
          title: string
          description: string | null
          location_address: string
          latitude: number | null
          longitude: number | null
          start_datetime: string
          end_datetime: string
          max_volunteers: number
          social_tags: any[]
          status: string
          created_at: string
        }
        Insert: {
          id?: string
          org_id: string
          title: string
          description?: string | null
          location_address: string
          latitude?: number | null
          longitude?: number | null
          start_datetime: string
          end_datetime: string
          max_volunteers?: number
          social_tags?: any[]
          status?: string
          created_at?: string
        }
        Update: {
          id?: string
          org_id?: string
          title?: string
          description?: string | null
          location_address?: string
          latitude?: number | null
          longitude?: number | null
          start_datetime?: string
          end_datetime?: string
          max_volunteers?: number
          social_tags?: any[]
          status?: string
          created_at?: string
        }
      }
      event_registrations: {
        Row: {
          id: string
          event_id: string
          user_id: string
          registered_at: string
        }
        Insert: {
          id?: string
          event_id: string
          user_id: string
          registered_at?: string
        }
        Update: {
          id?: string
          event_id?: string
          user_id?: string
          registered_at?: string
        }
      }
      user_friendships: {
        Row: {
          id: string
          user_id_1: string
          user_id_2: string
          status: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id_1: string
          user_id_2: string
          status?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id_1?: string
          user_id_2?: string
          status?: string
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_type: 'student' | 'organization'
    }
  }
}