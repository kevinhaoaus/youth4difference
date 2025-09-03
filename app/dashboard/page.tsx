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
    <div className="min-h-screen bg-black">
      {/* Mobile View */}
      <div className="md:hidden min-h-screen flex flex-col">
        <DashboardHeader user={user} profile={profile} />
        
        <div className="flex-1 overflow-y-auto">
          <EventFeed userId={user.id} />
        </div>

        {/* Bottom Navigation */}
        <div className="bg-black border-t border-zinc-900 flex justify-around items-center py-3">
          <div className="flex flex-col items-center text-white">
            <svg className="w-6 h-6 mb-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
            </svg>
            <div className="text-xs">Events</div>
          </div>
          <div className="flex flex-col items-center text-zinc-500">
            <svg className="w-6 h-6 mb-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
            </svg>
            <div className="text-xs">Profile</div>
          </div>
        </div>
      </div>

      {/* Desktop View */}
      <div className="hidden md:block">
        <DashboardHeader user={user} profile={profile} />
        <div className="container mx-auto px-6 py-8 max-w-6xl">
          <EventFeed userId={user.id} />
        </div>
      </div>
    </div>
  )
}