'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { LoginDropdown } from '@/components/ui/login-dropdown'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { User, Building, Calendar, LogOut, UserCircle } from 'lucide-react'

export default function HomePage() {
  const [user, setUser] = useState<any>(null)
  const [userType, setUserType] = useState<'student' | 'organization' | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    checkAuth()
    
    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        checkAuth()
      } else {
        setUser(null)
        setUserType(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const checkAuth = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUser(user)
        
        // Get user type
        const { data: userData } = await supabase
          .from('users')
          .select('user_type')
          .eq('id', user.id)
          .single()
        
        if (userData) {
          setUserType(userData.user_type)
        }
      }
    } catch (error) {
      console.error('Error checking auth:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setUserType(null)
    router.push('/')
  }

  const handleNavigateToDashboard = () => {
    if (userType === 'organization') {
      router.push('/org/dashboard')
    } else {
      router.push('/dashboard')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Mobile View */}
      <div className="md:hidden min-h-screen flex flex-col">
        {/* Clean Mobile Header */}
        <div className="p-4 flex justify-between items-center border-b border-zinc-900">
          <div className="flex items-center gap-2">
            <Image 
              src="/youth4difference-logo.png" 
              alt="Youth4Difference Logo" 
              width={32} 
              height={32} 
              className="rounded-md"
            />
            <h2 className="text-lg font-bold text-white">
              Youth4Difference
            </h2>
          </div>
          {user ? (
            <div className="flex items-center gap-2">
              <Button 
                onClick={handleNavigateToDashboard}
                variant="ghost" 
                size="sm"
                className="text-zinc-400 hover:text-white"
              >
                <UserCircle className="h-4 w-4" />
              </Button>
              <Button 
                onClick={handleSignOut}
                variant="ghost" 
                size="sm"
                className="text-zinc-400 hover:text-white"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <LoginDropdown />
          )}
        </div>

        {/* Mobile Content */}
        <div className="flex-1 flex flex-col justify-center items-center p-6 text-center">
          <div className="flex flex-col items-center mb-4">
            <Image 
              src="/youth4difference-logo.png" 
              alt="Youth4Difference Logo" 
              width={80} 
              height={80} 
              className="rounded-lg mb-4"
            />
            <h1 className="text-white text-4xl font-bold tracking-tight">
              Youth4Difference
            </h1>
          </div>
          <p className="text-zinc-400 text-base mb-12 leading-relaxed max-w-sm">
            Connect with meaningful volunteer opportunities.
            Find events that match your interests.
          </p>
          
          <div className="w-full space-y-3 max-w-xs">
            {user ? (
              <>
                <button 
                  onClick={handleNavigateToDashboard}
                  className="w-full p-4 bg-white text-black font-semibold 
                                 rounded transition-opacity hover:opacity-90">
                  Go to Dashboard
                </button>
                <Link href="/events" className="block">
                  <button className="w-full p-4 bg-transparent border border-zinc-800 text-white font-semibold 
                                   rounded hover:bg-zinc-900 transition-colors">
                    Browse Events
                  </button>
                </Link>
              </>
            ) : (
              <>
                <Link href="/auth/login" className="block">
                  <button className="w-full p-4 bg-white text-black font-semibold 
                                   rounded transition-opacity hover:opacity-90">
                    Student Login
                  </button>
                </Link>
                <Link href="/auth/org-login" className="block">
                  <button className="w-full p-4 bg-transparent border border-zinc-800 text-white font-semibold 
                                   rounded hover:bg-zinc-900 transition-colors">
                    Organization Login
                  </button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Desktop View */}
      <div className="hidden md:block">
        <nav className="p-6 flex justify-between items-center border-b border-zinc-900">
          <div className="flex items-center gap-3">
            <Image 
              src="/youth4difference-logo.png" 
              alt="Youth4Difference Logo" 
              width={40} 
              height={40} 
              className="rounded-md"
            />
            <div className="text-2xl font-bold text-white">
              Youth4Difference
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/events">
              <Button variant="ghost" className="text-zinc-400 hover:text-white hover:bg-zinc-900">Browse Events</Button>
            </Link>
            {user ? (
              <>
                <Button 
                  onClick={handleNavigateToDashboard}
                  variant="ghost" 
                  className="text-zinc-400 hover:text-white hover:bg-zinc-900"
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Dashboard
                </Button>
                <Link href="/profile/edit">
                  <Button variant="ghost" className="text-zinc-400 hover:text-white hover:bg-zinc-900">
                    <UserCircle className="h-4 w-4 mr-2" />
                    Profile
                  </Button>
                </Link>
                <Button 
                  onClick={handleSignOut}
                  className="bg-white text-black hover:bg-zinc-200"
                  size="sm"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </>
            ) : (
              <LoginDropdown />
            )}
          </div>
        </nav>

        <main className="container mx-auto px-6 py-24 max-w-5xl">
          <div className="text-center">
            <h1 className="text-6xl font-bold text-white mb-6 tracking-tight">
              Volunteer with Purpose
            </h1>
            <p className="text-xl text-zinc-400 mb-12 leading-relaxed max-w-2xl mx-auto">
              Discover meaningful volunteer opportunities in your community. 
              Connect with causes that matter to you.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-24">
              {user ? (
                <>
                  <Button 
                    onClick={handleNavigateToDashboard}
                    size="lg" 
                    className="bg-white text-black hover:bg-zinc-200 text-base px-8 py-4 font-semibold"
                  >
                    Go to Dashboard
                  </Button>
                  <Link href="/events">
                    <Button size="lg" variant="outline" className="border-zinc-800 text-white hover:bg-zinc-900 text-base px-8 py-4 font-semibold">
                      Browse Events
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/auth/login">
                    <Button size="lg" className="bg-white text-black hover:bg-zinc-200 text-base px-8 py-4 font-semibold">
                      Get Started
                    </Button>
                  </Link>
                  <Link href="/auth/org-login">
                    <Button size="lg" variant="outline" className="border-zinc-800 text-white hover:bg-zinc-900 text-base px-8 py-4 font-semibold">
                      For Organizations
                    </Button>
                  </Link>
                </>
              )}
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center p-8 bg-zinc-900 rounded border border-zinc-800">
                <div className="w-12 h-12 bg-zinc-800 rounded flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2 text-white">Find Local Events</h3>
                <p className="text-zinc-400 text-sm">Discover volunteer opportunities in your area</p>
              </div>
              <div className="text-center p-8 bg-zinc-900 rounded border border-zinc-800">
                <div className="w-12 h-12 bg-zinc-800 rounded flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13.5 7a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2 text-white">Build Community</h3>
                <p className="text-zinc-400 text-sm">Connect with like-minded volunteers</p>
              </div>
              <div className="text-center p-8 bg-zinc-900 rounded border border-zinc-800">
                <div className="w-12 h-12 bg-zinc-800 rounded flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2 text-white">Make an Impact</h3>
                <p className="text-zinc-400 text-sm">Create positive change in your community</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}