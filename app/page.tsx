import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Users, MapPin, Calendar, Heart } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <nav className="p-6 flex justify-between items-center">
        <div className="text-2xl font-bold text-indigo-600">VolunteerVibe</div>
        <div className="space-x-4">
          <Link href="/auth/login">
            <Button variant="ghost">Student Login</Button>
          </Link>
          <Link href="/auth/org-login">
            <Button variant="ghost">Organization Login</Button>
          </Link>
        </div>
      </nav>

      <main className="container mx-auto px-6 py-12">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Make Volunteering 
            <span className="text-indigo-600"> Social & Fun</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Connect with friends, discover local events, and make a difference in your community. 
            Volunteering has never been this easy.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/auth/login">
              <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700">
                Join as Student
              </Button>
            </Link>
            <Link href="/auth/org-login">
              <Button size="lg" variant="outline">
                Post Events (Organizations)
              </Button>
            </Link>
          </div>

          <div className="grid md:grid-cols-4 gap-8 mt-16">
            <div className="text-center">
              <MapPin className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Find Nearby Events</h3>
              <p className="text-gray-600">Discover volunteering opportunities within walking distance</p>
            </div>
            <div className="text-center">
              <Users className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Go With Friends</h3>
              <p className="text-gray-600">See which events your friends are joining</p>
            </div>
            <div className="text-center">
              <Calendar className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">One-Click Signup</h3>
              <p className="text-gray-600">No long commitments, just show up and help</p>
            </div>
            <div className="text-center">
              <Heart className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Make Impact</h3>
              <p className="text-gray-600">Every small action creates positive change</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}