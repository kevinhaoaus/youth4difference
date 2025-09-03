'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { validate } from '@/lib/utils/validation'
import { MESSAGES, CATEGORIES } from '@/lib/constants'

export default function CreateEventPage() {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
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
  })
  const [charCount, setCharCount] = useState(0)
  
  const router = useRouter()
  const supabase = createClient()

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
    
    if (new Date(formData.start_datetime) < new Date()) {
      toast.error('Event cannot start in the past')
      return
    }
    
    setLoading(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error(MESSAGES.ERROR.NOT_AUTHENTICATED)

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
        .insert({
          org_id: user.id,
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
        })

      if (error) throw error

      toast.success('Event created successfully! 🎉')
      router.push('/org/dashboard')
    } catch (error: any) {
      toast.error(error.message || 'Failed to create event')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="min-h-screen bg-black">
      <header className="bg-zinc-900 border-b border-zinc-800">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/org/dashboard">
            <Button variant="secondary" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-white md:text-3xl">
            Create New Event
          </h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
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
                Location *
              </label>
              <input
                type="text"
                placeholder="Full address or venue name"
                value={formData.location_address}
                onChange={(e) => handleInputChange('location_address', e.target.value)}
                required
                className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-white transition-all"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Start Date & Time *
                </label>
                <input
                  type="datetime-local"
                  value={formData.start_datetime}
                  onChange={(e) => handleInputChange('start_datetime', e.target.value)}
                  required
                  className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded text-white focus:outline-none focus:ring-2 focus:ring-white transition-all"
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
                  className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded text-white focus:outline-none focus:ring-2 focus:ring-white transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Maximum Volunteers
              </label>
              <input
                type="number"
                min="1"
                max="100"
                value={formData.max_volunteers}
                onChange={(e) => handleInputChange('max_volunteers', parseInt(e.target.value))}
                className="w-full p-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all duration-300"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Social Tags
              </label>
              <input
                type="text"
                placeholder="food provided, music, fun, networking (comma separated)"
                value={formData.social_tags}
                onChange={(e) => handleInputChange('social_tags', e.target.value)}
                className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-white transition-all"
              />
              <p className="text-xs text-zinc-500 mt-1">
                Add fun elements to attract students (e.g., "free pizza", "music", "networking")
              </p>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full p-4 bg-white text-black font-semibold rounded hover:bg-zinc-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating Event...' : 'Create Event'}
            </button>
          </form>
        </div>
      </main>
    </div>
  )
}