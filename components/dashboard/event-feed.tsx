'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { Calendar, MapPin, Users } from 'lucide-react'

interface Event {
  id: string
  title: string
  description: string
  location_address: string
  start_datetime: string
  max_volunteers: number
  social_tags: string[]
  organization_profiles: {
    org_name: string
  }
  _count?: {
    registrations: number
  }
}

export default function EventFeed({ userId }: { userId: string }) {
  const [events, setEvents] = useState<Event[]>([])
  const [registeredEvents, setRegisteredEvents] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    fetchEvents()
    fetchRegistrations()
  }, [])

  const fetchEvents = async () => {
    const { data, error } = await supabase
      .from('events')
      .select(`
        *,
        organization_profiles!inner(org_name)
      `)
      .eq('status', 'published')
      .gte('start_datetime', new Date().toISOString())
      .order('start_datetime', { ascending: true })
      .limit(10)

    if (error) {
      toast.error('Failed to load events')
      return
    }

    setEvents(data || [])
    setLoading(false)
  }

  const fetchRegistrations = async () => {
    const { data } = await supabase
      .from('event_registrations')
      .select('event_id')
      .eq('user_id', userId)

    if (data) {
      setRegisteredEvents(new Set(data.map(reg => reg.event_id)))
    }
  }

  const handleJoinEvent = async (eventId: string) => {
    try {
      const { error } = await supabase
        .from('event_registrations')
        .insert({
          event_id: eventId,
          user_id: userId,
        })

      if (error) throw error

      setRegisteredEvents(prev => new Set([...prev, eventId]))
      toast.success('Successfully joined event! 🎉')
    } catch (error: any) {
      toast.error(error.message || 'Failed to join event')
    }
  }

  const handleLeaveEvent = async (eventId: string) => {
    try {
      const { error } = await supabase
        .from('event_registrations')
        .delete()
        .eq('event_id', eventId)
        .eq('user_id', userId)

      if (error) throw error

      setRegisteredEvents(prev => {
        const newSet = new Set(prev)
        newSet.delete(eventId)
        return newSet
      })
      toast.success('Left event successfully')
    } catch (error: any) {
      toast.error('Failed to leave event')
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white rounded-lg p-6 shadow-sm animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="px-5 pb-5">
      <div className="mb-6">
        <h2 className="text-white text-xl font-bold mb-2 flex items-center gap-2">
          🔥 Events Near You
        </h2>
        <p className="text-gray-400 text-sm">Find opportunities that match your vibe</p>
      </div>

      <div className="space-y-4">
        {events.map((event) => {
          const isRegistered = registeredEvents.has(event.id)
          const eventDate = new Date(event.start_datetime)
          
          return (
            <div 
              key={event.id} 
              className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl overflow-hidden
                         hover:bg-white/20 transition-all duration-300 cursor-pointer
                         active:scale-95 hover:scale-[1.02]"
            >
              {/* Event Image */}
              <div className="h-24 bg-gradient-to-r from-pink-400 via-cyan-400 to-blue-400 animate-gradient-flow 
                             flex items-center justify-center text-white text-lg font-bold relative">
                {event.title.includes('Beach') && '🌊'}
                {event.title.includes('Run') && '🎪'}
                {event.title.includes('Cook') && '🍳'}
                {event.title.includes('Clean') && '🧹'}
                {!event.title.match(/(Beach|Run|Cook|Clean)/i) && '✨'}
                <span className="ml-2">
                  {event.title.includes('Beach') && 'Beach Cleanup'}
                  {event.title.includes('Run') && 'Fun Run'}
                  {event.title.includes('Cook') && 'Cooking'}
                  {event.title.includes('Clean') && 'Cleanup'}
                  {!event.title.match(/(Beach|Run|Cook|Clean)/i) && 'Event'}
                </span>
              </div>
              
              <div className="p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <h3 className="text-white font-semibold leading-tight text-sm">
                    {event.title}
                  </h3>
                  {isRegistered ? (
                    <button
                      onClick={() => handleLeaveEvent(event.id)}
                      className="px-3 py-1 bg-red-500/20 border border-red-500/40 text-red-400 
                               text-xs rounded-full font-semibold shrink-0 hover:bg-red-500/30 transition-all"
                    >
                      ✓ Joined
                    </button>
                  ) : (
                    <button
                      onClick={() => handleJoinEvent(event.id)}
                      className="px-3 py-1 bg-gradient-to-r from-pink-500 to-cyan-500 text-white 
                               text-xs font-semibold rounded-full shrink-0 hover:scale-105 transition-all duration-300 animate-glow"
                    >
                      Join Squad
                    </button>
                  )}
                </div>

                <p className="text-gray-300 text-xs line-clamp-2">{event.description}</p>
                
                <div className="flex justify-between items-center text-xs text-gray-400 mb-3">
                  <span className="flex items-center gap-1">
                    📅 {eventDate.toLocaleDateString('en-AU', { 
                      weekday: 'short', 
                      month: 'short', 
                      day: 'numeric' 
                    })} {eventDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </span>
                  <span className="flex items-center gap-1">
                    📍 {event.location_address.split(',')[0]}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2 mb-3">
                  {event.social_tags?.slice(0, 3).map((tag, index) => {
                    const colors = [
                      'bg-pink-500/20 border-pink-500/40 text-pink-400',
                      'bg-cyan-500/20 border-cyan-500/40 text-cyan-400',
                      'bg-purple-500/20 border-purple-500/40 text-purple-400',
                      'bg-green-500/20 border-green-500/40 text-green-400'
                    ]
                    return (
                      <span
                        key={index}
                        className={`px-2 py-1 ${colors[index % colors.length]} text-xs rounded-full font-semibold border`}
                      >
                        {tag}
                      </span>
                    )
                  })}
                </div>

                <div className="flex justify-between items-center">
                  <div className="text-cyan-400 text-xs flex items-center gap-1">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                    {event._count?.registrations || 0}/{event.max_volunteers} joined
                  </div>
                  <div className="text-gray-500 text-xs">
                    by {event.organization_profiles.org_name}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

        {events.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4 animate-bounce">🌟</div>
            <h3 className="text-xl font-semibold text-white mb-2">No events yet</h3>
            <p className="text-gray-400">New opportunities are being added daily!</p>
          </div>
        )}
      </div>
    </div>
  )
}