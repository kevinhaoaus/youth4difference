'use client'

import { useEffect, useState, useCallback, memo } from 'react'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { LoadingSkeleton } from '@/components/ui/loading-skeleton'
import { EventCard } from '@/components/ui/event-card'

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

function EventFeed({ userId }: { userId: string }) {
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

  const handleJoinEvent = useCallback(async (eventId: string) => {
    try {
      const { error } = await supabase
        .from('event_registrations')
        .insert({
          event_id: eventId,
          user_id: userId,
        })

      if (error) throw error

      setRegisteredEvents(prev => new Set([...Array.from(prev), eventId]))
      toast.success('Successfully joined event! 🎉')
    } catch (error: any) {
      toast.error(error.message || 'Failed to join event')
    }
  }, [supabase, userId])

  const handleLeaveEvent = useCallback(async (eventId: string) => {
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
  }, [supabase, userId])

  if (loading) {
    return (
      <div className="p-4 md:p-0">
        <LoadingSkeleton variant="list" count={3} />
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
        {events.map((event) => (
          <EventCard
            key={event.id}
            event={event}
            isRegistered={registeredEvents.has(event.id)}
            onRegister={handleJoinEvent}
            onUnregister={handleLeaveEvent}
            variant="feed"
          />
        ))}

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

export default memo(EventFeed)