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

  // Get user type
  const { data: userData } = await supabase
    .from('users')
    .select('user_type')
    .eq('id', user.id)
    .single()

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
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader user={user} profile={profile} />
      <EventFeed userId={user.id} />
    </div>
  )
}