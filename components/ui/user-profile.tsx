'use client'

import { useAuth } from '@/lib/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { LogOut, User, Building, Edit, ChevronDown } from 'lucide-react'
import Link from 'next/link'
import { useState, useRef, useEffect } from 'react'

export default function UserProfile() {
  const { user, userType, loading, signOut, isAuthenticated, isOrganization } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

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

  const displayName = user?.email?.split('@')[0] || 'User'
  const dashboardLink = isOrganization ? '/org/dashboard' : '/dashboard'

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Profile Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-2 bg-white/10 backdrop-blur-xl rounded-full border border-white/20 hover:bg-white/20 transition-all duration-300 md:px-4 md:py-2 md:rounded-xl"
      >
        <div className="w-6 h-6 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full flex items-center justify-center text-xs text-white font-bold">
          {isOrganization ? (
            <Building className="h-3 w-3" />
          ) : (
            displayName.charAt(0).toUpperCase()
          )}
        </div>
        <span className="hidden md:inline text-white text-sm font-medium">
          {displayName}
        </span>
        <ChevronDown className={`h-3 w-3 text-white transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-zinc-900 border border-zinc-800 rounded-md shadow-lg z-50">
          <div className="px-4 py-3 border-b border-zinc-800">
            <p className="text-sm text-white font-medium">{displayName}</p>
            <p className="text-xs text-zinc-400">{user?.email}</p>
          </div>

          <Link href={dashboardLink}>
            <button
              className="w-full px-4 py-2 text-left text-white hover:bg-zinc-800 transition-colors flex items-center gap-3"
              onClick={() => setIsOpen(false)}
            >
              {isOrganization ? <Building className="h-4 w-4" /> : <User className="h-4 w-4" />}
              Dashboard
            </button>
          </Link>

          <Link href="/profile/edit">
            <button
              className="w-full px-4 py-2 text-left text-white hover:bg-zinc-800 transition-colors flex items-center gap-3"
              onClick={() => setIsOpen(false)}
            >
              <Edit className="h-4 w-4" />
              Edit Profile
            </button>
          </Link>

          <div className="border-t border-zinc-800">
            <button
              onClick={() => {
                setIsOpen(false)
                signOut()
              }}
              className="w-full px-4 py-2 text-left text-red-400 hover:bg-zinc-800 transition-colors flex items-center gap-3"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  )
}