'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

export default function OrganizationAuthForm() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [orgName, setOrgName] = useState('')
  const [contactName, setContactName] = useState('')
  const [contactPhone, setContactPhone] = useState('')
  const [website, setWebsite] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        
        if (error) throw error
        
        toast.success('Welcome back!')
        setTimeout(() => {
          window.location.href = '/org/dashboard'
        }, 1000)
      } else {
        // Sign up
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        })

        if (error) {
          console.error('Signup error:', error)
          throw error
        }

        if (data.user) {
          // Update user type to organization
          const { error: updateError } = await supabase
            .from('users')
            .update({ user_type: 'organization' })
            .eq('id', data.user.id)

          if (updateError) {
            console.error('Error updating user type:', updateError)
            // Continue anyway as this might be expected
          }

          // Create organization profile
          const { error: profileError } = await supabase
            .from('organization_profiles')
            .insert({
              user_id: data.user.id,
              org_name: orgName,
              contact_person_name: contactName || null,
              contact_phone: contactPhone || null,
              website_url: website || null,
              description: description || null,
              contact_email: email, // Add the email field
            })

          if (profileError) {
            console.error('Error creating organization profile:', profileError)
            throw profileError
          }

          toast.success('Organization account created successfully!')
          setTimeout(() => {
            window.location.href = '/org/dashboard'
          }, 1000)
        }
      }
    } catch (error: any) {
      toast.error(error.message || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold">
          {isLogin ? 'Organization Login' : 'Register Your Organization'}
        </h1>
        <p className="text-gray-600 mt-2">
          {isLogin ? 'Access your organization dashboard' : 'Create events and find volunteers'}
        </p>
      </div>

      <form onSubmit={handleAuth} className="space-y-4">
        <div>
          <Input
            type="email"
            placeholder="Organization Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {!isLogin && (
          <>
            <div>
              <Input
                type="text"
                placeholder="Organization Name"
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                required
              />
            </div>
            <div>
              <Input
                type="text"
                placeholder="Contact Person Name"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
              />
            </div>
            <div>
              <Input
                type="tel"
                placeholder="Contact Phone"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
              />
            </div>
            <div>
              <Input
                type="url"
                placeholder="Website URL (optional)"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
              />
            </div>
            <div>
              <textarea
                className="w-full p-3 border rounded-md"
                placeholder="Brief description of your organization"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>
          </>
        )}

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Loading...' : (isLogin ? 'Sign In' : 'Create Organization')}
        </Button>
      </form>

      <div className="text-center">
        <button
          type="button"
          onClick={() => setIsLogin(!isLogin)}
          className="text-blue-600 hover:text-blue-800 text-sm"
        >
          {isLogin
            ? "Don't have an organization account? Register"
            : 'Already have an organization account? Sign in'}
        </button>
      </div>
    </div>
  )
}