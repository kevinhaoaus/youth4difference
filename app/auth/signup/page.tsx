'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { ArrowLeft, UserPlus } from 'lucide-react'
import Link from 'next/link'
import { validate } from '@/lib/utils/validation'
import { MESSAGES } from '@/lib/constants'

export default function StudentSignUpPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate inputs
    if (!validate.email(email)) {
      toast.error('Please enter a valid email address')
      return
    }

    if (!validate.required(fullName)) {
      toast.error('Please enter your full name')
      return
    }

    if (!validate.password(password)) {
      toast.error('Password must be at least 8 characters')
      return
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    if (!phoneNumber) {
      toast.error('Phone number is required')
      return
    }

    if (!validate.phone(phoneNumber)) {
      toast.error('Please enter a valid Australian mobile number')
      return
    }

    setLoading(true)

    try {
      // Sign up the user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            user_type: 'student'
          }
        }
      })

      if (authError) throw authError

      if (authData.user) {
        // Create user record with type
        const { error: userError } = await supabase
          .from('users')
          .insert({
            id: authData.user.id,
            email: authData.user.email!,
            user_type: 'student'
          })

        if (userError && userError.code !== '23505') { // Ignore duplicate key error
          console.error('Error creating user record:', userError)
        }

        // Create initial student profile
        const nameParts = fullName.trim().split(' ')
        const firstName = nameParts[0] || ''
        const lastName = nameParts.slice(1).join(' ') || ''

        const { error: profileError } = await supabase
          .from('student_profiles')
          .insert({
            user_id: authData.user.id,
            first_name: firstName,
            last_name: lastName,
            full_name: fullName,
            phone: phoneNumber
          })

        if (profileError && profileError.code !== '23505') {
          console.error('Error creating profile:', profileError)
        }

        toast.success('Account created successfully! Please check your email to verify your account.')
        router.push('/auth/login')
      }
    } catch (error: any) {
      console.error('Signup error:', error)
      toast.error(error.message || 'Failed to create account')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <header className="p-6 flex justify-between items-center border-b border-zinc-900">
        <Link href="/">
          <div className="flex items-center gap-2 text-white hover:text-zinc-300 transition-colors">
            <ArrowLeft className="h-5 w-5" />
            <span className="text-2xl font-bold">VolunteerVibe</span>
          </div>
        </Link>
        <div className="text-sm text-zinc-400">
          Already have an account?{' '}
          <Link href="/auth/login" className="text-white hover:underline">
            Sign in
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-zinc-900 rounded-full mb-4">
              <UserPlus className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Create Student Account
            </h1>
            <p className="text-zinc-400">
              Join our community of volunteers making a difference
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Full Name
              </label>
              <Input
                type="text"
                placeholder="John Doe"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="w-full p-3 bg-zinc-900 border border-zinc-800 rounded text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-white transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Email Address
              </label>
              <Input
                type="email"
                placeholder="john@university.edu.au"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full p-3 bg-zinc-900 border border-zinc-800 rounded text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-white transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Phone Number
              </label>
              <Input
                type="tel"
                placeholder="0412 345 678"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
                className="w-full p-3 bg-zinc-900 border border-zinc-800 rounded text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-white transition-all"
              />
              <p className="text-xs text-zinc-500 mt-1">
                Required for event organizers to contact you
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Password
              </label>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full p-3 bg-zinc-900 border border-zinc-800 rounded text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-white transition-all"
              />
              <p className="text-xs text-zinc-500 mt-1">
                Must be at least 8 characters
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Confirm Password
              </label>
              <Input
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full p-3 bg-zinc-900 border border-zinc-800 rounded text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-white transition-all"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full p-4 bg-white text-black font-semibold rounded hover:bg-zinc-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </Button>

            <div className="text-center text-sm text-zinc-400">
              By signing up, you agree to our{' '}
              <Link href="#" className="text-white hover:underline">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link href="#" className="text-white hover:underline">
                Privacy Policy
              </Link>
            </div>
          </form>

          <div className="mt-8 p-4 bg-zinc-900 rounded border border-zinc-800">
            <p className="text-sm text-zinc-400 text-center">
              Are you an organization?{' '}
              <Link href="/auth/org-signup" className="text-white hover:underline font-semibold">
                Create an organization account instead
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}