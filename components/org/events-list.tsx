'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Calendar, MapPin, Users, Edit, Trash2, Plus, Eye, EyeOff, UserCheck } from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import EventAttendees from './event-attendees'

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
  const [selectedEvent, setSelectedEvent] = useState<{ id: string; title: string } | null>(null)
  const supabase = createClient()
  const router = useRouter()

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

  const handleTogglePublish = async (eventId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'published' ? 'draft' : 'published'
    
    const { error } = await supabase
      .from('events')
      .update({ status: newStatus })
      .eq('id', eventId)

    if (error) {
      toast.error('Failed to update event status')
      return
    }

    setEvents(events.map(e => 
      e.id === eventId ? { ...e, status: newStatus } : e
    ))
    
    toast.success(`Event ${newStatus === 'published' ? 'published' : 'unpublished'} successfully`)
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
          <div key={event.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden hover:border-zinc-700 transition-all duration-300">
            {/* Card Content */}
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-xl font-semibold text-white">
                      {event.title}
                    </h3>
                    {event.status === 'published' ? (
                      <span className="px-2 py-0.5 bg-green-500/20 border border-green-500/40 text-green-400 text-xs rounded-full">
                        Published
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 bg-yellow-500/20 border border-yellow-500/40 text-yellow-400 text-xs rounded-full">
                        Draft
                      </span>
                    )}
                  </div>
                  
                  {/* Event Details */}
                  <div className="space-y-2 text-sm text-zinc-500 mb-4">
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

                {/* Action Buttons */}
                <div className="flex flex-col gap-2">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleTogglePublish(event.id, event.status || 'draft')}
                    className={event.status === 'published' ? "text-green-400 hover:text-green-300 hover:bg-green-500/10" : "text-yellow-400 hover:text-yellow-300 hover:bg-yellow-500/10"}
                    title={event.status === 'published' ? "Unpublish event" : "Publish event"}
                  >
                    {event.status === 'published' ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-white hover:bg-white/10"
                    onClick={() => router.push(`/org/edit-event/${event.id}`)}
                  >
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

              {/* Registration Progress Bar */}
              <div className="bg-zinc-800/50 rounded-xl p-4 mt-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-white">
                    Registration: {registrationCount}/{event.max_volunteers}
                  </span>
                  <span className="text-xs text-zinc-500">
                    {Math.round((registrationCount / event.max_volunteers) * 100)}%
                  </span>
                </div>
                <div className="w-full bg-zinc-700 rounded-full h-2 mb-3">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-blue-400 h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${(registrationCount / event.max_volunteers) * 100}%` }}
                  />
                </div>
                {registrationCount > 0 && (
                  <Button
                    variant="secondary"
                    size="sm"
                    className="w-full bg-zinc-700 hover:bg-zinc-600"
                    onClick={() => setSelectedEvent({ id: event.id, title: event.title })}
                  >
                    <UserCheck className="h-4 w-4 mr-2" />
                    View Attendees ({registrationCount})
                  </Button>
                )}
              </div>
            </div>
          </div>
        )
      })}

      {events.length === 0 && (
        <div className="text-center py-16 md:col-span-2 lg:col-span-3">
          <div className="w-16 h-16 bg-indigo-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4h3a2 2 0 012 2v1a2 2 0 01-2 2h-16a2 2 0 01-2-2v-1a2 2 0 012-2h3z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-white mb-3">No events created yet</h3>
          <p className="text-gray-300 mb-6">Create your first event to start connecting with volunteers</p>
          <Link href="/org/create-event">
            <Button className="bg-indigo-600 hover:bg-indigo-700 transition-all duration-300">
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Event
            </Button>
          </Link>
        </div>
      )}

      {/* Event Attendees Modal */}
      {selectedEvent && (
        <EventAttendees
          eventId={selectedEvent.id}
          eventTitle={selectedEvent.title}
          isOpen={!!selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      )}
    </div>
  )
}