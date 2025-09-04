import { Metadata } from 'next'

interface SEOProps {
  title?: string
  description?: string
  image?: string
  url?: string
}

export function generateSEO({
  title = 'Youth4Difference',
  description = 'Connect with meaningful volunteer opportunities in your community',
  image = '/og-image.png',
  url = 'https://youth4difference.com'
}: SEOProps = {}): Metadata {
  const fullTitle = title === 'Youth4Difference' ? title : `${title} | Youth4Difference`
  
  return {
    title: fullTitle,
    description,
    keywords: ['volunteering', 'community service', 'students', 'events', 'Sydney', 'Australia'],
    authors: [{ name: 'Youth4Difference Team' }],
    creator: 'Youth4Difference',
    publisher: 'Youth4Difference',
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
      siteName: 'Youth4Difference',
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: 'Youth4Difference - Empowering Youth Through Volunteering',
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
      creator: '@youth4difference',
    },
    alternates: {
      canonical: url,
    },
  }
}