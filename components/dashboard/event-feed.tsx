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
      <div className="p-4 md:p-0">
        <div className="space-y-4 md:grid md:grid-cols-2 md:gap-6 lg:grid-cols-3 md:space-y-0">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 animate-pulse">
              <div className="h-16 bg-white/10 rounded-xl mb-3"></div>
              <div className="h-4 bg-white/10 rounded mb-2"></div>
              <div className="h-3 bg-white/10 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 md:p-0">
      <div className="mb-6">
        <h2 className="text-white text-lg font-bold mb-2 md:text-2xl">Available Opportunities</h2>
        <p className="text-gray-400 text-sm md:text-base">Discover volunteer events in your community</p>
      </div>

      <div className="space-y-4 md:grid md:grid-cols-2 md:gap-6 lg:grid-cols-3 md:space-y-0">
        {events.map((event) => {
          const isRegistered = registeredEvents.has(event.id)
          const eventDate = new Date(event.start_datetime)
          
          return (
            <div 
              key={event.id} 
              className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl overflow-hidden
                         hover:bg-white/20 transition-all duration-300 cursor-pointer
                         active:scale-95 hover:scale-[1.02] md:hover:scale-105"
            >
              {/* Event Image */}
              <div className="h-24 bg-gradient-to-r from-indigo-500 to-blue-600 
                             flex items-center justify-center text-white text-lg font-semibold relative">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
              </div>
              
              <div className="p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <h3 className="text-white font-semibold leading-tight text-sm md:text-base">
                    {event.title}
                  </h3>
                  {isRegistered ? (
                    <button
                      onClick={() => handleLeaveEvent(event.id)}
                      className="px-3 py-1 bg-red-500/20 border border-red-500/40 text-red-400 
                               text-xs rounded-lg font-medium shrink-0 hover:bg-red-500/30 transition-all"
                    >
                      Registered
                    </button>
                  ) : (
                    <button
                      onClick={() => handleJoinEvent(event.id)}
                      className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white 
                               text-xs font-medium rounded-lg shrink-0 transition-all duration-300"
                    >
                      Register
                    </button>
                  )}
                </div>

                <p className="text-gray-300 text-xs line-clamp-2 md:text-sm">{event.description}</p>
                
                <div className="flex flex-col gap-2 text-xs text-gray-400 mb-3 md:text-sm">
                  <span className="flex items-center gap-2">
                    <Calendar className="h-3 w-3" />
                    {eventDate.toLocaleDateString('en-AU', { 
                      weekday: 'short', 
                      month: 'short', 
                      day: 'numeric' 
                    })} {eventDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </span>
                  <span className="flex items-center gap-2">
                    <MapPin className="h-3 w-3" />
                    {event.location_address.split(',')[0]}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2 mb-3">
                  {event.social_tags?.slice(0, 2).map((tag, index) => {
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
                    <Users className="h-3 w-3" />
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

        {events.length === 0 && (
          <div className="text-center py-16 md:col-span-3">
            <div className="w-16 h-16 bg-indigo-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4h3a2 2 0 012 2v1a2 2 0 01-2 2h-16a2 2 0 01-2-2v-1a2 2 0 012-2h3z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No events available</h3>
            <p className="text-gray-400">Check back soon for new volunteer opportunities</p>
          </div>
        )}
      </div>
    </div>
  )
}