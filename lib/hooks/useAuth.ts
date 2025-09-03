'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { User } from '@/lib/types'
import { useRouter } from 'next/navigation'
import { ROUTES } from '@/lib/constants'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [userType, setUserType] = useState<'student' | 'organization' | null>(null)
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { user: authUser } } = await supabase.auth.getUser()
        
        if (authUser) {
          const { data: userData } = await supabase
            .from('users')
            .select('user_type')
            .eq('id', authUser.id)
            .single()

          setUser({
            id: authUser.id,
            email: authUser.email!,
            user_type: userData?.user_type || 'student'
          })
          setUserType(userData?.user_type || 'student')
        }
      } catch (error) {
        console.error('Error checking auth:', error)
      } finally {
        setLoading(false)
      }
    }

    checkUser()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          const { data: userData } = await supabase
            .from('users')
            .select('user_type')
            .eq('id', session.user.id)
            .single()

          setUser({
            id: session.user.id,
            email: session.user.email!,
            user_type: userData?.user_type || 'student'
          })
          setUserType(userData?.user_type || 'student')
        } else {
          setUser(null)
          setUserType(null)
        }
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase])

  const signOut = async () => {
    await supabase.auth.signOut()
    router.push(ROUTES.HOME)
  }

  const redirectToDashboard = () => {
    if (userType === 'organization') {
      router.push(ROUTES.ORG_DASHBOARD)
    } else {
      router.push(ROUTES.DASHBOARD)
    }
  }

  return {
    user,
    userType,
    loading,
    isAuthenticated: !!user,
    isOrganization: userType === 'organization',
    isStudent: userType === 'student',
    signOut,
    redirectToDashboard,
  }
}