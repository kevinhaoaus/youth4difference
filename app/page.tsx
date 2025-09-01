import Link from 'next/link'
import { Button } from '@/components/ui/button'
import UserProfile from '@/components/ui/user-profile'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden">
      {/* Mobile: Phone Frame Design */}
      <div className="md:hidden flex items-center justify-center min-h-screen p-4">
        <div className="w-[375px] h-[812px] bg-black rounded-[40px] p-2 shadow-2xl shadow-purple-500/20">
          <div className="w-full h-full bg-gradient-to-b from-slate-900 to-black rounded-[32px] overflow-hidden relative">
            
            {/* Status Bar */}
            <div className="h-11 bg-black/90 flex justify-between items-center px-5 text-white text-sm font-semibold">
              <span>9:41</span>
              <span>🔋 100%</span>
            </div>

            {/* Mobile Header with User Profile */}
            <div className="p-4 flex justify-between items-center border-b border-white/10">
              <h2 className="text-lg font-bold text-white bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
                VolunteerVibe
              </h2>
              <UserProfile />
            </div>

            {/* App Content */}
            <div className="flex-1 bg-gradient-to-b from-slate-900/50 to-black overflow-y-auto flex flex-col justify-center items-center p-6 text-center">
              <h1 className="text-white text-3xl font-bold bg-gradient-to-r from-blue-400 to-indigo-500 
                           bg-clip-text text-transparent mb-4">
                VolunteerVibe
              </h1>
              <p className="text-gray-300 text-sm mb-8 leading-relaxed">
                Connect with meaningful volunteer opportunities.<br />
                Find events that match your interests.
              </p>
              
              <div className="w-full space-y-4 max-w-xs">
                <Link href="/auth/login" className="block">
                  <button className="w-full p-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium 
                                   rounded-xl transition-all duration-300">
                    Student Login
                  </button>
                </Link>
                <Link href="/auth/org-login" className="block">
                  <button className="w-full p-4 bg-white/10 backdrop-blur-xl border border-white/20 text-white font-medium 
                                   rounded-xl hover:bg-white/20 transition-all duration-300">
                    Organization Login
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop: Full Website Layout */}
      <div className="hidden md:block">
        <nav className="p-6 flex justify-between items-center">
          <div className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-indigo-500 
                         bg-clip-text text-transparent">
            VolunteerVibe
          </div>
          <div className="flex items-center gap-4">
            <Link href="/events">
              <Button variant="ghost" className="text-white hover:bg-white/10">Browse Events</Button>
            </Link>
            <UserProfile />
          </div>
        </nav>

        <main className="container mx-auto px-6 py-12">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-6xl font-bold text-white mb-6">
              Volunteer with 
              <span className="bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent"> 
                Purpose
              </span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              Discover meaningful volunteer opportunities in your community. 
              Connect with causes that matter to you.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Link href="/auth/login">
                <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-lg px-8 py-4">
                  Get Started
                </Button>
              </Link>
              <Link href="/auth/org-login">
                <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10 text-lg px-8 py-4">
                  For Organizations
                </Button>
              </Link>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mt-16">
              <div className="text-center p-8 bg-white/5 backdrop-blur-xl rounded-xl border border-white/10">
                <div className="w-16 h-16 bg-indigo-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-white">Find Local Events</h3>
                <p className="text-gray-300">Discover volunteer opportunities in your area</p>
              </div>
              <div className="text-center p-8 bg-white/5 backdrop-blur-xl rounded-xl border border-white/10">
                <div className="w-16 h-16 bg-indigo-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-white">Build Community</h3>
                <p className="text-gray-300">Connect with like-minded volunteers</p>
              </div>
              <div className="text-center p-8 bg-white/5 backdrop-blur-xl rounded-xl border border-white/10">
                <div className="w-16 h-16 bg-indigo-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-white">Make an Impact</h3>
                <p className="text-gray-300">Create positive change in your community</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}