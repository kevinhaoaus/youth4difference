'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

export default function StudentAuthForm() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [university, setUniversity] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (isLogin) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        
        if (error) throw error
        
        toast.success('Welcome back!')
        
        // Refresh the router to update auth state and redirect
        router.refresh()
        router.push('/dashboard')
      } else {
        // Sign up
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        })

        if (error) throw error

        if (data.user) {
          // Update user type to student
          await supabase
            .from('users')
            .update({ user_type: 'student' })
            .eq('id', data.user.id)

          // Create student profile
          await supabase
            .from('student_profiles')
            .insert({
              user_id: data.user.id,
              first_name: firstName,
              last_name: lastName,
              university: university || null,
            })

          toast.success('Account created successfully!')
          
          // Refresh the router to update auth state and redirect
          router.refresh()
          router.push('/dashboard')
        }
      }
    } catch (error: any) {
      toast.error(error.message || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">
          {isLogin ? 'Welcome Back' : 'Create Account'}
        </h2>
        <p className="text-zinc-400 text-sm">
          {isLogin ? 'Sign in to find events near you' : 'Create your student account'}
        </p>
      </div>

      <form onSubmit={handleAuth} className="space-y-4">
        <div>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-3 bg-zinc-900 border border-zinc-800 rounded 
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
            className="w-full p-3 bg-zinc-900 border border-zinc-800 rounded 
                     text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-white 
                     transition-all"
          />
        </div>

        {!isLogin && (
          <>
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                className="p-3 bg-zinc-900 border border-zinc-800 rounded 
                         text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-white 
                         transition-all"
              />
              <input
                type="text"
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                className="p-3 bg-zinc-900 border border-zinc-800 rounded 
                         text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-white 
                         transition-all"
              />
            </div>
            <div>
              <input
                type="text"
                placeholder="University (optional)"
                value={university}
                onChange={(e) => setUniversity(e.target.value)}
                className="w-full p-3 bg-zinc-900 border border-zinc-800 rounded 
                         text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-white 
                         transition-all"
              />
            </div>
          </>
        )}

        <button 
          type="submit" 
          disabled={loading}
          className="w-full p-3 bg-white text-black font-semibold 
                   rounded transition-opacity hover:opacity-90 disabled:opacity-50 
                   disabled:cursor-not-allowed"
        >
          {loading ? 'Loading...' : (isLogin ? 'Sign In' : 'Create Account')}
        </button>
      </form>

      <div className="text-center">
        <button
          type="button"
          onClick={() => setIsLogin(!isLogin)}
          className="text-zinc-400 hover:text-white text-sm transition-colors"
        >
          {isLogin
            ? "Don't have an account? Sign up"
            : 'Already have an account? Sign in'}
        </button>
      </div>
    </div>
  )
}