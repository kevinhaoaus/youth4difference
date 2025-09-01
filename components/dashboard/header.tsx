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
      {/* Status Bar */}
      <div className="h-11 bg-black/90 flex justify-between items-center px-5 text-white text-sm font-semibold">
        <span>9:41</span>
        <span>🔋 100%</span>
      </div>
      
      {/* Header */}
      <header className="p-5 pb-3 bg-white/5 backdrop-blur-xl border-b border-white/10">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h1 className="text-white text-2xl font-black bg-gradient-to-r from-pink-400 via-cyan-400 to-blue-400 
                         bg-clip-text text-transparent animate-gradient">
              VolunteerVibe
            </h1>
            <p className="text-gray-300 text-sm">
              Hey {profile?.first_name || 'there'}! 👋
            </p>
          </div>
          
          <button 
            onClick={handleSignOut}
            className="p-2 bg-white/10 backdrop-blur-xl rounded-full border border-white/20 
                     text-white hover:bg-white/20 transition-all duration-300"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
        
        <div className="p-3 bg-white/10 backdrop-blur-xl rounded-full border border-white/20 flex items-center gap-2 text-white">
          <div className="w-5 h-5 bg-gradient-to-r from-pink-400 to-cyan-400 rounded-full flex items-center justify-center text-xs">
            📍
          </div>
          <span className="text-sm">Sydney, 5km radius</span>
        </div>
        
        {/* Friend Activity */}
        <div className="mt-4">
          <h3 className="text-white text-sm font-semibold mb-2 flex items-center gap-2">
            👥 Friend Activity
          </h3>
          <div className="flex gap-2 overflow-x-auto pb-2">
            <div className="flex items-center gap-2 px-3 py-2 bg-white/10 backdrop-blur-xl 
                           rounded-full border border-white/20 text-white text-xs whitespace-nowrap">
              <div className="w-4 h-4 bg-gradient-to-r from-pink-400 to-cyan-400 rounded-full"></div>
              Emma going
            </div>
            <div className="flex items-center gap-2 px-3 py-2 bg-white/10 backdrop-blur-xl 
                           rounded-full border border-white/20 text-white text-xs whitespace-nowrap">
              <div className="w-4 h-4 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full"></div>
              Jake signed up
            </div>
            <div className="flex items-center gap-2 px-3 py-2 bg-white/10 backdrop-blur-xl 
                           rounded-full border border-white/20 text-white text-xs whitespace-nowrap">
              <div className="w-4 h-4 bg-gradient-to-r from-green-400 to-teal-400 rounded-full"></div>
              +3 friends nearby
            </div>
          </div>
        </div>
      </header>
    </>
  )
}