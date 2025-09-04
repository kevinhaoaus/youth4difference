import OrganizationAuthForm from '@/components/auth/organization-auth-form'

export default function OrgLoginPage() {
  return (
    <div className="min-h-screen bg-black">
      {/* Mobile */}
      <div className="md:hidden min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              Youth4Difference
            </h1>
            <p className="text-zinc-400 text-sm">Organization Login</p>
          </div>
          <OrganizationAuthForm />
        </div>
      </div>

      {/* Desktop */}
      <div className="hidden md:block">
        <div className="min-h-screen flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-white mb-4">
                Youth4Difference
              </h1>
              <p className="text-zinc-400">Post volunteer opportunities for your organization</p>
            </div>
            <div className="bg-zinc-900 rounded border border-zinc-800 p-8">
              <OrganizationAuthForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}