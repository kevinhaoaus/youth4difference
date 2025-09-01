import StudentAuthForm from '@/components/auth/student-auth-form'

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900 overflow-hidden">
      {/* Phone Frame Container */}
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="w-[375px] h-[812px] bg-black rounded-[40px] p-2 shadow-2xl shadow-purple-500/20">
          <div className="w-full h-full bg-gradient-to-b from-slate-900 to-black rounded-[32px] overflow-hidden relative flex items-center justify-center">
            
            {/* Status Bar */}
            <div className="absolute top-0 left-0 right-0 h-11 bg-black/90 flex justify-between items-center px-5 text-white text-sm font-semibold">
              <span>9:41</span>
              <span>🔋 100%</span>
            </div>
            
            <StudentAuthForm />
          </div>
        </div>
      </div>
    </div>
  )
}