import { Metadata } from 'next'

interface SEOProps {
  title?: string
  description?: string
  image?: string
  url?: string
}

export function generateSEO({
  title = 'VolunteerVibe',
  description = 'Connect with meaningful volunteer opportunities in your community',
  image = '/og-image.png',
  url = 'https://volunteervibe.com'
}: SEOProps = {}): Metadata {
  const fullTitle = title === 'VolunteerVibe' ? title : `${title} | VolunteerVibe`
  
  return {
    title: fullTitle,
    description,
    keywords: ['volunteering', 'community service', 'students', 'events', 'Sydney', 'Australia'],
    authors: [{ name: 'VolunteerVibe Team' }],
    creator: 'VolunteerVibe',
    publisher: 'VolunteerVibe',
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: 'VolunteerVibe',
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: 'VolunteerVibe - Volunteer Management Platform',
        },
      ],
      locale: 'en_AU',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [image],
      creator: '@volunteervibe',
    },
    alternates: {
      canonical: url,
    },
  }
}