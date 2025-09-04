import './globals.css'
import { Toaster } from 'sonner'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Youth4Difference - Empowering Youth Through Volunteering',
  description: 'Connect with meaningful volunteer opportunities and make a difference in your community. Join Youth4Difference to discover events that match your passion.',
  keywords: 'volunteering, youth, students, community, events, social, Sydney',
  authors: [{ name: 'Youth4Difference Team' }],
  viewport: 'width=device-width, initial-scale=1',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
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