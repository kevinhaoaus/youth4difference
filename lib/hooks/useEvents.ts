'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Event } from '@/lib/types'
import { toast } from 'sonner'
import { MESSAGES, TIMEOUTS } from '@/lib/constants'

export function useEvents(autoFetch = true) {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [registeredEventIds, setRegisteredEventIds] = useState<Set<string>>(new Set())
  const supabase = createClient()

  const fetchEvents = useCallback(async () => {
    setLoading(true)
    setError(null)

    const timeoutId = setTimeout(() => {
      setLoading(false)
      setError(MESSAGES.ERROR.TIMEOUT)
    }, TIMEOUTS.LOADING)

    try {
      const { data: eventsData, error: eventsError } = await supabase
        .from('events')
        .select('*')
        .eq('status', 'published')
        .gte('start_datetime', new Date().toISOString())
        .order('start_datetime', { ascending: true })

      clearTimeout(timeoutId)

      if (eventsError) throw eventsError

      // Fetch organization data
      const orgIds = Array.from(new Set(eventsData?.map(event => event.org_id) || []))
      const { data: orgsData } = await supabase
        .from('organization_profiles')
        .select('user_id, org_name, contact_email, contact_phone, logo_url')
        .in('user_id', orgIds)

      const orgsMap = new Map()
      orgsData?.forEach(org => {
        orgsMap.set(org.user_id, org)
      })

      const enrichedEvents = eventsData?.map(event => ({
        ...event,
        organization_profiles: orgsMap.get(event.org_id) || { org_name: 'Unknown Organization' }
      })) || []

      setEvents(enrichedEvents)
    } catch (err) {
      console.error('Error fetching events:', err)
      setError(MESSAGES.ERROR.LOAD_EVENTS)
      setEvents([])
    } finally {
      clearTimeout(timeoutId)
      setLoading(false)
    }
  }, [supabase])

  const fetchUserRegistrations = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data } = await supabase
        .from('event_registrations')
        .select('event_id')
        .eq('user_id', user.id)

      if (data) {
        setRegisteredEventIds(new Set(data.map(reg => reg.event_id)))
      }
    } catch (err) {
      console.error('Error fetching registrations:', err)
    }
  }, [supabase])

  const registerForEvent = useCallback(async (eventId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        toast.error(MESSAGES.ERROR.NOT_AUTHENTICATED)
        return false
      }

      const { error } = await supabase
        .from('event_registrations')
        .insert({ event_id: eventId, user_id: user.id })

      if (error) throw error

      setRegisteredEventIds(prev => new Set([...Array.from(prev), eventId]))
      toast.success(MESSAGES.SUCCESS.EVENT_REGISTERED)
      return true
    } catch (err) {
      console.error('Error registering for event:', err)
      toast.error(MESSAGES.ERROR.REGISTER_EVENT)
      return false
    }
  }, [supabase])

  const unregisterFromEvent = useCallback(async (eventId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        toast.error(MESSAGES.ERROR.NOT_AUTHENTICATED)
        return false
      }

      const { error } = await supabase
        .from('event_registrations')
        .delete()
        .eq('event_id', eventId)
        .eq('user_id', user.id)

      if (error) throw error

      setRegisteredEventIds(prev => {
        const newSet = new Set(prev)
        newSet.delete(eventId)
        return newSet
      })
      toast.success(MESSAGES.SUCCESS.EVENT_LEFT)
      return true
    } catch (err) {
      console.error('Error unregistering from event:', err)
      toast.error(MESSAGES.ERROR.UNREGISTER_EVENT)
      return false
    }
  }, [supabase])

  useEffect(() => {
    if (autoFetch) {
      fetchEvents()
      fetchUserRegistrations()
    }
  }, [autoFetch])

  return {
    events,
    loading,
    error,
    registeredEventIds,
    isRegistered: (eventId: string) => registeredEventIds.has(eventId),
    fetchEvents,
    fetchUserRegistrations,
    registerForEvent,
    unregisterFromEvent,
    refresh: () => {
      fetchEvents()
      fetchUserRegistrations()
    }
  }
}