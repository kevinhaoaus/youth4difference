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
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Upcoming Events Near You</h2>
        <p className="text-gray-600">Find volunteering opportunities that match your vibe</p>
      </div>

      <div className="space-y-4 md:grid md:grid-cols-2 md:gap-6 md:space-y-0">
        {events.map((event) => {
          const isRegistered = registeredEvents.has(event.id)
          const eventDate = new Date(event.start_datetime)
          
          return (
            <div 
              key={event.id} 
              className="bg-white rounded-2xl shadow-sm border overflow-hidden 
                         hover:shadow-lg transition-all duration-300 
                         active:scale-95 md:active:scale-100"
            >
              <div className="p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-semibold text-gray-900 leading-tight">
                    {event.title}
                  </h3>
                  {isRegistered ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleLeaveEvent(event.id)}
                      className="text-red-600 border-red-200 hover:bg-red-50 shrink-0"
                    >
                      ✓ Joined
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      onClick={() => handleJoinEvent(event.id)}
                      className="bg-gradient-to-r from-indigo-600 to-purple-600 
                                 hover:from-indigo-700 hover:to-purple-700 shrink-0"
                    >
                      Join 🚀
                    </Button>
                  )}
                </div>

                <p className="text-gray-600 text-sm line-clamp-2">{event.description}</p>
                
                <div className="flex flex-wrap gap-2">
                  {event.social_tags?.slice(0, 3).map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-gradient-to-r from-pink-100 to-purple-100 
                                 text-purple-800 text-xs rounded-full font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="space-y-2 text-xs text-gray-500">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-3 w-3" />
                    {eventDate.toLocaleDateString('en-AU', { 
                      weekday: 'short', 
                      month: 'short', 
                      day: 'numeric' 
                    })} at {eventDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-3 w-3" />
                    {event.location_address}
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Users className="h-3 w-3" />
                      {event._count?.registrations || 0}/{event.max_volunteers} joined
                    </div>
                    <div className="text-indigo-600 font-medium">
                      by {event.organization_profiles.org_name}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {events.length === 0 && (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">🌟</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No events yet</h3>
          <p className="text-gray-600">New opportunities are being added daily!</p>
        </div>
      )}
    </div>
  )
}