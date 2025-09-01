'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Calendar, MapPin, Users, Edit, Trash2, Plus } from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'

interface Event {
  id: string
  title: string
  description: string
  location_address: string
  start_datetime: string
  max_volunteers: number
  social_tags: string[]
  status: string
  registrations: { count: number }[]
}

export default function EventsList({ orgId }: { orgId: string }) {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    const { data, error } = await supabase
      .from('events')
      .select(`
        *,
        registrations:event_registrations(count)
      `)
      .eq('org_id', orgId)
      .order('start_datetime', { ascending: true })

    if (error) {
      toast.error('Failed to load events')
      return
    }

    setEvents(data || [])
    setLoading(false)
  }

  const handleDeleteEvent = async (eventId: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return

    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', eventId)

    if (error) {
      toast.error('Failed to delete event')
      return
    }

    setEvents(events.filter(e => e.id !== eventId))
    toast.success('Event deleted successfully')
  }

  if (loading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 animate-pulse">
            <div className="h-6 bg-white/10 rounded mb-3"></div>
            <div className="h-4 bg-white/10 rounded mb-2"></div>
            <div className="h-3 bg-white/10 rounded w-2/3"></div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {events.map((event) => {
        const eventDate = new Date(event.start_datetime)
        const registrationCount = event.registrations?.[0]?.count || 0
        
        return (
          <div key={event.id} className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:bg-white/20 transition-all duration-300">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-white mb-2">
                  {event.title}
                </h3>
                <p className="text-gray-300 mb-3 text-sm">{event.description}</p>
                
                <div className="flex flex-wrap gap-2 mb-3">
                  {event.social_tags?.slice(0, 2).map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-green-500/20 border border-green-500/40 text-green-400 text-xs rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="space-y-2 text-sm text-gray-400">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {eventDate.toLocaleDateString()} at {eventDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    {event.location_address}
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    {registrationCount}/{event.max_volunteers} volunteers
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2 ml-4">
                <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
                  <Edit className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => handleDeleteEvent(event.id)}
                  className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur rounded-lg p-4 border border-white/10">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-white">
                  Registration: {registrationCount}/{event.max_volunteers}
                </span>
                <span className="text-xs text-gray-400">
                  {Math.round((registrationCount / event.max_volunteers) * 100)}%
                </span>
              </div>
              <div className="w-full bg-gray-600 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-pink-500 to-cyan-500 h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${(registrationCount / event.max_volunteers) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        )
      })}

      {events.length === 0 && (
        <div className="text-center py-16 md:col-span-2 lg:col-span-3">
          <div className="text-6xl mb-6 animate-bounce">📅</div>
          <h3 className="text-xl font-semibold text-white mb-3">No events created yet</h3>
          <p className="text-gray-300 mb-6">Create your first event to start finding volunteers!</p>
          <Link href="/org/create-event">
            <Button className="bg-gradient-to-r from-pink-500 to-cyan-500 hover:scale-105 transition-all duration-300">
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Event
            </Button>
          </Link>
        </div>
      )}
    </div>
  )
}