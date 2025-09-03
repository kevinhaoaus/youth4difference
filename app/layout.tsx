import './globals.css'
import { Toaster } from 'sonner'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'VolunteerVibe - Social Volunteering Made Easy',
  description: 'Connect with friends, discover local events, and make a difference in your community. Volunteering has never been this social and fun.',
  keywords: 'volunteering, students, community, events, social, Sydney',
  authors: [{ name: 'VolunteerVibe Team' }],
  viewport: 'width=device-width, initial-scale=1',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.className}>
      <body className="bg-black text-white min-h-screen">
        {children}
        <Toaster position="top-center" />
      </body>
    </html>
  )
}