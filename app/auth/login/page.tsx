import StudentAuthForm from '@/components/auth/student-auth-form'

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-black">
      {/* Mobile */}
      <div className="md:hidden min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              VolunteerVibe
            </h1>
            <p className="text-zinc-400 text-sm">Student Login</p>
          </div>
          <StudentAuthForm />
        </div>
      </div>

      {/* Desktop */}
      <div className="hidden md:block">
        <div className="min-h-screen flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-white mb-4">
                VolunteerVibe
              </h1>
              <p className="text-zinc-400">Connect with your community through volunteering</p>
            </div>
            <div className="bg-zinc-900 rounded border border-zinc-800 p-8">
              <StudentAuthForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}