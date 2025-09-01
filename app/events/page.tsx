'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { Calendar, MapPin, Users, Search, Filter, Clock, Tag, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import UserProfile from '@/components/ui/user-profile'

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

  useEffect(() => {
    fetchEvents()
    fetchUserRegistrations()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [events, searchTerm, locationFilter, timeFilter, selectedTags])

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

      // Then get organization profiles separately
      const orgIds = Array.from(new Set(eventsData?.map(event => event.org_id) || []))
      const { data: orgsData, error: orgsError } = await supabase
        .from('organization_profiles')
        .select('user_id, org_name')
        .in('user_id', orgIds)

      if (orgsError) {
        console.warn('Could not load organization data:', orgsError)
      }

      // Combine the data
      const orgsMap = new Map()
      orgsData?.forEach(org => {
        orgsMap.set(org.user_id, org)
      })

      const eventsWithOrgs = eventsData?.map(event => ({
        ...event,
        organization_profiles: orgsMap.get(event.org_id) || { org_name: 'Unknown Organization' }
      })) || []

      setEvents(eventsWithOrgs)
      
      // Extract all unique tags
      const tags = new Set<string>()
      eventsWithOrgs.forEach(event => {
        event.social_tags?.forEach((tag: string) => tags.add(tag))
      })
      setAllTags(Array.from(tags))
      
      setLoading(false)
    } catch (error: any) {
      console.error('Error loading events:', error)
      setDbError(error.message)
      if (error.message.includes('relation "events" does not exist')) {
        setDbError('Database tables missing. Please run the SQL setup script in your Supabase SQL Editor to create required tables.')
      } else if (error.message.includes('JWT') || error.message.includes('permission') || error.message.includes('policy')) {
        setDbError('Database permission error. Please run the fix-events-access.sql file in your Supabase SQL Editor to set up proper access policies.')
      } else if (error.message.includes('Failed to fetch')) {
        setDbError('Database connection failed. Please check your Supabase configuration and internet connection.')
      } else {
        setDbError(`Database error: ${error.message}`)
      }
      toast.error(`Failed to load events: ${error.message}`)
      setLoading(false)
    }
  }

  const fetchUserRegistrations = async () => {
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError) {
      console.error('Error getting user:', userError)
      return
    }
    if (!user) {
      console.log('No user logged in, skipping registration fetch')
      return
    }

    const { data, error } = await supabase
      .from('event_registrations')
      .select('event_id')
      .eq('user_id', user.id)

    if (error) {
      console.error('Error loading user registrations:', error)
      return
    }

    if (data) {
      setRegisteredEvents(new Set(data.map(reg => reg.event_id)))
    }
  }

  const applyFilters = () => {
    let filtered = [...events]

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(event => 
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.organization_profiles.org_name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Location filter
    if (locationFilter) {
      filtered = filtered.filter(event =>
        event.location_address.toLowerCase().includes(locationFilter.toLowerCase())
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
  }

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    )
  }

  const handleJoinEvent = async (eventId: string) => {
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
  }

  const handleLeaveEvent = async (eventId: string) => {
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
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800">
        {/* Mobile */}
        <div className="md:hidden flex items-center justify-center min-h-screen p-4">
          <div className="w-[375px] h-[812px] bg-black rounded-[40px] p-2 shadow-2xl shadow-purple-500/20">
            <div className="w-full h-full bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 rounded-[32px] overflow-hidden">
              <div className="p-6 space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 animate-pulse">
                    <div className="h-6 bg-white/10 rounded mb-3"></div>
                    <div className="h-4 bg-white/10 rounded mb-2"></div>
                    <div className="h-3 bg-white/10 rounded w-2/3"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Desktop */}
        <div className="hidden md:block container mx-auto px-6 py-8">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 animate-pulse">
                <div className="h-6 bg-white/10 rounded mb-3"></div>
                <div className="h-4 bg-white/10 rounded mb-2"></div>
                <div className="h-3 bg-white/10 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800">
      {/* Mobile */}
      <div className="md:hidden flex items-center justify-center min-h-screen p-4">
        <div className="w-[375px] h-[812px] bg-black rounded-[40px] p-2 shadow-2xl shadow-purple-500/20">
          <div className="w-full h-full bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 rounded-[32px] overflow-hidden">
            
            {/* Mobile Header */}
            <div className="p-4 border-b border-white/10">
              <div className="flex items-center gap-3 mb-4">
                <Link href="/dashboard">
                  <button className="p-2 bg-white/10 backdrop-blur-xl rounded-full border border-white/20 text-white hover:bg-white/20 transition-all">
                    <ArrowLeft className="h-4 w-4" />
                  </button>
                </Link>
                <h1 className="text-2xl font-bold text-white bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
                  All Events
                </h1>
              </div>
              
              {/* Search */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search events..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white/10 border-white/20 text-white placeholder-gray-400"
                />
              </div>

              {/* Quick Filters */}
              <div className="flex gap-2 mb-3 flex-wrap">
                {['all', 'today', 'week', 'month'].map(filter => (
                  <button
                    key={filter}
                    onClick={() => setTimeFilter(filter)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                      timeFilter === filter
                        ? 'bg-indigo-600 text-white'
                        : 'bg-white/10 text-gray-300 hover:bg-white/20'
                    }`}
                  >
                    {filter === 'all' ? 'All Time' : filter === 'today' ? 'Today' : filter === 'week' ? 'This Week' : 'This Month'}
                  </button>
                ))}
              </div>
            </div>

            {/* Mobile Events List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {filteredEvents.map((event) => {
                const isRegistered = registeredEvents.has(event.id)
                const eventDate = new Date(event.start_datetime)
                const registrationCount = event._count?.registrations || 0
                
                return (
                  <div key={event.id} className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-white font-semibold text-sm leading-tight flex-1 mr-2">
                        {event.title}
                      </h3>
                      {isRegistered ? (
                        <button
                          onClick={() => handleLeaveEvent(event.id)}
                          className="px-3 py-1 bg-red-500/20 border border-red-500/40 text-red-400 text-xs rounded-lg font-medium shrink-0"
                        >
                          Registered
                        </button>
                      ) : (
                        <button
                          onClick={() => handleJoinEvent(event.id)}
                          className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium rounded-lg shrink-0"
                        >
                          Register
                        </button>
                      )}
                    </div>

                    <p className="text-gray-300 text-xs mb-3 line-clamp-2">{event.description}</p>
                    
                    <div className="space-y-2 text-xs text-gray-400 mb-3">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-3 w-3" />
                        {eventDate.toLocaleDateString('en-AU', { 
                          weekday: 'short', 
                          month: 'short', 
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-3 w-3" />
                        {event.location_address}
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-3 w-3" />
                        {registrationCount}/{event.max_volunteers} volunteers
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 mb-3">
                      {event.social_tags?.slice(0, 3).map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-green-500/20 border border-green-500/40 text-green-400 text-xs rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="text-gray-500 text-xs">
                      by {event.organization_profiles.org_name}
                    </div>
                  </div>
                )
              })}

              {filteredEvents.length === 0 && !dbError && (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-indigo-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-8 h-8 text-indigo-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">No events found</h3>
                  <p className="text-gray-400 text-sm">Try adjusting your search or filters</p>
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
        </div>
      </div>

      {/* Desktop */}
      <div className="hidden md:block">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Link href="/">
                <button className="p-3 bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 text-white hover:bg-white/20 transition-all duration-300">
                  <ArrowLeft className="h-5 w-5" />
                </button>
              </Link>
              <h1 className="text-4xl font-bold text-white bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
                All Events
              </h1>
            </div>
            <UserProfile />
          </div>

          {/* Desktop Filters */}
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 mb-8 border border-white/20">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search events..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white/10 border-white/20 text-white placeholder-gray-400"
                />
              </div>

              {/* Location */}
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Location..."
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                  className="pl-10 bg-white/10 border-white/20 text-white placeholder-gray-400"
                />
              </div>

              {/* Time Filter */}
              <div className="relative">
                <Clock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <select
                  value={timeFilter}
                  onChange={(e) => setTimeFilter(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
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
                variant="outline"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                Clear Filters
              </Button>
            </div>

            {/* Tags Filter */}
            <div className="mt-4">
              <h3 className="text-white font-medium mb-2 flex items-center gap-2">
                <Tag className="h-4 w-4" />
                Filter by Skills/Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {allTags.map(tag => (
                  <button
                    key={tag}
                    onClick={() => handleTagToggle(tag)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                      selectedTags.includes(tag)
                        ? 'bg-green-500/40 border border-green-500/60 text-green-300'
                        : 'bg-white/10 border border-white/20 text-gray-300 hover:bg-white/20'
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
            {filteredEvents.map((event) => {
              const isRegistered = registeredEvents.has(event.id)
              const eventDate = new Date(event.start_datetime)
              const registrationCount = event._count?.registrations || 0
              
              return (
                <div key={event.id} className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl overflow-hidden hover:bg-white/20 transition-all duration-300">
                  {/* Event Image */}
                  <div className="h-32 bg-gradient-to-r from-indigo-500 to-blue-600 flex items-center justify-center text-white text-lg font-semibold relative">
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-white font-semibold text-lg leading-tight flex-1 mr-3">
                        {event.title}
                      </h3>
                      {isRegistered ? (
                        <button
                          onClick={() => handleLeaveEvent(event.id)}
                          className="px-4 py-2 bg-red-500/20 border border-red-500/40 text-red-400 text-sm rounded-lg font-medium hover:bg-red-500/30 transition-all"
                        >
                          Registered
                        </button>
                      ) : (
                        <button
                          onClick={() => handleJoinEvent(event.id)}
                          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-all duration-300"
                        >
                          Register
                        </button>
                      )}
                    </div>

                    <p className="text-gray-300 text-sm mb-4 line-clamp-3">{event.description}</p>
                    
                    <div className="space-y-3 text-sm text-gray-400 mb-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        {eventDate.toLocaleDateString('en-AU', { 
                          weekday: 'short', 
                          month: 'short', 
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        {event.location_address}
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        {registrationCount}/{event.max_volunteers} volunteers registered
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
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
                            className={`px-3 py-1 ${colors[index % colors.length]} text-xs rounded-full font-medium border`}
                          >
                            {tag}
                          </span>
                        )
                      })}
                    </div>

                    <div className="text-gray-500 text-sm">
                      by {event.organization_profiles.org_name}
                    </div>

                    {/* Progress bar */}
                    <div className="mt-4 bg-white/5 backdrop-blur rounded-lg p-3 border border-white/10">
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
                          className="bg-indigo-500 h-2 rounded-full transition-all duration-300" 
                          style={{ width: `${(registrationCount / event.max_volunteers) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}

            {filteredEvents.length === 0 && !dbError && (
              <div className="col-span-full text-center py-16">
                <div className="w-16 h-16 bg-indigo-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search className="w-8 h-8 text-indigo-400" />
                </div>
                <h3 className="text-2xl font-semibold text-white mb-3">No events found</h3>
                <p className="text-gray-400">Try adjusting your search criteria or filters</p>
              </div>
            )}

            {dbError && (
              <div className="col-span-full text-center py-16">
                <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-semibold text-white mb-3">Database Setup Required</h3>
                <p className="text-gray-400 mb-2">{dbError}</p>
                {dbError.includes('fix-events-access.sql') && (
                  <p className="text-cyan-400 text-sm mb-2">Run the fix-events-access.sql file in your project root</p>
                )}
                <p className="text-gray-500 text-sm">Please check the browser console for more details</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}