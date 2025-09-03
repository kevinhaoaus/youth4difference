'use client'

import { User } from '@supabase/supabase-js'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { useRouter, usePathname } from 'next/navigation'
import { LogOut, MapPin, Calendar, Home, UserCircle } from 'lucide-react'
import Link from 'next/link'

interface DashboardHeaderProps {
  user: User
  profile: any
}

export default function DashboardHeader({ user, profile }: DashboardHeaderProps) {
  const router = useRouter()
  const pathname = usePathname()
  const supabase = createClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <header className="bg-zinc-900 border-b border-zinc-800">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-8">
            <Link href="/">
              <h1 className="text-2xl font-bold text-white md:text-3xl hover:text-zinc-300 transition-colors cursor-pointer">
                VolunteerVibe
              </h1>
            </Link>
            <p className="hidden md:block text-sm text-zinc-400">
              Welcome back, {profile?.full_name || profile?.first_name || user?.email?.split('@')[0] || 'User'}
            </p>
          </div>
          
          <nav className="flex items-center gap-2">
            <Link href="/">
              <Button 
                variant="ghost" 
                size="sm"
                className="text-zinc-400 hover:text-white hover:bg-zinc-800"
              >
                <Home className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Home</span>
              </Button>
            </Link>
            
            <Link href="/events">
              <Button 
                variant={pathname === '/events' ? 'secondary' : 'ghost'}
                size="sm"
                className={pathname === '/events' 
                  ? 'bg-zinc-800 text-white' 
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800'}
              >
                <Calendar className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">All Events</span>
              </Button>
            </Link>
            
            <Link href="/profile/edit">
              <Button 
                variant="ghost" 
                size="sm"
                className="text-zinc-400 hover:text-white hover:bg-zinc-800"
              >
                <UserCircle className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Profile</span>
              </Button>
            </Link>
            
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleSignOut}
              className="text-zinc-400 hover:text-white hover:bg-zinc-800"
            >
              <LogOut className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Sign Out</span>
            </Button>
          </nav>
        </div>
        
        <div className="md:hidden mt-2 text-sm text-zinc-400">
          Welcome, {profile?.full_name || profile?.first_name || user?.email?.split('@')[0] || 'User'}
        </div>
      </div>
    </header>
  )
}