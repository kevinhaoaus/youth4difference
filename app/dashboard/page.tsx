import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import EventFeed from '@/components/dashboard/event-feed'
import DashboardHeader from '@/components/dashboard/header'

export default async function DashboardPage() {
  const supabase = await createClient()
  
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error || !user) {
    redirect('/auth/login')
  }

  // Get user type - if doesn't exist, assume student and create it
  let { data: userData } = await supabase
    .from('users')
    .select('user_type')
    .eq('id', user.id)
    .single()

  // If user record doesn't exist, create it as student
  if (!userData) {
    const { error: insertError } = await supabase
      .from('users')
      .insert({
        id: user.id,
        email: user.email!,
        user_type: 'student'
      })
    
    if (!insertError) {
      userData = { user_type: 'student' }
    }
  }

  if (userData?.user_type !== 'student') {
    redirect('/org/dashboard')
  }

  // Get student profile
  const { data: profile } = await supabase
    .from('student_profiles')
    .select('*')
    .eq('user_id', user.id)
    .single()

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-black overflow-hidden">
      {/* Mobile: Phone Frame Container */}
      <div className="md:hidden flex items-center justify-center min-h-screen p-4">
        <div className="w-[375px] h-[812px] bg-black rounded-[40px] p-2 shadow-2xl shadow-purple-500/20">
          <div className="w-full h-full bg-gradient-to-b from-slate-900 to-black rounded-[32px] overflow-hidden relative">
            
            <DashboardHeader user={user} profile={profile} />
            
            {/* App Content */}
            <div className="h-[calc(100%-200px-83px)] bg-gradient-to-b from-slate-900/50 to-black overflow-y-auto custom-scroll">
              <EventFeed userId={user.id} />
            </div>

            {/* Bottom Navigation */}
            <div className="h-[83px] bg-black/95 backdrop-blur-xl border-t border-white/10 flex justify-around items-center pb-5">
              <div className="flex flex-col items-center text-cyan-400">
                <div className="w-7 h-7 bg-current rounded-lg mb-1"></div>
                <div className="text-xs font-semibold">Events</div>
              </div>
              <div className="flex flex-col items-center text-gray-600">
                <div className="w-7 h-7 bg-current rounded-lg mb-1"></div>
                <div className="text-xs font-semibold">My Events</div>
              </div>
              <div className="flex flex-col items-center text-gray-600">
                <div className="w-7 h-7 bg-current rounded-lg mb-1"></div>
                <div className="text-xs font-semibold">Profile</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop: Full Layout */}
      <div className="hidden md:block">
        <DashboardHeader user={user} profile={profile} />
        <div className="container mx-auto px-6 py-8">
          <EventFeed userId={user.id} />
        </div>
      </div>
    </div>
  )
}