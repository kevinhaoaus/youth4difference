'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { X, Users, Mail, Phone, User, Download } from 'lucide-react'
import { toast } from 'sonner'

interface Attendee {
  id: string
  user_id: string
  registered_at: string
  users: {
    email: string
    user_type: string
  }
  student_profiles: {
    full_name?: string
    first_name?: string
    last_name?: string
    phone?: string
    university?: string
  }
}

interface EventAttendeesProps {
  eventId: string
  eventTitle: string
  isOpen: boolean
  onClose: () => void
}

export default function EventAttendees({ eventId, eventTitle, isOpen, onClose }: EventAttendeesProps) {
  const [attendees, setAttendees] = useState<Attendee[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    if (isOpen) {
      fetchAttendees()
    }
  }, [isOpen, eventId])

  const fetchAttendees = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('event_registrations')
        .select(`
          id,
          user_id,
          registered_at,
          users!inner (
            email,
            user_type
          )
        `)
        .eq('event_id', eventId)
        .order('registered_at', { ascending: true })

      if (error) {
        console.error('Error fetching registrations:', error)
        toast.error('Failed to load attendees')
        return
      }

      // Now get the student profiles separately
      const userIds = data?.map(reg => reg.user_id) || []
      const { data: profiles, error: profileError } = await supabase
        .from('student_profiles')
        .select('user_id, full_name, first_name, last_name, phone, university')
        .in('user_id', userIds)

      if (profileError) {
        console.error('Error fetching profiles:', profileError)
      }

      // Combine the data
      const profilesMap = new Map()
      profiles?.forEach(profile => {
        profilesMap.set(profile.user_id, profile)
      })

      const combinedData = data?.map(reg => ({
        ...reg,
        student_profiles: profilesMap.get(reg.user_id) || {
          full_name: '',
          first_name: '',
          last_name: '',
          phone: '',
          university: ''
        }
      })) || []

      setAttendees(combinedData as any)
    } catch (error) {
      console.error('Error:', error)
      toast.error('Failed to load attendees')
    } finally {
      setLoading(false)
    }
  }

  const getAttendeeName = (attendee: Attendee) => {
    const profile = attendee.student_profiles
    if (profile.full_name) return profile.full_name
    if (profile.first_name || profile.last_name) {
      return `${profile.first_name || ''} ${profile.last_name || ''}`.trim()
    }
    return 'Unknown'
  }

  const exportAttendees = () => {
    const csvContent = [
      ['Name', 'Email', 'Phone', 'University', 'Registered At'].join(','),
      ...attendees.map(attendee => [
        getAttendeeName(attendee),
        attendee.users.email,
        attendee.student_profiles.phone || 'Not provided',
        attendee.student_profiles.university || 'Not provided',
        new Date(attendee.registered_at).toLocaleString()
      ].map(field => `"${field}"`).join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${eventTitle.replace(/[^a-z0-9]/gi, '_')}_attendees.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    
    toast.success('Attendee list exported')
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-zinc-900 rounded-2xl w-full max-w-4xl max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="bg-zinc-800 p-6 border-b border-zinc-700">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">Event Attendees</h2>
              <p className="text-zinc-400">{eventTitle}</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-zinc-400 hover:text-white"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(80vh-200px)]">
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-zinc-800 rounded-lg p-4 animate-pulse">
                  <div className="h-5 bg-zinc-700 rounded w-1/3 mb-3"></div>
                  <div className="h-4 bg-zinc-700 rounded w-1/2 mb-2"></div>
                  <div className="h-4 bg-zinc-700 rounded w-1/4"></div>
                </div>
              ))}
            </div>
          ) : attendees.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-zinc-600" />
              </div>
              <p className="text-zinc-400">No attendees registered yet</p>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center mb-4">
                <p className="text-white">
                  <span className="font-semibold">{attendees.length}</span> {attendees.length === 1 ? 'attendee' : 'attendees'} registered
                </p>
                <Button
                  onClick={exportAttendees}
                  variant="secondary"
                  size="sm"
                  className="bg-zinc-800 hover:bg-zinc-700"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export CSV
                </Button>
              </div>

              <div className="space-y-3">
                {attendees.map((attendee, index) => (
                  <div key={attendee.id} className="bg-zinc-800 rounded-lg p-4 hover:bg-zinc-800/80 transition-colors">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                            {index + 1}
                          </div>
                          <h3 className="font-semibold text-white text-lg">
                            {getAttendeeName(attendee)}
                          </h3>
                        </div>
                        
                        <div className="space-y-1 ml-10">
                          <div className="flex items-center gap-2 text-sm">
                            <Mail className="h-4 w-4 text-zinc-500" />
                            <span className="text-zinc-300">{attendee.users.email}</span>
                          </div>
                          
                          <div className="flex items-center gap-2 text-sm">
                            <Phone className="h-4 w-4 text-zinc-500" />
                            <span className={attendee.student_profiles.phone ? "text-zinc-300" : "text-zinc-500 italic"}>
                              {attendee.student_profiles.phone || 'No phone number provided'}
                            </span>
                          </div>
                          
                          {attendee.student_profiles.university && (
                            <div className="flex items-center gap-2 text-sm">
                              <User className="h-4 w-4 text-zinc-500" />
                              <span className="text-zinc-300">{attendee.student_profiles.university}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <p className="text-xs text-zinc-500">Registered</p>
                        <p className="text-sm text-zinc-400">
                          {new Date(attendee.registered_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="bg-zinc-800 p-4 border-t border-zinc-700">
          <p className="text-xs text-zinc-500 text-center">
            Contact information is only visible to your organization for event coordination purposes
          </p>
        </div>
      </div>
    </div>
  )
}