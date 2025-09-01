'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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
    <div className="w-full max-w-sm mx-auto space-y-6 p-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-white bg-gradient-to-r from-blue-400 to-indigo-500 
                     bg-clip-text text-transparent mb-2">
          {isLogin ? 'Welcome Back' : 'Create Account'}
        </h1>
        <p className="text-gray-300 text-sm">
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
            className="w-full p-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl 
                     text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 
                     transition-all duration-300"
          />
        </div>

        <div>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl 
                     text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 
                     transition-all duration-300"
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
                className="p-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl 
                         text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 
                         transition-all duration-300"
              />
              <input
                type="text"
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                className="p-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl 
                         text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 
                         transition-all duration-300"
              />
            </div>
            <div>
              <input
                type="text"
                placeholder="University (optional)"
                value={university}
                onChange={(e) => setUniversity(e.target.value)}
                className="w-full p-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl 
                         text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 
                         transition-all duration-300"
              />
            </div>
          </>
        )}

        <button 
          type="submit" 
          disabled={loading}
          className="w-full p-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold 
                   rounded-xl transition-all duration-300 disabled:opacity-50 
                   disabled:cursor-not-allowed"
        >
          {loading ? 'Loading...' : (isLogin ? 'Sign In' : 'Create Account')}
        </button>
      </form>

      <div className="text-center">
        <button
          type="button"
          onClick={() => setIsLogin(!isLogin)}
          className="text-cyan-400 hover:text-cyan-300 text-sm transition-colors duration-300"
        >
          {isLogin
            ? "Don't have an account? Sign up"
            : 'Already have an account? Sign in'}
        </button>
      </div>
    </div>
  )
}