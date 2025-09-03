'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Building, LogIn } from 'lucide-react'

export default function OrganizationAuthForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      
      if (error) throw error
      
      // Check user type and redirect appropriately
      if (data.user) {
        const { data: userData, error: userFetchError } = await supabase
          .from('users')
          .select('user_type')
          .eq('id', data.user.id)
          .single()
        
        // If no user record exists, create it as organization
        if (!userData || userFetchError) {
          const { error: insertError } = await supabase
            .from('users')
            .insert({
              id: data.user.id,
              email: data.user.email!,
              user_type: 'organization'
            })
          
          if (insertError && insertError.code !== '23505') {
            console.error('Error creating user record:', insertError)
          }
          
          // Proceed to organization dashboard
          toast.success('Welcome back!')
          router.refresh()
          router.push('/org/dashboard')
          return
        }
        
        // Check if user is a student trying to use org login
        if (userData.user_type === 'student') {
          toast.error('This is an organization login. Please use the student login.')
          await supabase.auth.signOut()
          router.push('/auth/login')
          return
        }
        
        // User is an organization, proceed
        toast.success('Welcome back!')
        router.refresh()
        router.push('/org/dashboard')
      }
    } catch (error: any) {
      toast.error(error.message || 'Invalid email or password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2 flex items-center justify-center gap-2">
          <Building className="h-6 w-6" />
          Organization Login
        </h2>
        <p className="text-zinc-400 text-sm">
          Sign in to manage your events and volunteers
        </p>
      </div>

      <form onSubmit={handleSignIn} className="space-y-4">
        <div>
          <input
            type="email"
            placeholder="Organization Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded 
                     text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-white 
                     transition-all"
          />
        </div>

        <div>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded 
                     text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-white 
                     transition-all"
          />
        </div>

        <div className="flex justify-end">
          <Link href="#" className="text-sm text-zinc-400 hover:text-white transition-colors">
            Forgot password?
          </Link>
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full p-3 bg-white text-black font-semibold 
                   rounded transition-opacity hover:opacity-90 disabled:opacity-50 
                   disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <LogIn className="h-4 w-4" />
          {loading ? 'Signing In...' : 'Sign In'}
        </button>
      </form>

      <div className="space-y-4">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-zinc-800"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-zinc-900 px-2 text-zinc-400">New Organization?</span>
          </div>
        </div>

        <Link href="/auth/org-signup">
          <button className="w-full p-3 bg-transparent border border-zinc-800 text-white font-semibold 
                         rounded hover:bg-zinc-800 transition-colors flex items-center justify-center gap-2">
            <Building className="h-4 w-4" />
            Register Your Organization
          </button>
        </Link>

        <div className="text-center text-sm text-zinc-400">
          Are you a student volunteer?{' '}
          <Link href="/auth/login" className="text-white hover:underline font-semibold">
            Student login here
          </Link>
        </div>
      </div>
    </div>
  )
}