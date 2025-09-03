import { ReactNode } from 'react'

interface PageBackgroundProps {
  children: ReactNode
  variant?: 'mobile' | 'desktop' | 'full'
}

export function PageBackground({ children, variant = 'full' }: PageBackgroundProps) {
  if (variant === 'mobile') {
    return (
      <div className="min-h-screen gradient-primary">
        <div className="md:hidden flex items-center justify-center min-h-screen p-4">
          <div className="mobile-phone-frame">
            <div className="mobile-phone-content gradient-primary">
              {children}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (variant === 'desktop') {
    return (
      <div className="hidden md:block">
        {children}
      </div>
    )
  }

  return (
    <div className="min-h-screen gradient-primary">
      {children}
    </div>
  )
}