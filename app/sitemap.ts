import { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://capcons.com'
  
  // Static pages with higher priority
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about-us`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/features`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/pricing`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/contact-us`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/media`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/career`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
  ]

  // Listing pages (content pages)
  const listingPages = [
    {
      url: `${baseUrl}/events`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/insights`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/how-to-videos`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/jobs`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.8,
    },
  ]

  // Note: Dynamic routes (events/[title], insights/[title], etc.) 
  // would need to be fetched from your API/database
  // You can extend this function to fetch dynamic routes:
  
  // Example for dynamic routes (uncomment and modify based on your data source):
  /*
  async function getDynamicRoutes() {
    // Fetch from your API/database
    const events = await fetch(`${baseUrl}/api/events`).then(r => r.json())
    const articles = await fetch(`${baseUrl}/api/articles`).then(r => r.json())
    const videos = await fetch(`${baseUrl}/api/videos`).then(r => r.json())
    const jobs = await fetch(`${baseUrl}/api/jobs`).then(r => r.json())
    
    const dynamicRoutes = [
      ...events.map((event: any) => ({
        url: `${baseUrl}/events/${encodeURIComponent(event.slug)}`,
        lastModified: new Date(event.updatedAt || event.createdAt),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
      })),
      ...articles.map((article: any) => ({
        url: `${baseUrl}/insights/${encodeURIComponent(article.slug)}`,
        lastModified: new Date(article.updatedAt || article.createdAt),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      })),
      ...videos.map((video: any) => ({
        url: `${baseUrl}/how-to-videos/${encodeURIComponent(video.slug)}`,
        lastModified: new Date(video.updatedAt || video.createdAt),
        changeFrequency: 'monthly' as const,
        priority: 0.6,
      })),
      ...jobs.map((job: any) => ({
        url: `${baseUrl}/jobs/${encodeURIComponent(job.slug)}`,
        lastModified: new Date(job.updatedAt || job.createdAt),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      })),
    ]
    
    return dynamicRoutes
  }
  */

  return [...staticPages, ...listingPages]
}

