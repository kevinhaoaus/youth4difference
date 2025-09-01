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
    return <div className="text-center py-8">Loading events...</div>
  }

  return (
    <div className="grid gap-6">
      {events.map((event) => {
        const eventDate = new Date(event.start_datetime)
        const registrationCount = event.registrations?.[0]?.count || 0
        
        return (
          <div key={event.id} className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {event.title}
                </h3>
                <p className="text-gray-600 mb-3">{event.description}</p>
                
                <div className="flex flex-wrap gap-2 mb-3">
                  {event.social_tags?.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-6 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {eventDate.toLocaleDateString()} at {eventDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {event.location_address}
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {registrationCount}/{event.max_volunteers} volunteers
                  </div>
                </div>
              </div>

              <div className="flex gap-2 ml-4">
                <Button variant="ghost" size="sm">
                  <Edit className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => handleDeleteEvent(event.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">
                  Registration Status: {registrationCount}/{event.max_volunteers}
                </span>
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-indigo-600 h-2 rounded-full" 
                    style={{ width: `${(registrationCount / event.max_volunteers) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        )
      })}

      {events.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No events created yet</h3>
          <p className="text-gray-600 mb-4">Create your first event to start finding volunteers!</p>
          <Link href="/org/create-event">
            <Button className="bg-indigo-600 hover:bg-indigo-700">
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Event
            </Button>
          </Link>
        </div>
      )}
    </div>
  )
}