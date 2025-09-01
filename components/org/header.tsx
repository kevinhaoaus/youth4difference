'use client'

import { User } from '@supabase/supabase-js'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { LogOut, Building } from 'lucide-react'

interface OrgHeaderProps {
  user: User
  profile: any
}

export default function OrgHeader({ user, profile }: OrgHeaderProps) {
  const router = useRouter()
  const supabase = createClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <header className="bg-white/5 backdrop-blur-xl border-b border-white/10">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent md:text-3xl">
            VolunteerVibe
          </h1>
          <p className="text-sm text-gray-300 flex items-center gap-2">
            <Building className="h-4 w-4" />
            {profile?.org_name || 'Organization Dashboard'}
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleSignOut}
            className="text-white hover:bg-white/10 border border-white/20 hover:border-white/30"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </div>
    </header>
  )
}