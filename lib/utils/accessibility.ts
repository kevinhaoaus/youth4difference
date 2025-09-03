// Accessibility utility functions

export const a11y = {
  // Announce to screen readers
  announce: (message: string, priority: 'polite' | 'assertive' = 'polite') => {
    const announcement = document.createElement('div')
    announcement.setAttribute('role', 'status')
    announcement.setAttribute('aria-live', priority)
    announcement.classList.add('sr-only')
    announcement.textContent = message
    
    document.body.appendChild(announcement)
    setTimeout(() => {
      document.body.removeChild(announcement)
    }, 1000)
  },

  // Keyboard navigation helpers
  handleKeyboardNavigation: (
    e: React.KeyboardEvent,
    options: {
      onEnter?: () => void
      onSpace?: () => void
      onEscape?: () => void
      onArrowUp?: () => void
      onArrowDown?: () => void
      onArrowLeft?: () => void
      onArrowRight?: () => void
    }
  ) => {
    switch (e.key) {
      case 'Enter':
        options.onEnter?.()
        break
      case ' ':
        e.preventDefault() // Prevent page scroll
        options.onSpace?.()
        break
      case 'Escape':
        options.onEscape?.()
        break
      case 'ArrowUp':
        e.preventDefault()
        options.onArrowUp?.()
        break
      case 'ArrowDown':
        e.preventDefault()
        options.onArrowDown?.()
        break
      case 'ArrowLeft':
        options.onArrowLeft?.()
        break
      case 'ArrowRight':
        options.onArrowRight?.()
        break
    }
  },

  // Generate unique IDs for form labels
  generateId: (prefix: string) => {
    return `${prefix}-${Math.random().toString(36).substr(2, 9)}`
  },

  // Skip link for keyboard navigation
  skipToMain: () => {
    const main = document.getElementById('main-content')
    if (main) {
      main.focus()
      main.scrollIntoView()
    }
  },

  // ARIA labels for common actions
  labels: {
    close: 'Close',
    menu: 'Menu',
    search: 'Search',
    filter: 'Filter options',
    sort: 'Sort options',
    previous: 'Previous',
    next: 'Next',
    loading: 'Loading content',
    error: 'Error occurred',
    success: 'Action successful',
    required: 'Required field',
  }
}

// Screen reader only CSS class
export const srOnly = 'absolute w-[1px] h-[1px] p-0 m-[-1px] overflow-hidden clip-[rect(0,0,0,0)] whitespace-nowrap border-0'