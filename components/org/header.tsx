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
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-indigo-600">VolunteerVibe</h1>
          <p className="text-sm text-gray-600 flex items-center gap-2">
            <Building className="h-4 w-4" />
            {profile?.org_name || 'Organization Dashboard'}
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={handleSignOut}>
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </div>
    </header>
  )
}