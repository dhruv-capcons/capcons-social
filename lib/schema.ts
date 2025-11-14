/**
 * JSON-LD Schema utilities for structured data
 * Helps LLMs and search engines understand page content
 */

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://capcons.com";
const cloudfrontImageBase = "https://assets.capcons.com/images";

export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "CapCons",
    "url": baseUrl,
    "logo": `${cloudfrontImageBase}/logo.png`,
    "description": "CapCons - Professional solutions and services for your business needs.",
    "sameAs": [
      `https://twitter.com/capcons`,
      `https://linkedin.com/company/capcons`,
      `https://facebook.com/capcons`
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer service",
      "url": `${baseUrl}/contact-us`
    }
  };
}

export function generateWebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "CapCons",
    "url": baseUrl,
    "description": "CapCons - Professional solutions and services for your business needs.",
    "publisher": {
      "@type": "Organization",
      "name": "CapCons"
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${baseUrl}/search?q={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    }
  };
}

export function generateArticleSchema({
  title,
  description,
  url,
  author = "CapCons",
  publishedDate,
  modifiedDate,
  image,
}: {
  title: string;
  description: string;
  url: string;
  author?: string;
  publishedDate?: string;
  modifiedDate?: string;
  image?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": title,
    "description": description,
    "url": `${baseUrl}${url}`,
    "author": {
      "@type": "Organization",
      "name": author
    },
    "publisher": {
      "@type": "Organization",
      "name": "CapCons",
      "logo": {
        "@type": "ImageObject",
        "url": `${cloudfrontImageBase}/logo.png`
      }
    },
    "datePublished": publishedDate || new Date().toISOString(),
    "dateModified": modifiedDate || publishedDate || new Date().toISOString(),
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `${baseUrl}${url}`
    },
    "image": image ? `${cloudfrontImageBase}/${image.startsWith('/') ? image.slice(1) : image}` : `${cloudfrontImageBase}/og-image.jpg`
  };
}

export function generateEventSchema({
  name,
  description,
  url,
  startDate,
  endDate,
  location,
  image,
}: {
  name: string;
  description: string;
  url: string;
  startDate?: string;
  endDate?: string;
  location?: string;
  image?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Event",
    "name": name,
    "description": description,
    "url": `${baseUrl}${url}`,
    "startDate": startDate || new Date().toISOString(),
    "endDate": endDate,
    "location": location ? {
      "@type": "Place",
      "name": location
    } : {
      "@type": "VirtualLocation",
      "url": `${baseUrl}${url}`
    },
    "organizer": {
      "@type": "Organization",
      "name": "CapCons",
      "url": baseUrl
    },
    "image": image ? `${cloudfrontImageBase}/${image.startsWith('/') ? image.slice(1) : image}` : `${cloudfrontImageBase}/og-image.jpg`
  };
}

export function generateJobPostingSchema({
  title,
  description,
  url,
  employmentType = "FULL_TIME",
  datePosted,
  validThrough,
  hiringOrganization = "CapCons",
  jobLocation,
  baseSalary,
}: {
  title: string;
  description: string;
  url: string;
  employmentType?: string;
  datePosted?: string;
  validThrough?: string;
  hiringOrganization?: string;
  jobLocation?: string;
  baseSalary?: { currency: string; value: { minValue?: number; maxValue?: number } };
}) {
  return {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    "title": title,
    "description": description,
    "identifier": {
      "@type": "PropertyValue",
      "name": "CapCons",
      "value": url
    },
    "datePosted": datePosted || new Date().toISOString(),
    "validThrough": validThrough,
    "employmentType": employmentType,
    "hiringOrganization": {
      "@type": "Organization",
      "name": hiringOrganization,
      "sameAs": baseUrl
    },
    "jobLocation": jobLocation ? {
      "@type": "Place",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": jobLocation
      }
    } : {
      "@type": "Place",
      "address": {
        "@type": "PostalAddress"
      }
    },
    "baseSalary": baseSalary,
    "url": `${baseUrl}${url}`
  };
}

export function generateVideoObjectSchema({
  name,
  description,
  url,
  thumbnailUrl,
  uploadDate,
  duration,
}: {
  name: string;
  description: string;
  url: string;
  thumbnailUrl?: string;
  uploadDate?: string;
  duration?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    "name": name,
    "description": description,
    "thumbnailUrl": thumbnailUrl ? `${cloudfrontImageBase}/${thumbnailUrl.startsWith('/') ? thumbnailUrl.slice(1) : thumbnailUrl}` : `${cloudfrontImageBase}/og-image.jpg`,
    "uploadDate": uploadDate || new Date().toISOString(),
    "duration": duration,
    "contentUrl": `${baseUrl}${url}`,
    "embedUrl": `${baseUrl}${url}`,
    "publisher": {
      "@type": "Organization",
      "name": "CapCons",
      "logo": {
        "@type": "ImageObject",
        "url": `${cloudfrontImageBase}/logo.png`
      }
    }
  };
}

export function generateFAQPageSchema({
  faqs,
}: {
  faqs: Array<{ question: string; answer: string }>;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };
}

export function generateBreadcrumbListSchema({
  items,
}: {
  items: Array<{ name: string; url: string }>;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": `${baseUrl}${item.url}`
    }))
  };
}

export function generateWebPageSchema({
  name,
  description,
  url,
  inLanguage = "en-US",
  isPartOf,
}: {
  name: string;
  description: string;
  url: string;
  inLanguage?: string;
  isPartOf?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": name,
    "description": description,
    "url": `${baseUrl}${url}`,
    "inLanguage": inLanguage,
    "isPartOf": {
      "@type": "WebSite",
      "name": "CapCons",
      "url": baseUrl
    },
    "about": {
      "@type": "Thing",
      "name": description
    },
    "mainEntity": {
      "@type": "Thing",
      "name": name
    }
  };
}

export function generateServiceSchema({
  name,
  description,
  url,
  provider = "CapCons",
}: {
  name: string;
  description: string;
  url: string;
  provider?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": name,
    "description": description,
    "provider": {
      "@type": "Organization",
      "name": provider,
      "url": baseUrl
    },
    "url": `${baseUrl}${url}`,
    "areaServed": "Worldwide",
    "serviceType": "Business Services"
  };
}

