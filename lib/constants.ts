// Application constants and messages
export const MESSAGES = {
  // Success messages
  SUCCESS: {
    LOGIN: 'Welcome back!',
    SIGNUP: 'Account created successfully!',
    EVENT_CREATED: 'Event created successfully!',
    EVENT_REGISTERED: 'Successfully registered for event!',
    EVENT_UNREGISTERED: 'Unregistered from event',
    EVENT_DELETED: 'Event deleted successfully',
    EVENT_LEFT: 'Left event successfully',
  },
  
  // Error messages
  ERROR: {
    LOGIN: 'Invalid credentials. Please try again.',
    SIGNUP: 'Failed to create account. Please try again.',
    GENERIC: 'An error occurred. Please try again.',
    NOT_AUTHENTICATED: 'Please login to continue',
    NOT_AUTHORIZED: 'You are not authorized to perform this action',
    LOAD_EVENTS: 'Failed to load events',
    REGISTER_EVENT: 'Failed to register for event',
    UNREGISTER_EVENT: 'Failed to unregister from event',
    CREATE_EVENT: 'Failed to create event',
    DELETE_EVENT: 'Failed to delete event',
    DATABASE_CONNECTION: 'Database connection failed. Please check your connection.',
    DATABASE_PERMISSION: 'Database permission error. Please contact support.',
    DATABASE_MISSING: 'Database tables missing. Please run setup script.',
    TIMEOUT: 'Loading timeout. Please refresh the page.',
  }
} as const

export const ROUTES = {
  HOME: '/',
  LOGIN: '/auth/login',
  ORG_LOGIN: '/auth/org-login',
  DASHBOARD: '/dashboard',
  ORG_DASHBOARD: '/org/dashboard',
  EVENTS: '/events',
  CREATE_EVENT: '/org/create-event',
} as const

export const TIMEOUTS = {
  REDIRECT: 1000,
  LOADING: 10000,
} as const

export const CATEGORIES = {
  environment: { icon: '🌱', color: 'bg-green-900 text-green-300', label: 'Environment' },
  education: { icon: '📚', color: 'bg-blue-900 text-blue-300', label: 'Education' },
  community: { icon: '🏘️', color: 'bg-purple-900 text-purple-300', label: 'Community' },
  health: { icon: '❤️', color: 'bg-red-900 text-red-300', label: 'Health' },
  animals: { icon: '🐾', color: 'bg-yellow-900 text-yellow-300', label: 'Animals' },
  arts: { icon: '🎨', color: 'bg-pink-900 text-pink-300', label: 'Arts' },
  sports: { icon: '⚽', color: 'bg-orange-900 text-orange-300', label: 'Sports' },
  other: { icon: '📌', color: 'bg-gray-900 text-gray-300', label: 'Other' },
} as const