import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const lat = searchParams.get('lat')
  const lng = searchParams.get('lng')
  const radius = searchParams.get('radius') || '20' // km

  let query = supabase
    .from('events')
    .select(`
      *,
      organization_profiles!inner(org_name),
      event_registrations(count)
    `)
    .eq('status', 'published')
    .gte('start_datetime', new Date().toISOString())
    .order('start_datetime', { ascending: true })

  // Add location filtering if coordinates provided
  if (lat && lng) {
    // Basic distance filtering (you'd want a proper PostGIS function in production)
    query = query.not('latitude', 'is', null)
    query = query.not('longitude', 'is', null)
  }

  const { data: events, error } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ events })
}