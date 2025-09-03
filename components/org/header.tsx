'use client'

import { User } from '@supabase/supabase-js'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { useRouter, usePathname } from 'next/navigation'
import { LogOut, Building, Calendar, Plus, UserCircle } from 'lucide-react'
import Link from 'next/link'

interface OrgHeaderProps {
  user: User
  profile: any
}

export default function OrgHeader({ user, profile }: OrgHeaderProps) {
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
              <div className="cursor-pointer hover:opacity-80 transition-opacity">
                <h1 className="text-2xl font-bold text-white md:text-3xl">
                  VolunteerVibe
                </h1>
                <p className="text-sm text-zinc-400 flex items-center gap-2">
                  <Building className="h-4 w-4" />
                  {profile?.org_name || 'Organization Dashboard'}
                </p>
              </div>
            </Link>
            
            <nav className="hidden md:flex items-center gap-4">
              <Link href="/org/dashboard">
                <Button 
                  variant={pathname === '/org/dashboard' ? 'secondary' : 'ghost'}
                  size="sm"
                  className={pathname === '/org/dashboard' 
                    ? 'bg-zinc-800 text-white' 
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800'}
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  My Events
                </Button>
              </Link>
              
              <Link href="/org/create-event">
                <Button 
                  variant={pathname === '/org/create-event' ? 'secondary' : 'ghost'}
                  size="sm"
                  className={pathname === '/org/create-event' 
                    ? 'bg-zinc-800 text-white' 
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800'}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Event
                </Button>
              </Link>
            </nav>
          </div>
          
          <div className="flex items-center gap-2">
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
          </div>
        </div>
        
        <nav className="md:hidden mt-4 flex items-center gap-2">
          <Link href="/org/dashboard" className="flex-1">
            <Button 
              variant={pathname === '/org/dashboard' ? 'secondary' : 'ghost'}
              size="sm"
              className={`w-full ${pathname === '/org/dashboard' 
                ? 'bg-zinc-800 text-white' 
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800'}`}
            >
              <Calendar className="h-4 w-4 mr-2" />
              My Events
            </Button>
          </Link>
          
          <Link href="/org/create-event" className="flex-1">
            <Button 
              variant={pathname === '/org/create-event' ? 'secondary' : 'ghost'}
              size="sm"
              className={`w-full ${pathname === '/org/create-event' 
                ? 'bg-zinc-800 text-white' 
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800'}`}
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Event
            </Button>
          </Link>
        </nav>
      </div>
    </header>
  )
}