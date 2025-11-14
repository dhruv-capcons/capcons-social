/**
 * Image URL utilities for CloudFront
 * All images are served from assets.capcons.com/images
 */

export const CLOUDFRONT_IMAGE_BASE = 'https://assets.capcons.com/images'

/**
 * Build a CloudFront image URL
 * @param imagePath - Image path (e.g., "og-image.jpg" or "/og-image.jpg")
 * @returns Full CloudFront URL
 */
export function getImageUrl(imagePath: string): string {
  // Remove leading slash if present
  const normalizedPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath
  return `${CLOUDFRONT_IMAGE_BASE}/${normalizedPath}`
}

// Common image paths
export const IMAGES = {
  og: getImageUrl('og-image.jpg'),
  twitter: getImageUrl('twitter-image.jpg'),
  logo: getImageUrl('logo.png'),
}

