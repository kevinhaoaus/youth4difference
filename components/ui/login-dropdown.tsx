'use client'

import { useState, useRef, useEffect } from 'react'
import { User, Building, ChevronDown, LogIn } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export function LoginDropdown() {
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

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-white text-black hover:bg-zinc-200 flex items-center gap-2"
        size="sm"
      >
        <LogIn className="h-4 w-4" />
        <span className="hidden sm:inline">Login</span>
        <ChevronDown className={`h-3 w-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </Button>
      
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-zinc-900 border border-zinc-800 rounded-md shadow-lg z-50">
          <Link href="/auth/login">
            <button
              className="w-full px-4 py-3 text-left text-white hover:bg-zinc-800 transition-colors flex items-center gap-3 border-b border-zinc-800"
              onClick={() => setIsOpen(false)}
            >
              <User className="h-4 w-4" />
              <div>
                <div className="font-medium">Member Login</div>
                <div className="text-xs text-zinc-400">For volunteers</div>
              </div>
            </button>
          </Link>
          
          <Link href="/auth/org-login">
            <button
              className="w-full px-4 py-3 text-left text-white hover:bg-zinc-800 transition-colors flex items-center gap-3"
              onClick={() => setIsOpen(false)}
            >
              <Building className="h-4 w-4" />
              <div>
                <div className="font-medium">Organization Login</div>
                <div className="text-xs text-zinc-400">For event creators</div>
              </div>
            </button>
          </Link>
        </div>
      )}
    </div>
  )
}