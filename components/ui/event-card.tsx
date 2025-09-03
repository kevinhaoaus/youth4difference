import { Calendar, MapPin, Users } from 'lucide-react'

interface EventCardProps {
  event: {
    id: string
    title: string
    description: string
    short_description?: string
    category?: string
    volunteer_roles?: string[]
    location_address: string
    start_datetime: string
    max_volunteers: number
    social_tags?: string[]
    organization_profiles: {
      org_name: string
      contact_email?: string
      contact_phone?: string
    }
    _count?: {
      registrations: number
    }
  }
  isRegistered?: boolean
  registrationCount?: number
  onRegister?: (eventId: string) => void
  onUnregister?: (eventId: string) => void
  variant?: 'mobile' | 'desktop' | 'feed'
}

const getCategoryBadge = (category?: string) => {
  const badges: { [key: string]: { icon: string; color: string } } = {
    environment: { icon: '🌱', color: 'bg-green-900 text-green-300' },
    education: { icon: '📚', color: 'bg-blue-900 text-blue-300' },
    community: { icon: '🏘️', color: 'bg-purple-900 text-purple-300' },
    health: { icon: '❤️', color: 'bg-red-900 text-red-300' },
    animals: { icon: '🐾', color: 'bg-yellow-900 text-yellow-300' },
    arts: { icon: '🎨', color: 'bg-pink-900 text-pink-300' },
    sports: { icon: '⚽', color: 'bg-orange-900 text-orange-300' },
    other: { icon: '📌', color: 'bg-gray-900 text-gray-300' }
  }
  return badges[category || 'other'] || badges.other
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
      <div className="card-base card-hover overflow-hidden">
        {/* Event Image */}
        <div className="h-32 gradient-event flex items-center justify-center text-white text-lg font-semibold relative">
          <div className="icon-container icon-container-md">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
        </div>
        
        <div className="p-6">
          <div className="flex justify-between items-start mb-2">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-primary text-lg leading-tight">
                  {event.title}
                </h3>
                {event.category && (
                  <span className={`text-xs px-2 py-1 rounded-full ${categoryBadge.color}`}>
                    {categoryBadge.icon} {event.category}
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={handleAction}
              className={`text-sm ${
                isRegistered 
                  ? 'btn-secondary'
                  : 'btn-primary'
              }`}
            >
              {isRegistered ? 'Registered' : 'Register'}
            </button>
          </div>

          <p className="text-secondary text-sm mb-4 line-clamp-3">{displayDescription}</p>
          
          {event.volunteer_roles && event.volunteer_roles.length > 0 && (
            <div className="mb-3">
              <p className="text-xs font-semibold text-muted mb-1">Volunteer Roles:</p>
              <div className="flex flex-wrap gap-1">
                {event.volunteer_roles.slice(0, 3).map((role, index) => (
                  <span key={index} className="text-xs bg-muted/10 px-2 py-1 rounded">
                    {role}
                  </span>
                ))}
                {event.volunteer_roles.length > 3 && (
                  <span className="text-xs text-muted">+{event.volunteer_roles.length - 3} more</span>
                )}
              </div>
            </div>
          )}
          
          <div className="space-y-3 text-sm text-muted mb-4">
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
              {regCount}/{event.max_volunteers} volunteers registered
            </div>
          </div>

          {/* Tags */}
          {event.social_tags && event.social_tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {event.social_tags.slice(0, 3).map((tag, index) => {
                const tagStyles = [
                  'tag-pink',
                  'tag-cyan',
                  'tag-purple',
                  'tag-green'
                ]
                return (
                  <span
                    key={index}
                    className={`tag-base ${tagStyles[index % tagStyles.length]}`}
                  >
                    {tag}
                  </span>
                )
              })}
            </div>
          )}

          <div className="text-subtle text-sm mb-2">
            by <span className="font-semibold">{event.organization_profiles.org_name}</span>
          </div>
          
          {(event.organization_profiles?.contact_email || event.organization_profiles?.contact_phone) && (
            <div className="text-xs text-muted mb-4 space-y-1">
              {event.organization_profiles.contact_email && (
                <div>📧 {event.organization_profiles.contact_email}</div>
              )}
              {event.organization_profiles.contact_phone && (
                <div>📱 {event.organization_profiles.contact_phone}</div>
              )}
            </div>
          )}

          {/* Progress bar */}
          <div className="progress-container">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-primary">
                Registration: {regCount}/{event.max_volunteers}
              </span>
              <span className="text-xs text-muted">
                {Math.round((regCount / event.max_volunteers) * 100)}%
              </span>
            </div>
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${(regCount / event.max_volunteers) * 100}%` }}
              />
            </div>
          </div>
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
            by {event.organization_profiles.org_name}
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
        by {event.organization_profiles.org_name}
      </div>
    </div>
  )
}