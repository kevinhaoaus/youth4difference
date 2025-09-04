'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'
import { validate } from '@/lib/utils/validation'
import { MESSAGES } from '@/lib/constants'
import OrgHeader from '@/components/org/header'
import { ImageUpload } from '@/components/ui/image-upload'

interface EventFormData {
  title: string
  description: string
  short_description: string
  category: string
  location_address: string
  start_datetime: string
  end_datetime: string
  max_volunteers: number
  volunteer_roles: string
  social_tags: string
  event_image_url: string
  status: string
}

export default function EditEventPage() {
  const params = useParams()
  const router = useRouter()
  const eventId = params.id as string
  const supabase = createClient()
  
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [charCount, setCharCount] = useState(0)
  const [formData, setFormData] = useState<EventFormData>({
    title: '',
    description: '',
    short_description: '',
    category: 'community',
    location_address: '',
    start_datetime: '',
    end_datetime: '',
    max_volunteers: 10,
    volunteer_roles: '',
    social_tags: '',
    event_image_url: '',
    status: 'published'
  })

  useEffect(() => {
    const loadEventAndUser = async () => {
      try {
        // Get user
        const { data: { user }, error: userError } = await supabase.auth.getUser()
        if (userError || !user) {
          router.push('/auth/org-login')
          return
        }
        setUser(user)

        // Get profile
        const { data: profileData } = await supabase
          .from('organization_profiles')
          .select('*')
          .eq('user_id', user.id)
          .single()
        setProfile(profileData)

        // Get event data
        const { data: eventData, error: eventError } = await supabase
          .from('events')
          .select('*')
          .eq('id', eventId)
          .eq('org_id', user.id)
          .single()

        if (eventError || !eventData) {
          toast.error('Event not found or you do not have permission to edit it')
          router.push('/org/dashboard')
          return
        }

        // Format dates for input fields
        const startDate = new Date(eventData.start_datetime)
        const endDate = new Date(eventData.end_datetime)
        
        setFormData({
          title: eventData.title || '',
          description: eventData.description || '',
          short_description: eventData.short_description || '',
          category: eventData.category || 'community',
          location_address: eventData.location_address || '',
          start_datetime: startDate.toISOString().slice(0, 16),
          end_datetime: endDate.toISOString().slice(0, 16),
          max_volunteers: eventData.max_volunteers || 10,
          volunteer_roles: eventData.volunteer_roles?.join(', ') || '',
          social_tags: eventData.social_tags?.join(', ') || '',
          event_image_url: eventData.event_image_url || '',
          status: eventData.status || 'published'
        })
        
        setCharCount(eventData.short_description?.length || 0)
      } catch (error) {
        console.error('Error loading event:', error)
        toast.error('Failed to load event')
        router.push('/org/dashboard')
      } finally {
        setFetching(false)
      }
    }

    loadEventAndUser()
  }, [eventId, router, supabase])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate required fields
    if (!validate.required(formData.title)) {
      toast.error('Event title is required')
      return
    }
    
    if (!validate.required(formData.short_description)) {
      toast.error('Short description is required')
      return
    }
    
    if (!validate.required(formData.location_address)) {
      toast.error('Location is required')
      return
    }
    
    if (!validate.required(formData.start_datetime)) {
      toast.error('Start date & time is required')
      return
    }
    
    if (!validate.required(formData.end_datetime)) {
      toast.error('End date & time is required')
      return
    }
    
    // Validate dates
    if (new Date(formData.start_datetime) >= new Date(formData.end_datetime)) {
      toast.error('End time must be after start time')
      return
    }
    
    setLoading(true)

    try {
      const tagsArray = formData.social_tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0)
      
      const rolesArray = formData.volunteer_roles
        .split(',')
        .map(role => role.trim())
        .filter(role => role.length > 0)

      const { error } = await supabase
        .from('events')
        .update({
          title: validate.sanitizeInput(formData.title),
          description: validate.sanitizeInput(formData.description),
          short_description: validate.sanitizeInput(formData.short_description),
          category: formData.category,
          location_address: validate.sanitizeInput(formData.location_address),
          start_datetime: formData.start_datetime,
          end_datetime: formData.end_datetime,
          max_volunteers: formData.max_volunteers,
          volunteer_roles: rolesArray.map(role => validate.sanitizeInput(role)),
          social_tags: tagsArray.map(tag => validate.sanitizeInput(tag)),
          event_image_url: formData.event_image_url,
          status: formData.status,
        })
        .eq('id', eventId)
        .eq('org_id', user.id)

      if (error) throw error

      toast.success('Event updated successfully!')
      router.push('/org/dashboard')
    } catch (error: any) {
      toast.error(error.message || 'Failed to update event')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  if (fetching) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black">
      <OrgHeader user={user} profile={profile} />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <Link href="/org/dashboard">
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-white">Edit Event</h1>
          </div>

          <form onSubmit={handleSubmit} className="bg-zinc-900 rounded border border-zinc-800 p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Event Title *
              </label>
              <input
                type="text"
                placeholder="e.g., Beach Cleanup at Bondi"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                required
                className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-white transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => handleInputChange('status', e.target.value)}
                className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded text-white focus:outline-none focus:ring-2 focus:ring-white transition-all"
              >
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                required
                className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded text-white focus:outline-none focus:ring-2 focus:ring-white transition-all"
              >
                <option value="environment">🌱 Environment</option>
                <option value="education">📚 Education</option>
                <option value="community">🏘️ Community</option>
                <option value="health">❤️ Health</option>
                <option value="animals">🐾 Animals</option>
                <option value="arts">🎨 Arts</option>
                <option value="sports">⚽ Sports</option>
                <option value="other">📌 Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Short Description * <span className="text-zinc-500">({charCount}/500)</span>
              </label>
              <textarea
                className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-white transition-all"
                placeholder="Brief overview of the event (max 500 characters)..."
                value={formData.short_description}
                onChange={(e) => {
                  if (e.target.value.length <= 500) {
                    handleInputChange('short_description', e.target.value)
                    setCharCount(e.target.value.length)
                  }
                }}
                required
                rows={3}
                maxLength={500}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Full Description
              </label>
              <textarea
                className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-white transition-all"
                placeholder="Detailed information about the event..."
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={4}
              />
            </div>

            <ImageUpload
              currentImageUrl={formData.event_image_url}
              onUpload={(url) => handleInputChange('event_image_url', url)}
              onError={(error) => toast.error(error)}
              bucket="event-images"
              filePrefix="event-img"
              label="Event Image"
            />

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Volunteer Roles Needed
              </label>
              <input
                type="text"
                placeholder="e.g., Event Setup, Registration Desk, Photography (comma separated)"
                value={formData.volunteer_roles}
                onChange={(e) => handleInputChange('volunteer_roles', e.target.value)}
                className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-white transition-all"
              />
              <p className="text-xs text-zinc-500 mt-1">
                Specify the roles volunteers will fill at your event
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Skills/Tags
              </label>
              <input
                type="text"
                placeholder="e.g., teamwork, outdoor, communication (comma separated)"
                value={formData.social_tags}
                onChange={(e) => handleInputChange('social_tags', e.target.value)}
                className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-white transition-all"
              />
              <p className="text-xs text-zinc-500 mt-1">
                Add tags to help volunteers find your event
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Location *
              </label>
              <input
                type="text"
                placeholder="e.g., Bondi Beach, Sydney NSW"
                value={formData.location_address}
                onChange={(e) => handleInputChange('location_address', e.target.value)}
                required
                className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-white transition-all"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Start Date & Time *
                </label>
                <input
                  type="datetime-local"
                  value={formData.start_datetime}
                  onChange={(e) => handleInputChange('start_datetime', e.target.value)}
                  required
                  className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-white transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  End Date & Time *
                </label>
                <input
                  type="datetime-local"
                  value={formData.end_datetime}
                  onChange={(e) => handleInputChange('end_datetime', e.target.value)}
                  required
                  className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-white transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Maximum Volunteers *
              </label>
              <input
                type="number"
                min="1"
                value={formData.max_volunteers}
                onChange={(e) => handleInputChange('max_volunteers', parseInt(e.target.value))}
                required
                className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-white transition-all"
              />
            </div>

            <div className="flex gap-4 pt-4">
              <Button 
                type="submit" 
                disabled={loading}
                className="flex-1 bg-white text-black hover:bg-zinc-200"
              >
                {loading ? 'Updating...' : 'Update Event'}
              </Button>
              <Link href="/org/dashboard" className="flex-1">
                <Button type="button" variant="secondary" className="w-full">
                  Cancel
                </Button>
              </Link>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}