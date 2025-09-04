'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Building } from 'lucide-react'
import Link from 'next/link'
import { validate } from '@/lib/utils/validation'
import { MESSAGES } from '@/lib/constants'

export default function OrgSignUpPage() {
  const [formData, setFormData] = useState({
    orgName: '',
    contactName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    website: ''
  })
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate inputs
    if (!validate.required(formData.orgName)) {
      toast.error('Please enter your organization name')
      return
    }

    if (!validate.required(formData.contactName)) {
      toast.error('Please enter the contact person name')
      return
    }

    if (!validate.email(formData.email)) {
      toast.error('Please enter a valid email address')
      return
    }

    if (!validate.password(formData.password)) {
      toast.error('Password must be at least 8 characters')
      return
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    if (formData.phone && !validate.phone(formData.phone)) {
      toast.error('Please enter a valid Australian phone number')
      return
    }

    if (formData.website && !validate.url(formData.website)) {
      toast.error('Please enter a valid website URL')
      return
    }

    setLoading(true)

    try {
      // Sign up the user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            org_name: formData.orgName,
            user_type: 'organization'
          }
        }
      })

      if (authError) throw authError

      if (authData.user) {
        // Use UPSERT to ensure user record has correct type
        const { error: userError } = await supabase
          .from('users')
          .upsert({
            id: authData.user.id,
            email: authData.user.email!,
            user_type: 'organization'
          }, {
            onConflict: 'id'
          })

        if (userError) {
          console.error('Error creating/updating user record:', userError)
        }

        // Create initial organization profile
        const { error: profileError } = await supabase
          .from('organization_profiles')
          .insert({
            user_id: authData.user.id,
            org_name: formData.orgName,
            contact_person_name: formData.contactName,
            contact_email: formData.email,
            contact_phone: formData.phone || null,
            website_url: formData.website || null
          })

        if (profileError && profileError.code !== '23505') {
          console.error('Error creating profile:', profileError)
        }

        toast.success('Organization account created successfully! Please check your email to verify your account.')
        router.push('/auth/org-login')
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
            <span className="text-2xl font-bold">Youth4Difference</span>
          </div>
        </Link>
        <div className="text-sm text-zinc-400">
          Already have an account?{' '}
          <Link href="/auth/org-login" className="text-white hover:underline">
            Sign in
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-zinc-900 rounded-full mb-4">
              <Building className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Register Your Organization
            </h1>
            <p className="text-zinc-400">
              Create events and manage volunteers for your organization
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Organization Name *
              </label>
              <Input
                type="text"
                placeholder="Red Cross Sydney"
                value={formData.orgName}
                onChange={(e) => handleInputChange('orgName', e.target.value)}
                required
                className="w-full p-3 bg-zinc-900 border border-zinc-800 rounded text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-white transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Contact Person Name *
              </label>
              <Input
                type="text"
                placeholder="Jane Smith"
                value={formData.contactName}
                onChange={(e) => handleInputChange('contactName', e.target.value)}
                required
                className="w-full p-3 bg-zinc-900 border border-zinc-800 rounded text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-white transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Organization Email *
              </label>
              <Input
                type="email"
                placeholder="contact@organization.org.au"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                required
                className="w-full p-3 bg-zinc-900 border border-zinc-800 rounded text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-white transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Phone Number <span className="text-zinc-500">(optional)</span>
              </label>
              <Input
                type="tel"
                placeholder="0412 345 678"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="w-full p-3 bg-zinc-900 border border-zinc-800 rounded text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-white transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Website <span className="text-zinc-500">(optional)</span>
              </label>
              <Input
                type="url"
                placeholder="https://www.organization.org.au"
                value={formData.website}
                onChange={(e) => handleInputChange('website', e.target.value)}
                className="w-full p-3 bg-zinc-900 border border-zinc-800 rounded text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-white transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Password *
              </label>
              <Input
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                required
                className="w-full p-3 bg-zinc-900 border border-zinc-800 rounded text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-white transition-all"
              />
              <p className="text-xs text-zinc-500 mt-1">
                Must be at least 8 characters
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Confirm Password *
              </label>
              <Input
                type="password"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                required
                className="w-full p-3 bg-zinc-900 border border-zinc-800 rounded text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-white transition-all"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full p-4 bg-white text-black font-semibold rounded hover:bg-zinc-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating Organization Account...' : 'Create Organization Account'}
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
              Are you a student volunteer?{' '}
              <Link href="/auth/signup" className="text-white hover:underline font-semibold">
                Create a student account instead
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}