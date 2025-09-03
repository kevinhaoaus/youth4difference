import { Calendar, MapPin, Users, Heart, Building2 } from 'lucide-react'
import { Event } from '@/lib/types'
import { CATEGORIES } from '@/lib/constants'

interface EventCardProps {
  event: Event
  isRegistered?: boolean
  registrationCount?: number
  onRegister?: (eventId: string) => void
  onUnregister?: (eventId: string) => void
  variant?: 'mobile' | 'desktop' | 'feed'
}

const getCategoryBadge = (category?: string) => {
  return CATEGORIES[category as keyof typeof CATEGORIES] || CATEGORIES.other
}

export function EventCard({ 
  event, 
  isRegistered = false, 
  registrationCount, 
  onRegister, 
  onUnregister,
  variant = 'mobile' 
}: EventCardProps) {
  const eventDate = new Date(event.start_datetime)
  const regCount = registrationCount ?? event._count?.registrations ?? 0
  const categoryBadge = getCategoryBadge(event.category)
  const displayDescription = event.short_description || event.description

  const handleAction = () => {
    if (isRegistered && onUnregister) {
      onUnregister(event.id)
    } else if (!isRegistered && onRegister) {
      onRegister(event.id)
    }
  }

  if (variant === 'desktop') {
    return (
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden hover:border-zinc-700 transition-all duration-300">
        {/* Event Image with Placeholder */}
        <div className="relative h-48 bg-gradient-to-br from-zinc-800 to-zinc-900">
          {event.event_image_url ? (
            <img 
              src={event.event_image_url} 
              alt={event.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center">
                <Heart className="w-12 h-12 text-zinc-700 mx-auto mb-2" />
                <p className="text-zinc-600 text-sm">{event.category || 'community'}</p>
              </div>
            </div>
          )}
          
          {/* Favorite Button */}
          <button className="absolute top-3 right-3 p-2 bg-black/50 backdrop-blur rounded-full hover:bg-black/70 transition-colors">
            <Heart className="w-5 h-5 text-white" />
          </button>
        </div>
        
        <div className="p-5">
          {/* Title and Category */}
          <div className="mb-3">
            <h3 className="text-white text-xl font-semibold mb-2">
              {event.title}
            </h3>
            {event.category && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-zinc-800 text-zinc-400 text-xs rounded-full">
                {categoryBadge.icon} {event.category}
              </span>
            )}
          </div>

          {/* Description */}
          <p className="text-zinc-400 text-sm mb-4 line-clamp-2">
            {displayDescription || 'Join us for this amazing volunteering opportunity!'}
          </p>
          
          {/* Volunteer Roles */}
          {event.volunteer_roles && event.volunteer_roles.length > 0 && (
            <div className="mb-4">
              <p className="text-xs font-medium text-zinc-500 mb-2">Volunteer Roles:</p>
              <div className="flex flex-wrap gap-1">
                {event.volunteer_roles.slice(0, 3).map((role, index) => (
                  <span key={index} className="text-xs bg-zinc-800 text-zinc-400 px-2 py-1 rounded">
                    {role}
                  </span>
                ))}
                {event.volunteer_roles.length > 3 && (
                  <span className="text-xs text-zinc-500">+{event.volunteer_roles.length - 3} more</span>
                )}
              </div>
            </div>
          )}
          
          {/* Event Details */}
          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-3 text-zinc-400 text-sm">
              <Calendar className="h-4 w-4 text-zinc-500" />
              <span>
                {eventDate.toLocaleDateString('en-AU', { 
                  weekday: 'short', 
                  day: 'numeric',
                  month: 'short'
                })} at {eventDate.toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </div>
            <div className="flex items-center gap-3 text-zinc-400 text-sm">
              <MapPin className="h-4 w-4 text-zinc-500" />
              <span>{event.location_address}</span>
            </div>
            <div className="flex items-center gap-3 text-zinc-400 text-sm">
              <Users className="h-4 w-4 text-zinc-500" />
              <span>{regCount}/{event.max_volunteers} volunteers registered</span>
            </div>
          </div>

          {/* Tags */}
          {event.social_tags && event.social_tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-4">
              {event.social_tags.slice(0, 3).map((tag, index) => (
                <span
                  key={index}
                  className="text-xs bg-green-500/10 text-green-400 px-2 py-1 rounded-full border border-green-500/20"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Organization Info with Logo */}
          <div className="flex items-center gap-3 p-3 bg-zinc-800/50 rounded-lg mb-4">
            <div className="w-10 h-10 bg-zinc-700 rounded-full flex items-center justify-center flex-shrink-0">
              {event.organization_profiles?.logo_url ? (
                <img 
                  src={event.organization_profiles.logo_url}
                  alt={event.organization_profiles?.org_name}
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <Building2 className="w-5 h-5 text-zinc-400" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-white font-medium truncate">
                {event.organization_profiles?.org_name || 'Unknown Organization'}
              </p>
              {event.organization_profiles?.contact_email && (
                <p className="text-xs text-zinc-500 truncate">
                  {event.organization_profiles.contact_email}
                </p>
              )}
            </div>
          </div>

          {/* Registration Progress */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-zinc-400">
                Registration: {regCount}/{event.max_volunteers}
              </span>
              <span className="text-xs text-zinc-500">
                {Math.round((regCount / event.max_volunteers) * 100)}%
              </span>
            </div>
            <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-green-500 to-green-400 rounded-full transition-all duration-300" 
                style={{ width: `${Math.min((regCount / event.max_volunteers) * 100, 100)}%` }}
              />
            </div>
          </div>

          {/* Register Button */}
          <button
            onClick={handleAction}
            className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
              isRegistered 
                ? 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                : 'bg-white text-black hover:bg-zinc-200'
            }`}
          >
            {isRegistered ? '✓ Registered' : 'Register'}
          </button>
        </div>
      </div>
    )
  }

  if (variant === 'feed') {
    return (
      <div className="card-base card-hover card-interactive overflow-hidden">
        {/* Event Image */}
        <div className="h-24 gradient-event flex items-center justify-center text-white text-lg font-semibold relative">
          <div className="icon-container icon-container-sm">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
        </div>
        
        <div className="p-4 space-y-3">
          <div className="flex justify-between items-start">
            <h3 className="text-primary leading-tight text-sm md:text-base">
              {event.title}
            </h3>
            <button
              onClick={handleAction}
              className={`btn-small shrink-0 transition-all duration-300 ${
                isRegistered 
                  ? 'btn-secondary'
                  : 'btn-primary'
              }`}
            >
              {isRegistered ? 'Registered' : 'Register'}
            </button>
          </div>

          <p className="text-secondary text-xs line-clamp-2 md:text-sm">{event.description}</p>
          
          <div className="flex flex-col gap-2 text-xs text-muted mb-3 md:text-sm">
            <span className="flex items-center gap-2">
              <Calendar className="h-3 w-3" />
              {eventDate.toLocaleDateString('en-AU', { 
                weekday: 'short', 
                month: 'short', 
                day: 'numeric' 
              })} {eventDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
            </span>
            <span className="flex items-center gap-2">
              <MapPin className="h-3 w-3" />
              {event.location_address}
            </span>
            <span className="flex items-center gap-2">
              <Users className="h-3 w-3" />
              {regCount}/{event.max_volunteers} volunteers
            </span>
          </div>

          <div className="text-subtle text-xs">
            by {event.organization_profiles?.org_name || 'Unknown'}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="card-base p-4">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-primary text-sm leading-tight flex-1 mr-2">
          {event.title}
        </h3>
        <button
          onClick={handleAction}
          className={`btn-small shrink-0 ${
            isRegistered 
              ? 'btn-secondary'
              : 'btn-primary'
          }`}
        >
          {isRegistered ? 'Registered' : 'Register'}
        </button>
      </div>

      <p className="text-secondary text-xs mb-3 line-clamp-2">{event.description}</p>
      
      <div className="space-y-2 text-xs text-muted mb-3">
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
          {regCount}/{event.max_volunteers} volunteers
        </div>
      </div>

      {/* Tags */}
      {event.social_tags && event.social_tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {event.social_tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="tag-base tag-green px-2 py-1 text-xs"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="text-subtle text-xs">
        by {event.organization_profiles?.org_name || 'Unknown'}
      </div>
    </div>
  )
}