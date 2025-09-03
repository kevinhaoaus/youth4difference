import Link from 'next/link'
import { Button } from '@/components/ui/button'
import UserProfile from '@/components/ui/user-profile'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-black">
      {/* Mobile View */}
      <div className="md:hidden min-h-screen flex flex-col">
        {/* Clean Mobile Header */}
        <div className="p-4 flex justify-between items-center border-b border-zinc-900">
          <h2 className="text-lg font-bold text-white">
            VolunteerVibe
          </h2>
          <UserProfile />
        </div>

        {/* Mobile Content */}
        <div className="flex-1 flex flex-col justify-center items-center p-6 text-center">
          <h1 className="text-white text-4xl font-bold mb-4 tracking-tight">
            VolunteerVibe
          </h1>
          <p className="text-zinc-400 text-base mb-12 leading-relaxed max-w-sm">
            Connect with meaningful volunteer opportunities.
            Find events that match your interests.
          </p>
          
          <div className="w-full space-y-3 max-w-xs">
            <Link href="/auth/login" className="block">
              <button className="w-full p-4 bg-white text-black font-semibold 
                               rounded transition-opacity hover:opacity-90">
                Student Login
              </button>
            </Link>
            <Link href="/auth/org-login" className="block">
              <button className="w-full p-4 bg-transparent border border-zinc-800 text-white font-semibold 
                               rounded hover:bg-zinc-900 transition-colors">
                Organization Login
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Desktop View */}
      <div className="hidden md:block">
        <nav className="p-6 flex justify-between items-center border-b border-zinc-900">
          <div className="text-2xl font-bold text-white">
            VolunteerVibe
          </div>
          <div className="flex items-center gap-4">
            <Link href="/events">
              <Button variant="ghost" className="text-zinc-400 hover:text-white hover:bg-zinc-900">Browse Events</Button>
            </Link>
            <UserProfile />
          </div>
        </nav>

        <main className="container mx-auto px-6 py-24 max-w-5xl">
          <div className="text-center">
            <h1 className="text-6xl font-bold text-white mb-6 tracking-tight">
              Volunteer with Purpose
            </h1>
            <p className="text-xl text-zinc-400 mb-12 leading-relaxed max-w-2xl mx-auto">
              Discover meaningful volunteer opportunities in your community. 
              Connect with causes that matter to you.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-24">
              <Link href="/auth/login">
                <Button size="lg" className="bg-white text-black hover:bg-zinc-200 text-base px-8 py-4 font-semibold">
                  Get Started
                </Button>
              </Link>
              <Link href="/auth/org-login">
                <Button size="lg" variant="outline" className="border-zinc-800 text-white hover:bg-zinc-900 text-base px-8 py-4 font-semibold">
                  For Organizations
                </Button>
              </Link>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center p-8 bg-zinc-900 rounded border border-zinc-800">
                <div className="w-12 h-12 bg-zinc-800 rounded flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2 text-white">Find Local Events</h3>
                <p className="text-zinc-400 text-sm">Discover volunteer opportunities in your area</p>
              </div>
              <div className="text-center p-8 bg-zinc-900 rounded border border-zinc-800">
                <div className="w-12 h-12 bg-zinc-800 rounded flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13.5 7a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2 text-white">Build Community</h3>
                <p className="text-zinc-400 text-sm">Connect with like-minded volunteers</p>
              </div>
              <div className="text-center p-8 bg-zinc-900 rounded border border-zinc-800">
                <div className="w-12 h-12 bg-zinc-800 rounded flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2 text-white">Make an Impact</h3>
                <p className="text-zinc-400 text-sm">Create positive change in your community</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}