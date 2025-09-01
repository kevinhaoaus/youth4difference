import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import EventsList from '@/components/org/events-list'
import OrgHeader from '@/components/org/header'

export default async function OrgDashboardPage() {
  const supabase = await createClient()
  
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error || !user) {
    redirect('/auth/org-login')
  }

  // Get user type - if doesn't exist, assume organization and create it
  let { data: userData } = await supabase
    .from('users')
    .select('user_type')
    .eq('id', user.id)
    .single()

  // If user record doesn't exist, create it as organization
  if (!userData) {
    const { error: insertError } = await supabase
      .from('users')
      .insert({
        id: user.id,
        email: user.email!,
        user_type: 'organization'
      })
    
    if (!insertError) {
      userData = { user_type: 'organization' }
    }
  }

  if (userData?.user_type !== 'organization') {
    redirect('/dashboard')
  }

  // Get organization profile
  const { data: profile } = await supabase
    .from('organization_profiles')
    .select('*')
    .eq('user_id', user.id)
    .single()

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-black">
      <OrgHeader user={user} profile={profile} />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-white md:text-3xl">Your Events</h2>
            <p className="text-gray-300">Manage your volunteering events</p>
          </div>
          <Link href="/org/create-event">
            <Button className="bg-indigo-600 hover:bg-indigo-700 transition-all duration-300 w-full md:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              Create Event
            </Button>
          </Link>
        </div>

        <EventsList orgId={user.id} />
      </main>
    </div>
  )
}