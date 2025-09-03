// Performance monitoring and optimization utilities

export const performance = {
  // Measure component render time
  measureRender: (componentName: string) => {
    if (typeof window === 'undefined') return

    const startTime = window.performance.now()
    
    return () => {
      const endTime = window.performance.now()
      const renderTime = endTime - startTime
      
      if (renderTime > 16.67) { // More than one frame (60fps)
        console.warn(`${componentName} took ${renderTime.toFixed(2)}ms to render`)
      }
    }
  },

  // Debounce expensive operations
  debounce: <T extends (...args: any[]) => any>(
    func: T,
    delay: number
  ): ((...args: Parameters<T>) => void) => {
    let timeoutId: NodeJS.Timeout

    return (...args: Parameters<T>) => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => func(...args), delay)
    }
  },

  // Throttle frequent events
  throttle: <T extends (...args: any[]) => any>(
    func: T,
    limit: number
  ): ((...args: Parameters<T>) => void) => {
    let inThrottle: boolean

    return (...args: Parameters<T>) => {
      if (!inThrottle) {
        func(...args)
        inThrottle = true
        setTimeout(() => (inThrottle = false), limit)
      }
    }
  },

  // Lazy load images
  lazyLoadImage: (imageSrc: string, placeholder?: string) => {
    if (typeof window === 'undefined') return imageSrc

    const img = new Image()
    img.src = imageSrc

    return placeholder || imageSrc
  },

  // Check if element is in viewport
  isInViewport: (element: HTMLElement): boolean => {
    const rect = element.getBoundingClientRect()
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    )
  },

  // Request idle callback wrapper
  whenIdle: (callback: () => void) => {
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(callback)
    } else {
      setTimeout(callback, 1)
    }
  },

  // Prefetch data for next likely action
  prefetch: async (url: string) => {
    if ('link' in document.createElement('link')) {
      const link = document.createElement('link')
      link.rel = 'prefetch'
      link.href = url
      document.head.appendChild(link)
    }
  },

  // Memory leak prevention
  cleanup: (cleanupFunctions: (() => void)[]) => {
    cleanupFunctions.forEach(fn => {
      try {
        fn()
      } catch (error) {
        console.error('Cleanup error:', error)
      }
    })
  }
}