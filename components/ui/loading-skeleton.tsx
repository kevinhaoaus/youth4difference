interface LoadingSkeletonProps {
  variant?: 'card' | 'list' | 'desktop'
  count?: number
}

export function LoadingSkeleton({ variant = 'card', count = 3 }: LoadingSkeletonProps) {
  if (variant === 'desktop') {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="card-base p-6 animate-pulse">
            <div className="h-6 skeleton-base mb-3"></div>
            <div className="h-4 skeleton-base mb-2"></div>
            <div className="h-3 skeleton-base w-2/3"></div>
          </div>
        ))}
      </div>
    )
  }

  if (variant === 'list') {
    return (
      <div className="space-y-4 md:grid md:grid-cols-2 md:gap-6 lg:grid-cols-3 md:space-y-0">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="card-base p-4 animate-pulse">
            <div className="h-16 skeleton-base rounded-xl mb-3"></div>
            <div className="h-4 skeleton-base mb-2"></div>
            <div className="h-3 skeleton-base w-2/3"></div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="p-6 space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="card-base p-4 animate-pulse">
          <div className="h-6 skeleton-base mb-3"></div>
          <div className="h-4 skeleton-base mb-2"></div>
          <div className="h-3 skeleton-base w-2/3"></div>
        </div>
      ))}
    </div>
  )
}