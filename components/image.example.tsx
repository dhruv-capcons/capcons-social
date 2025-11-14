/**
 * CloudFront Image Component - Usage Examples
 * 
 * This file contains examples of how to use the CloudFront Image component.
 */

import Image from '@/components/image'

// Example 1: Basic usage
export function BasicExample() {
  return (
    <Image
      src="/images/hero.jpg"
      alt="Hero banner"
      width={1200}
      height={630}
    />
  )
}

// Example 2: With custom CloudFront domain (if different from default)
export function CustomDomainExample() {
  return (
    <Image
      src="/images/product.jpg"
      alt="Product image"
      width={800}
      height={600}
      cloudFrontDomain="https://assets.capcons.com"
    />
  )
}

// Example 3: With responsive images and optimization
export function OptimizedExample() {
  return (
    <Image
      src="/images/blog-post.jpg"
      alt="Blog post featured image"
      width={1200}
      height={675}
      quality={85}
      format="webp"
      responsive={true}
      className="rounded-lg shadow-lg"
    />
  )
}

// Example 4: With blur placeholder
export function BlurPlaceholderExample() {
  return (
    <Image
      src="/images/gallery-image.jpg"
      alt="Gallery image"
      width={1024}
      height={768}
      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRg..."
      fadeIn={true}
    />
  )
}

// Example 5: Priority loading (above the fold)
export function PriorityExample() {
  return (
    <Image
      src="/images/logo.svg"
      alt="Company logo"
      width={200}
      height={50}
      priority={true}
      loading="eager"
    />
  )
}

// Example 6: With object-fit customization
export function ObjectFitExample() {
  return (
    <Image
      src="/images/profile.jpg"
      alt="Profile picture"
      width={400}
      height={400}
      objectFit="cover"
      objectPosition="center top"
      className="rounded-full"
    />
  )
}

// Example 7: No aspect ratio (natural sizing)
export function NaturalSizeExample() {
  return (
    <Image
      src="/images/icon.svg"
      alt="Icon"
      width={64}
      height={64}
      className="inline-block"
    />
  )
}

// Example 8: Full width responsive
export function FullWidthExample() {
  return (
    <Image
      src="/images/banner.jpg"
      alt="Full width banner"
      width={1920}
      height={600}
      responsive={true}
      className="w-full"
    />
  )
}

