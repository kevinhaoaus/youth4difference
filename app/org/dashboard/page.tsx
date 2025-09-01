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

  // Get user type
  const { data: userData } = await supabase
    .from('users')
    .select('user_type')
    .eq('id', user.id)
    .single()

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
    <div className="min-h-screen bg-gray-50">
      <OrgHeader user={user} profile={profile} />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Your Events</h2>
            <p className="text-gray-600">Manage your volunteering events</p>
          </div>
          <Link href="/org/create-event">
            <Button className="bg-indigo-600 hover:bg-indigo-700">
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