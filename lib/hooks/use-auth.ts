'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { User } from '@supabase/supabase-js'

interface UserProfile {
  id: string
  user_type: 'student' | 'organization'
  profile?: {
    first_name?: string
    last_name?: string
    org_name?: string
  }
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    // Get initial session
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user ?? null)
      
      if (session?.user) {
        await fetchUserProfile(session.user.id)
      }
      
      setLoading(false)
    }

    getSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null)
        
        if (session?.user) {
          await fetchUserProfile(session.user.id)
        } else {
          setUserProfile(null)
        }
        
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const fetchUserProfile = async (userId: string) => {
    try {
      // Get user type
      const { data: userData } = await supabase
        .from('users')
        .select('user_type')
        .eq('id', userId)
        .single()

      if (!userData) return

      let profile: { first_name?: string; last_name?: string; org_name?: string } | undefined = undefined
      
      if (userData.user_type === 'student') {
        const { data: studentProfile } = await supabase
          .from('student_profiles')
          .select('first_name, last_name')
          .eq('user_id', userId)
          .single()
        
        profile = studentProfile || undefined
      } else if (userData.user_type === 'organization') {
        const { data: orgProfile } = await supabase
          .from('organization_profiles')
          .select('org_name')
          .eq('user_id', userId)
          .single()
        
        profile = orgProfile || undefined
      }

      setUserProfile({
        id: userId,
        user_type: userData.user_type,
        profile
      })
    } catch (error) {
      console.error('Error fetching user profile:', error)
    }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  return {
    user,
    userProfile,
    loading,
    signOut,
    isAuthenticated: !!user
  }
}