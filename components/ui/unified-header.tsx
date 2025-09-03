'use client'

import { useAuth } from '@/lib/hooks/useAuth'
import UserProfile from '@/components/ui/user-profile'
import Link from 'next/link'
import { ArrowLeft, Bell } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ROUTES } from '@/lib/constants'

interface UnifiedHeaderProps {
  title?: string
  showBackButton?: boolean
  backHref?: string
  showNotifications?: boolean
}

export function UnifiedHeader({ 
  title = 'VolunteerVibe',
  showBackButton = false,
  backHref = ROUTES.HOME,
  showNotifications = false
}: UnifiedHeaderProps) {
  const { user, userType, signOut } = useAuth()

  return (
    <header className="bg-zinc-900 border-b border-zinc-800 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {showBackButton && (
              <Link href={backHref}>
                <Button variant="secondary" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
              </Link>
            )}
            <h1 className="text-xl font-bold text-white md:text-2xl">{title}</h1>
          </div>
          
          <div className="flex items-center gap-4">
            {showNotifications && (
              <button className="relative text-gray-400 hover:text-white transition-colors">
                <Bell className="h-6 w-6" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  0
                </span>
              </button>
            )}
            
            {user && <UserProfile />}
          </div>
        </div>
      </div>
    </header>
  )
}