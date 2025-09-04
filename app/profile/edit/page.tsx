'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Save, User } from 'lucide-react'
import Link from 'next/link'
import { validate } from '@/lib/utils/validation'
import { MESSAGES } from '@/lib/constants'
import { ImageUpload } from '@/components/ui/image-upload'

export default function EditProfilePage() {
  const [loading, setLoading] = useState(false)
  const [userType, setUserType] = useState<'student' | 'organization' | null>(null)
  const [formData, setFormData] = useState({
    // Student fields
    full_name: '',
    email: '',
    student_id: '',
    university: '',
    phone: '',
    bio: '',
    interests: '',
    // Organization fields
    org_name: '',
    contact_person_name: '',
    contact_phone: '',
    contact_email: '',
    website_url: '',
    logo_url: '',
    description: '',
  })
  
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/auth/login')
        return
      }

      // Get user type
      const { data: userData } = await supabase
        .from('users')
        .select('user_type')
        .eq('id', user.id)
        .single()

      if (userData) {
        setUserType(userData.user_type)

        if (userData.user_type === 'student') {
          // Load student profile
          const { data: profile } = await supabase
            .from('student_profiles')
            .select('*')
            .eq('user_id', user.id)
            .single()

          if (profile) {
            // Handle both old (first_name/last_name) and new (full_name) schema
            const fullName = profile.full_name || 
                           (profile.first_name && profile.last_name ? 
                            `${profile.first_name} ${profile.last_name}`.trim() : 
                            profile.first_name || profile.last_name || '')
            
            setFormData({
              ...formData,
              full_name: fullName,
              email: user.email || '',
              student_id: profile.student_id || '',
              university: profile.university || '',
              phone: profile.phone || '',
              bio: profile.bio || '',
              interests: profile.interests?.join(', ') || '',
            })
          }
        } else if (userData.user_type === 'organization') {
          // Load organization profile
          const { data: profile } = await supabase
            .from('organization_profiles')
            .select('*')
            .eq('user_id', user.id)
            .single()

          if (profile) {
            setFormData({
              ...formData,
              org_name: profile.org_name || '',
              contact_person_name: profile.contact_person_name || '',
              contact_phone: profile.contact_phone || '',
              contact_email: profile.contact_email || '',
              website_url: profile.website_url || '',
              logo_url: profile.logo_url || '',
              description: profile.description || '',
            })
          }
        }
      }
    } catch (error) {
      console.error('Error loading profile:', error)
      toast.error('Failed to load profile')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error(MESSAGES.ERROR.NOT_AUTHENTICATED)

      if (userType === 'student') {
        // Validate required fields
        if (!formData.full_name) {
          toast.error('Full name is required')
          setLoading(false)
          return
        }

        if (!formData.phone) {
          toast.error('Phone number is required for event organizers to contact you')
          setLoading(false)
          return
        }

        // Validate phone format
        if (!validate.phone(formData.phone)) {
          toast.error('Please enter a valid Australian mobile number')
          setLoading(false)
          return
        }

        const interestsArray = formData.interests
          .split(',')
          .map(i => i.trim())
          .filter(i => i.length > 0)

        // Split full name into first and last name for backward compatibility
        const nameParts = formData.full_name.trim().split(' ')
        const firstName = nameParts[0] || ''
        const lastName = nameParts.slice(1).join(' ') || ''

        const { error } = await supabase
          .from('student_profiles')
          .upsert({
            user_id: user.id,
            first_name: validate.sanitizeInput(firstName),
            last_name: validate.sanitizeInput(lastName),
            full_name: validate.sanitizeInput(formData.full_name),
            student_id: validate.sanitizeInput(formData.student_id),
            university: validate.sanitizeInput(formData.university),
            phone: formData.phone,
            bio: validate.sanitizeInput(formData.bio),
            interests: interestsArray,
          })

        if (error) throw error
      } else if (userType === 'organization') {
        // Validate fields
        if (formData.contact_phone && !validate.phone(formData.contact_phone)) {
          toast.error('Please enter a valid Australian mobile number')
          setLoading(false)
          return
        }

        if (formData.website_url && !validate.url(formData.website_url)) {
          toast.error('Please enter a valid website URL')
          setLoading(false)
          return
        }

        if (formData.contact_email && !validate.email(formData.contact_email)) {
          toast.error('Please enter a valid email address')
          setLoading(false)
          return
        }

        const { error } = await supabase
          .from('organization_profiles')
          .upsert({
            user_id: user.id,
            org_name: validate.sanitizeInput(formData.org_name),
            contact_person_name: validate.sanitizeInput(formData.contact_person_name),
            contact_phone: formData.contact_phone,
            contact_email: formData.contact_email,
            website_url: formData.website_url,
            logo_url: formData.logo_url,
            description: validate.sanitizeInput(formData.description),
          })

        if (error) throw error
      }

      toast.success('Profile updated successfully!')
      router.push(userType === 'organization' ? '/org/dashboard' : '/dashboard')
    } catch (error: any) {
      toast.error(error.message || 'Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  if (!userType) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black">
      <header className="bg-zinc-900 border-b border-zinc-800">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Link href={userType === 'organization' ? '/org/dashboard' : '/dashboard'}>
            <Button variant="secondary" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-white md:text-3xl">
            Edit Profile
          </h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <form onSubmit={handleSubmit} className="bg-zinc-900 rounded border border-zinc-800 p-6 space-y-6">
            {userType === 'student' ? (
              <>
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    value={formData.full_name}
                    onChange={(e) => handleInputChange('full_name', e.target.value)}
                    required
                    className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-white transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    placeholder="john@university.edu.au"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    required
                    disabled
                    className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-white transition-all opacity-50 cursor-not-allowed"
                  />
                  <p className="text-xs text-zinc-500 mt-1">
                    Email cannot be changed
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Student ID
                  </label>
                  <input
                    type="text"
                    placeholder="z1234567"
                    value={formData.student_id}
                    onChange={(e) => handleInputChange('student_id', e.target.value)}
                    className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-white transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    University
                  </label>
                  <input
                    type="text"
                    placeholder="University of Sydney"
                    value={formData.university}
                    onChange={(e) => handleInputChange('university', e.target.value)}
                    className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-white transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    placeholder="0412 345 678"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    required
                    className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-white transition-all"
                  />
                  <p className="text-xs text-zinc-500 mt-1">
                    Required for event organizers to contact you
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Bio
                  </label>
                  <textarea
                    placeholder="Tell us about yourself..."
                    value={formData.bio}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    rows={4}
                    className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-white transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Interests <span className="text-zinc-500">(comma separated)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Environment, Education, Community"
                    value={formData.interests}
                    onChange={(e) => handleInputChange('interests', e.target.value)}
                    className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-white transition-all"
                  />
                </div>
              </>
            ) : (
              <>
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Organization Name *
                  </label>
                  <input
                    type="text"
                    placeholder="Red Cross Sydney"
                    value={formData.org_name}
                    onChange={(e) => handleInputChange('org_name', e.target.value)}
                    required
                    className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-white transition-all"
                  />
                </div>

                <ImageUpload
                  currentImageUrl={formData.logo_url}
                  onUpload={(url) => handleInputChange('logo_url', url)}
                  onError={(error) => toast.error(error)}
                  bucket="organization-logos"
                  filePrefix="org-logo"
                  label="Organization Logo"
                />

                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Contact Person Name
                  </label>
                  <input
                    type="text"
                    placeholder="Jane Smith"
                    value={formData.contact_person_name}
                    onChange={(e) => handleInputChange('contact_person_name', e.target.value)}
                    className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-white transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Contact Phone
                  </label>
                  <input
                    type="tel"
                    placeholder="0412 345 678"
                    value={formData.contact_phone}
                    onChange={(e) => handleInputChange('contact_phone', e.target.value)}
                    className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-white transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Contact Email
                  </label>
                  <input
                    type="email"
                    placeholder="contact@organization.org.au"
                    value={formData.contact_email}
                    onChange={(e) => handleInputChange('contact_email', e.target.value)}
                    className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-white transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Website URL
                  </label>
                  <input
                    type="url"
                    placeholder="https://www.organization.org.au"
                    value={formData.website_url}
                    onChange={(e) => handleInputChange('website_url', e.target.value)}
                    className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-white transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Organization Description
                  </label>
                  <textarea
                    placeholder="Tell us about your organization..."
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    rows={4}
                    className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-white transition-all"
                  />
                </div>
              </>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className="w-full p-4 bg-white text-black font-semibold rounded hover:bg-zinc-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Save className="h-4 w-4" />
              {loading ? 'Saving...' : 'Save Profile'}
            </button>
          </form>
        </div>
      </main>
    </div>
  )
}