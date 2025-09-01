'use client'

import { User } from '@supabase/supabase-js'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { LogOut, MapPin } from 'lucide-react'

interface DashboardHeaderProps {
  user: User
  profile: any
}

export default function DashboardHeader({ user, profile }: DashboardHeaderProps) {
  const router = useRouter()
  const supabase = createClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <>
      {/* Mobile: Status Bar */}
      <div className="md:hidden h-11 bg-black/90 flex justify-between items-center px-5 text-white text-sm font-semibold">
        <span>9:41</span>
        <span>🔋 100%</span>
      </div>
      
      {/* Header */}
      <header className="p-5 pb-3 bg-white/5 backdrop-blur-xl border-b border-white/10 md:bg-white/10">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h1 className="text-white text-2xl font-black bg-gradient-to-r from-pink-400 via-cyan-400 to-blue-400 
                         bg-clip-text text-transparent animate-gradient md:text-3xl">
              VolunteerVibe
            </h1>
            <p className="text-gray-300 text-sm">
              Hey {profile?.first_name || 'there'}! 👋
            </p>
          </div>
          
          <button 
            onClick={handleSignOut}
            className="p-2 bg-white/10 backdrop-blur-xl rounded-full border border-white/20 
                     text-white hover:bg-white/20 transition-all duration-300 md:px-4 md:py-2 md:rounded-xl"
          >
            <LogOut className="h-4 w-4 md:mr-2" />
            <span className="hidden md:inline">Sign Out</span>
          </button>
        </div>
        
        <div className="p-3 bg-white/10 backdrop-blur-xl rounded-full border border-white/20 flex items-center gap-2 text-white">
          <div className="w-5 h-5 bg-gradient-to-r from-pink-400 to-cyan-400 rounded-full flex items-center justify-center text-xs">
            📍
          </div>
          <span className="text-sm">Sydney, 5km radius</span>
        </div>
      </header>
    </>
  )
}