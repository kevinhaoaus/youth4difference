import StudentAuthForm from '@/components/auth/student-auth-form'

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800">
      {/* Mobile */}
      <div className="md:hidden flex items-center justify-center min-h-screen p-4">
        <div className="w-[375px] h-[812px] bg-black rounded-[40px] p-2 shadow-2xl shadow-purple-500/20">
          <div className="w-full h-full bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 rounded-[32px] overflow-hidden relative flex items-center justify-center">
            
            {/* Status Bar */}
            <div className="absolute top-0 left-0 right-0 h-11 bg-black/90 flex justify-between items-center px-5 text-white text-sm font-semibold">
              <span>9:41</span>
              <span>🔋 100%</span>
            </div>
            
            <StudentAuthForm />
          </div>
        </div>
      </div>

      {/* Desktop */}
      <div className="hidden md:block">
        <div className="min-h-screen flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-white bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent mb-4">
                VolunteerVibe
              </h1>
              <p className="text-gray-300">Connect with your community through volunteering</p>
            </div>
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-8">
              <StudentAuthForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}