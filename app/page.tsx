import Link from 'next/link'
import { Button } from '@/components/ui/button'

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

            {/* App Content */}
            <div className="h-[calc(100%-44px)] bg-gradient-to-b from-slate-900/50 to-black overflow-y-auto flex flex-col justify-center items-center p-6 text-center">
              <h1 className="text-white text-3xl font-black bg-gradient-to-r from-pink-400 via-cyan-400 to-blue-400 
                           bg-clip-text text-transparent animate-pulse mb-4">
                VolunteerVibe
              </h1>
              <p className="text-gray-300 text-sm mb-8 leading-relaxed">
                Make volunteering social & fun.<br />
                Connect with events near you.
              </p>
              
              <div className="w-full space-y-4 max-w-xs">
                <Link href="/auth/login" className="block">
                  <button className="w-full p-4 bg-gradient-to-r from-pink-500 to-cyan-500 text-white font-semibold 
                                   rounded-2xl hover:scale-105 transition-all duration-300 animate-glow">
                    Join as Student ✨
                  </button>
                </Link>
                <Link href="/auth/org-login" className="block">
                  <button className="w-full p-4 bg-white/10 backdrop-blur-xl border border-white/20 text-white font-semibold 
                                   rounded-2xl hover:bg-white/20 transition-all duration-300">
                    I'm an Organization
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
          <div className="text-3xl font-black bg-gradient-to-r from-pink-400 via-cyan-400 to-blue-400 
                         bg-clip-text text-transparent">
            VolunteerVibe
          </div>
          <div className="space-x-4">
            <Link href="/auth/login">
              <Button variant="ghost" className="text-white hover:bg-white/10">Student Login</Button>
            </Link>
            <Link href="/auth/org-login">
              <Button variant="ghost" className="text-white hover:bg-white/10">Organization Login</Button>
            </Link>
          </div>
        </nav>

        <main className="container mx-auto px-6 py-12">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-6xl font-black text-white mb-6">
              Make Volunteering 
              <span className="bg-gradient-to-r from-pink-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent"> 
                Social & Fun
              </span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              Connect with friends, discover local events, and make a difference in your community. 
              Volunteering has never been this easy.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Link href="/auth/login">
                <Button size="lg" className="bg-gradient-to-r from-pink-500 to-cyan-500 hover:scale-105 transition-all duration-300 text-lg px-8 py-4">
                  Join as Student ✨
                </Button>
              </Link>
              <Link href="/auth/org-login">
                <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10 text-lg px-8 py-4">
                  Post Events (Organizations)
                </Button>
              </Link>
            </div>

            <div className="grid md:grid-cols-4 gap-8 mt-16">
              <div className="text-center p-6 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10">
                <div className="text-4xl mb-4">📍</div>
                <h3 className="text-lg font-semibold mb-2 text-white">Find Nearby Events</h3>
                <p className="text-gray-300 text-sm">Discover volunteering opportunities within walking distance</p>
              </div>
              <div className="text-center p-6 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10">
                <div className="text-4xl mb-4">👥</div>
                <h3 className="text-lg font-semibold mb-2 text-white">Connect with Purpose</h3>
                <p className="text-gray-300 text-sm">Meet like-minded people while making an impact</p>
              </div>
              <div className="text-center p-6 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10">
                <div className="text-4xl mb-4">📅</div>
                <h3 className="text-lg font-semibold mb-2 text-white">One-Click Signup</h3>
                <p className="text-gray-300 text-sm">No long commitments, just show up and help</p>
              </div>
              <div className="text-center p-6 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10">
                <div className="text-4xl mb-4">❤️</div>
                <h3 className="text-lg font-semibold mb-2 text-white">Make Impact</h3>
                <p className="text-gray-300 text-sm">Every small action creates positive change</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}