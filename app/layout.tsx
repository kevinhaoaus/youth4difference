import './globals.css'
import { Toaster } from 'sonner'

export const metadata = {
  title: 'VolunteerVibe',
  description: 'Social volunteering platform for students',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster position="top-center" />
      </body>
    </html>
  )
}