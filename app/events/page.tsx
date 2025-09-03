'use client'

import { useEffect, useState, useMemo, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { LoadingSkeleton } from '@/components/ui/loading-skeleton'
import { EventCard } from '@/components/ui/event-card'
import { toast } from 'sonner'
import { Calendar, MapPin, Users, Search, Filter, Clock, Tag, ArrowLeft, User, Building } from 'lucide-react'
import Link from 'next/link'
import UserProfile from '@/components/ui/user-profile'
import { Event } from '@/lib/types'
import { MESSAGES } from '@/lib/constants'
import { useDebounce } from '@/lib/hooks/useDebounce'

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [locationFilter, setLocationFilter] = useState('')
  const [timeFilter, setTimeFilter] = useState('all')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [allTags, setAllTags] = useState<string[]>([])
  const [registeredEvents, setRegisteredEvents] = useState<Set<string>>(new Set())
  const [dbError, setDbError] = useState<string>('')
  const supabase = createClient()
  
  // Debounce search terms to avoid excessive filtering
  const debouncedSearchTerm = useDebounce(searchTerm, 300)
  const debouncedLocationFilter = useDebounce(locationFilter, 300)

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      
      // Add a timeout to prevent infinite loading
      const timeoutId = setTimeout(() => {
        setLoading(false)
        setDbError('Loading timeout. Please refresh the page.')
      }, 10000) // 10 second timeout
      
      try {
        await Promise.all([
          fetchEvents(),
          fetchUserRegistrations()
        ])
      } finally {
        clearTimeout(timeoutId)
        setLoading(false)
      }
    }
    loadData()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [events, debouncedSearchTerm, debouncedLocationFilter, timeFilter, selectedTags])

  const fetchEvents = async () => {
    try {
      // First, try to get events with organization data
      const { data: eventsData, error: eventsError } = await supabase
        .from('events')
        .select('*')
        .eq('status', 'published')
        .gte('start_datetime', new Date().toISOString())
        .order('start_datetime', { ascending: true })

      if (eventsError) {
        throw eventsError
      }

      // Then get organization profiles separately with contact details
      const orgIds = Array.from(new Set(eventsData?.map(event => event.org_id) || []))
      const { data: orgsData, error: orgsError } = await supabase
        .from('organization_profiles')
        .select('user_id, org_name, contact_email, contact_phone')
        .in('user_id', orgIds)

      if (orgsError) {
        // Could not load organization data, using fallback
      }

      // Combine the data
      const orgsMap = new Map()
      orgsData?.forEach(org => {
        orgsMap.set(org.user_id, org)
      })

      const eventsWithOrgs = eventsData?.map(event => ({
        ...event,
        end_datetime: event.end_datetime || event.start_datetime, // Default to start if no end
        status: event.status || 'published' as const,
        organization_profiles: orgsMap.get(event.org_id) || { org_name: 'Unknown Organization' }
      })) as Event[] || []

      setEvents(eventsWithOrgs)
      
      // Extract all unique tags
      const tags = new Set<string>()
      eventsWithOrgs.forEach(event => {
        event.social_tags?.forEach((tag: string) => tags.add(tag))
      })
      setAllTags(Array.from(tags))
    } catch (error) {
      const err = error as Error
      console.error('Error fetching events:', err)
      // Only show error messages for actual errors, not when there are simply no events
      if ((err as any).code !== 'PGRST116') { // PGRST116 is "no rows found" which is fine
        if (err.message.includes('relation "events" does not exist')) {
          setDbError(MESSAGES.ERROR.DATABASE_MISSING)
        } else if (err.message.includes('JWT') || err.message.includes('permission') || err.message.includes('policy')) {
          setDbError(MESSAGES.ERROR.DATABASE_PERMISSION)
        } else if (err.message.includes('Failed to fetch')) {
          setDbError(MESSAGES.ERROR.DATABASE_CONNECTION)
        } else {
          // Only show error if it's not just an empty result
          console.log('Events query returned no results, which is normal if no events exist')
        }
      }
      // Set empty events array to show "No events" message
      setEvents([])
    }
  }

  const fetchUserRegistrations = async () => {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      if (userError || !user) {
        // User not logged in, which is fine for events page
        return
      }

      const { data, error } = await supabase
        .from('event_registrations')
        .select('event_id')
        .eq('user_id', user.id)

      if (error) {
        console.error('Error fetching registrations:', error)
        // Continue without registrations data
        return
      }

      if (data) {
        setRegisteredEvents(new Set(data.map(reg => reg.event_id)))
      }
    } catch (error) {
      console.error('Error in fetchUserRegistrations:', error)
      // Continue without registrations data
    }
  }

  const applyFilters = useCallback(() => {
    let filtered = [...events]

    // Search filter
    if (debouncedSearchTerm) {
      filtered = filtered.filter(event => 
        event.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        event.organization_profiles?.org_name.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
      )
    }

    // Location filter  
    if (debouncedLocationFilter) {
      filtered = filtered.filter(event =>
        event.location_address.toLowerCase().includes(debouncedLocationFilter.toLowerCase())
      )
    }

    // Time filter
    if (timeFilter !== 'all') {
      const now = new Date()
      filtered = filtered.filter(event => {
        const eventDate = new Date(event.start_datetime)
        switch (timeFilter) {
          case 'today':
            return eventDate.toDateString() === now.toDateString()
          case 'week':
            const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
            return eventDate >= now && eventDate <= weekFromNow
          case 'month':
            const monthFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)
            return eventDate >= now && eventDate <= monthFromNow
          default:
            return true
        }
      })
    }

    // Tags filter
    if (selectedTags.length > 0) {
      filtered = filtered.filter(event =>
        selectedTags.some(tag => event.social_tags?.includes(tag))
      )
    }

    setFilteredEvents(filtered)
  }, [events, searchTerm, locationFilter, timeFilter, selectedTags])

  const handleTagToggle = useCallback((tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    )
  }, [])

  const handleJoinEvent = useCallback(async (eventId: string) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      toast.error('Please login to register for events')
      return
    }

    try {
      const { error } = await supabase
        .from('event_registrations')
        .insert({
          event_id: eventId,
          user_id: user.id,
        })

      if (error) throw error

      setRegisteredEvents(prev => new Set([...Array.from(prev), eventId]))
      toast.success('Successfully registered for event! 🎉')
    } catch (error: any) {
      toast.error(error.message || 'Failed to register for event')
    }
  }, [supabase])

  const handleLeaveEvent = useCallback(async (eventId: string) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    try {
      const { error } = await supabase
        .from('event_registrations')
        .delete()
        .eq('event_id', eventId)
        .eq('user_id', user.id)

      if (error) throw error

      setRegisteredEvents(prev => {
        const newSet = new Set(prev)
        newSet.delete(eventId)
        return newSet
      })
      toast.success('Unregistered from event')
    } catch (error: any) {
      toast.error('Failed to unregister from event')
    }
  }, [supabase])

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-zinc-400">Loading events...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Mobile */}
      <div className="md:hidden min-h-screen flex flex-col">
        {/* Mobile Header */}
        <div className="p-4 border-b border-zinc-900">
          <div className="flex items-center gap-3 mb-4">
            <Link href="/dashboard">
              <button className="p-2 bg-zinc-900 rounded text-white hover:bg-zinc-800 transition-colors">
                <ArrowLeft className="h-4 w-4" />
              </button>
            </Link>
            <h1 className="text-xl font-bold text-white">
              All Events
            </h1>
            <div className="ml-auto flex items-center gap-2">
              <Link href="/auth/login">
                <Button size="sm" variant="outline" className="border-zinc-800 text-white hover:bg-zinc-900 p-2">
                  <User className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/auth/org-login">
                <Button size="sm" className="bg-white text-black hover:bg-zinc-200 p-2">
                  <Building className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
          
          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
            <Input
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-zinc-900 border-zinc-800 text-white placeholder-zinc-500"
            />
          </div>

          {/* Quick Filters */}
          <div className="flex gap-2 flex-wrap">
            {['all', 'today', 'week', 'month'].map(filter => (
              <button
                key={filter}
                onClick={() => setTimeFilter(filter)}
                className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                  timeFilter === filter
                    ? 'bg-white text-black'
                    : 'bg-zinc-900 text-zinc-400 hover:text-white'
                }`}
              >
                {filter === 'all' ? 'All Time' : filter === 'today' ? 'Today' : filter === 'week' ? 'This Week' : 'This Month'}
              </button>
            ))}
          </div>
        </div>

        {/* Mobile Events List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {filteredEvents.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              isRegistered={registeredEvents.has(event.id)}
              registrationCount={event._count?.registrations || 0}
              onRegister={handleJoinEvent}
              onUnregister={handleLeaveEvent}
              variant="mobile"
            />
          ))}

          {filteredEvents.length === 0 && !dbError && (
            <div className="text-center py-12">
              <div className="w-12 h-12 bg-zinc-900 rounded flex items-center justify-center mx-auto mb-4">
                <Search className="w-6 h-6 text-zinc-500" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">No events found</h3>
              <p className="text-zinc-500 text-sm">Try adjusting your search or filters</p>
            </div>
          )}

          {dbError && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Database Setup Required</h3>
              <p className="text-gray-400 text-sm mb-2">{dbError}</p>
              {dbError.includes('fix-events-access.sql') && (
                <p className="text-cyan-400 text-xs">Run the fix-events-access.sql file in your project root</p>
              )}
              <p className="text-gray-500 text-xs mt-2">Check console for more details</p>
            </div>
          )}
        </div>
      </div>

      {/* Desktop */}
      <div className="hidden md:block">
        <div className="container mx-auto px-6 py-8 max-w-7xl">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Link href="/">
                <button className="p-2 bg-zinc-900 rounded text-white hover:bg-zinc-800 transition-colors">
                  <ArrowLeft className="h-5 w-5" />
                </button>
              </Link>
              <h1 className="text-3xl font-bold text-white">
                All Events
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <Link href="/auth/login">
                <Button size="sm" variant="outline" className="border-zinc-800 text-white hover:bg-zinc-900">
                  <User className="h-4 w-4 mr-2" />
                  Member Login
                </Button>
              </Link>
              <Link href="/auth/org-login">
                <Button size="sm" className="bg-white text-black hover:bg-zinc-200">
                  <Building className="h-4 w-4 mr-2" />
                  Organization Login
                </Button>
              </Link>
            </div>
          </div>

          {/* Desktop Filters */}
          <div className="bg-zinc-900 rounded p-6 mb-8 border border-zinc-800">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
                <Input
                  placeholder="Search events..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Location */}
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
                <Input
                  placeholder="Location..."
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Time Filter */}
              <div className="relative">
                <Clock className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
                <select
                  value={timeFilter}
                  onChange={(e) => setTimeFilter(e.target.value)}
                  className="w-full h-10 pl-10 pr-4 bg-zinc-900 border border-zinc-800 rounded text-white focus:outline-none focus:ring-2 focus:ring-white"
                >
                  <option value="all">All Time</option>
                  <option value="today">Today</option>
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                </select>
              </div>

              {/* Clear Filters */}
              <Button
                onClick={() => {
                  setSearchTerm('')
                  setLocationFilter('')
                  setTimeFilter('all')
                  setSelectedTags([])
                }}
                variant="secondary"
              >
                Clear Filters
              </Button>
            </div>

            {/* Tags Filter */}
            <div className="mt-4">
              <h3 className="text-white font-medium mb-3 flex items-center gap-2">
                <Tag className="h-4 w-4" />
                Filter by Skills/Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {allTags.map(tag => (
                  <button
                    key={tag}
                    onClick={() => handleTagToggle(tag)}
                    className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                      selectedTags.includes(tag)
                        ? 'bg-white text-black'
                        : 'bg-zinc-800 text-zinc-400 hover:text-white'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Desktop Events Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                isRegistered={registeredEvents.has(event.id)}
                registrationCount={event._count?.registrations || 0}
                onRegister={handleJoinEvent}
                onUnregister={handleLeaveEvent}
                variant="desktop"
              />
            ))}

            {filteredEvents.length === 0 && !dbError && (
              <div className="col-span-full text-center py-16">
                <div className="w-16 h-16 bg-zinc-900 rounded flex items-center justify-center mx-auto mb-6">
                  <Search className="w-8 h-8 text-zinc-500" />
                </div>
                <h3 className="text-2xl font-semibold text-white mb-3">No events found</h3>
                <p className="text-zinc-500">Try adjusting your search criteria or filters</p>
              </div>
            )}

            {dbError && (
              <div className="col-span-full text-center py-16">
                <div className="w-20 h-20 bg-red-900/20 rounded flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-semibold text-white mb-3">Database Setup Required</h3>
                <p className="text-zinc-400 mb-2">{dbError}</p>
                {dbError.includes('fix-events-access.sql') && (
                  <p className="text-zinc-300 text-sm mb-2">Run the fix-events-access.sql file in your project root</p>
                )}
                <p className="text-zinc-500 text-sm">Please check the browser console for more details</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}