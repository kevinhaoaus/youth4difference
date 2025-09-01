'use client'

import { useAuth } from '@/lib/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { LogOut, User, Building } from 'lucide-react'
import Link from 'next/link'

export default function UserProfile() {
  const { user, userProfile, loading, signOut, isAuthenticated } = useAuth()

  if (loading) {
    return (
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-white/10 rounded-full animate-pulse"></div>
        <div className="hidden md:block">
          <div className="h-4 w-16 bg-white/10 rounded animate-pulse"></div>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="flex items-center gap-2">
        <Link href="/auth/login">
          <Button variant="ghost" size="sm" className="text-white hover:bg-white/10 border border-white/20 hover:border-white/30">
            <User className="h-4 w-4 md:mr-2" />
            <span className="hidden md:inline">Sign In</span>
          </Button>
        </Link>
      </div>
    )
  }

  const displayName = userProfile?.profile?.first_name 
    ? `${userProfile.profile.first_name} ${userProfile.profile.last_name || ''}`.trim()
    : userProfile?.profile?.org_name 
    ? userProfile.profile.org_name
    : user?.email?.split('@')[0] || 'User'

  const dashboardLink = userProfile?.user_type === 'organization' ? '/org/dashboard' : '/dashboard'

  return (
    <div className="flex items-center gap-2">
      {/* Profile Info */}
      <Link href={dashboardLink}>
        <div className="flex items-center gap-2 p-2 bg-white/10 backdrop-blur-xl rounded-full border border-white/20 hover:bg-white/20 transition-all duration-300 md:px-4 md:py-2 md:rounded-xl">
          <div className="w-6 h-6 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full flex items-center justify-center text-xs text-white font-bold">
            {userProfile?.user_type === 'organization' ? (
              <Building className="h-3 w-3" />
            ) : (
              displayName.charAt(0).toUpperCase()
            )}
          </div>
          <span className="hidden md:inline text-white text-sm font-medium">
            {displayName}
          </span>
        </div>
      </Link>

      {/* Sign Out */}
      <button 
        onClick={signOut}
        className="p-2 bg-white/10 backdrop-blur-xl rounded-full border border-white/20 text-white hover:bg-white/20 transition-all duration-300 md:px-3 md:py-2 md:rounded-xl"
      >
        <LogOut className="h-4 w-4" />
        <span className="hidden md:ml-2 md:inline text-sm">Sign Out</span>
      </button>
    </div>
  )
}