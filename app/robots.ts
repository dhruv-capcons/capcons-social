import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://capcons.com'
  
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/brandguide/', '/legal/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}

