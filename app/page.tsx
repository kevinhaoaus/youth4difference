import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden">
      {/* Phone Frame Container */}
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="w-[375px] h-[812px] bg-black rounded-[40px] p-2 shadow-2xl shadow-purple-500/20">
          <div className="w-full h-full bg-gradient-to-b from-slate-900 to-black rounded-[32px] overflow-hidden relative">
            
            {/* Status Bar */}
            <div className="h-11 bg-black/90 flex justify-between items-center px-5 text-white text-sm font-semibold">
              <span>9:41</span>
              <span>🔋 100%</span>
            </div>

            {/* App Content */}
            <div className="h-[calc(100%-44px-83px)] bg-gradient-to-b from-slate-900/50 to-black overflow-y-auto">
              
              {/* Header */}
              <div className="p-5 pb-3 bg-white/5 backdrop-blur-xl border-b border-white/10">
                <h1 className="text-white text-3xl font-black bg-gradient-to-r from-pink-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent animate-pulse bg-[length:200%_200%]">
                  VolunteerVibe
                </h1>
                <div className="mt-3 p-3 bg-white/10 backdrop-blur-xl rounded-full border border-white/20 flex items-center gap-2 text-white">
                  <div className="w-5 h-5 bg-gradient-to-r from-pink-400 to-cyan-400 rounded-full flex items-center justify-center text-xs">
                    📍
                  </div>
                  <span className="text-sm">Sydney, 5km radius</span>
                </div>
              </div>

              {/* Welcome Section */}
              <div className="p-5 text-center">
                <h2 className="text-white text-2xl font-bold mb-3">
                  Make volunteering 
                  <span className="bg-gradient-to-r from-pink-400 to-cyan-400 bg-clip-text text-transparent">social & fun</span>
                </h2>
                <p className="text-gray-300 text-sm mb-6 leading-relaxed">
                  Connect with friends, discover local events, and make a difference. 
                  Volunteering has never been this lit! ✨
                </p>
                
                <div className="space-y-3">
                  <Link href="/auth/login">
                    <button className="w-full py-3 bg-gradient-to-r from-pink-500 to-cyan-500 text-white font-semibold rounded-full hover:scale-105 transition-all duration-300 shadow-lg">
                      Join as Student 🚀
                    </button>
                  </Link>
                  <Link href="/auth/org-login">
                    <button className="w-full py-3 bg-white/10 backdrop-blur-xl border border-white/20 text-white font-semibold rounded-full hover:bg-white/20 transition-all duration-300">
                      Post Events (Organizations)
                    </button>
                  </Link>
                </div>
              </div>

              {/* Preview Cards */}
              <div className="px-5 pb-5">
                <h3 className="text-white text-lg font-bold mb-3 flex items-center gap-2">
                  🔥 What's Happening
                </h3>
                
                <div className="space-y-3">
                  <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4 hover:bg-white/20 transition-all duration-300 cursor-pointer">
                    <div className="h-16 bg-gradient-to-r from-pink-400 via-cyan-400 to-blue-400 rounded-xl mb-3 flex items-center justify-center text-white text-lg font-bold">
                      🌊 Beach Cleanup
                    </div>
                    <div className="text-white font-semibold mb-1">Bondi Beach Cleanup Crew</div>
                    <div className="flex justify-between items-center text-xs text-gray-400 mb-2">
                      <span>📅 Today 2pm</span>
                      <span>🚶‍♀️ 12 min walk</span>
                    </div>
                    <div className="flex gap-2 mb-3">
                      <span className="px-2 py-1 bg-pink-500/20 border border-pink-500/40 text-pink-400 text-xs rounded-full font-semibold">
                        🍕 Food After
                      </span>
                      <span className="px-2 py-1 bg-cyan-500/20 border border-cyan-500/40 text-cyan-400 text-xs rounded-full font-semibold">
                        🌊 Ocean Vibes
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="text-cyan-400 text-xs flex items-center gap-1">
                        <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                        2 friends going
                      </div>
                      <button className="px-4 py-2 bg-gradient-to-r from-pink-500 to-cyan-500 text-white text-xs font-semibold rounded-full hover:scale-105 transition-all duration-300">
                        Join Squad
                      </button>
                    </div>
                  </div>

                  <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4">
                    <div className="h-16 bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 rounded-xl mb-3 flex items-center justify-center text-white text-lg font-bold">
                      🎪 Fun Run
                    </div>
                    <div className="text-white font-semibold mb-1">UNSW Charity Fun Run</div>
                    <div className="flex justify-between items-center text-xs text-gray-400 mb-2">
                      <span>📅 Sat 10am</span>
                      <span>🚇 Bus + 5min</span>
                    </div>
                    <div className="flex gap-2 mb-3">
                      <span className="px-2 py-1 bg-purple-500/20 border border-purple-500/40 text-purple-400 text-xs rounded-full font-semibold">
                        ✨ Free Merch
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="text-cyan-400 text-xs flex items-center gap-1">
                        <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                        Emma signed up!
                      </div>
                      <button className="px-4 py-2 bg-gradient-to-r from-pink-500 to-cyan-500 text-white text-xs font-semibold rounded-full">
                        Join Squad
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Navigation */}
            <div className="h-[83px] bg-black/95 backdrop-blur-xl border-t border-white/10 flex justify-around items-center pb-5">
              <div className="flex flex-col items-center text-cyan-400">
                <div className="w-7 h-7 bg-current rounded-lg mb-1"></div>
                <div className="text-xs font-semibold">Events</div>
              </div>
              <div className="flex flex-col items-center text-gray-600">
                <div className="w-7 h-7 bg-current rounded-lg mb-1 relative">
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-pink-500 rounded-full border-2 border-black"></div>
                </div>
                <div className="text-xs font-semibold">Friends</div>
              </div>
              <div className="flex flex-col items-center text-gray-600">
                <div className="w-7 h-7 bg-current rounded-lg mb-1"></div>
                <div className="text-xs font-semibold">My Vibe</div>
              </div>
              <div className="flex flex-col items-center text-gray-600">
                <div className="w-7 h-7 bg-current rounded-lg mb-1"></div>
                <div className="text-xs font-semibold">Profile</div>
              </div>
            </div>

            {/* Floating Action Button */}
            <div className="absolute bottom-24 right-5 w-14 h-14 bg-gradient-to-r from-pink-500 to-cyan-500 rounded-full flex items-center justify-center text-white text-xl font-bold cursor-pointer shadow-2xl hover:scale-110 transition-all duration-300 animate-pulse">
              +
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}