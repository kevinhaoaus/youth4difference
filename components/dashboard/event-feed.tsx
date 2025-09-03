'use client'

import { memo } from 'react'
import { LoadingSkeleton } from '@/components/ui/loading-skeleton'
import { EventCard } from '@/components/ui/event-card'
import { useEvents } from '@/lib/hooks/useEvents'

function EventFeed({ userId }: { userId: string }) {
  const { 
    events, 
    loading, 
    isRegistered, 
    registerForEvent, 
    unregisterFromEvent 
  } = useEvents()

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
            isRegistered={isRegistered(event.id)}
            onRegister={registerForEvent}
            onUnregister={unregisterFromEvent}
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