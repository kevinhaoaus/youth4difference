'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function CreateEventPage() {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location_address: '',
    start_datetime: '',
    end_datetime: '',
    max_volunteers: 10,
    social_tags: '',
  })
  
  const router = useRouter()
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const tagsArray = formData.social_tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0)

      const { error } = await supabase
        .from('events')
        .insert({
          org_id: user.id,
          title: formData.title,
          description: formData.description,
          location_address: formData.location_address,
          start_datetime: formData.start_datetime,
          end_datetime: formData.end_datetime,
          max_volunteers: formData.max_volunteers,
          social_tags: tagsArray,
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
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-black">
      <header className="bg-white/5 backdrop-blur-xl border-b border-white/10">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/org/dashboard">
            <Button variant="ghost" size="sm" className="text-white hover:bg-white/10 border border-white/20">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent md:text-3xl">
            Create New Event
          </h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <form onSubmit={handleSubmit} className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6 space-y-6">
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
                className="w-full p-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all duration-300"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Description
              </label>
              <textarea
                className="w-full p-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all duration-300"
                placeholder="Tell students what they'll be doing and why it's awesome..."
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={4}
              />
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
                className="w-full p-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all duration-300"
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
                  className="w-full p-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all duration-300"
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
                  className="w-full p-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all duration-300"
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
                className="w-full p-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all duration-300"
              />
              <p className="text-xs text-gray-400 mt-1">
                Add fun elements to attract students (e.g., "free pizza", "music", "networking")
              </p>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full p-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating Event...' : 'Create Event'}
            </button>
          </form>
        </div>
      </main>
    </div>
  )
}