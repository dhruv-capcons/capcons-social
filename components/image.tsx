'use client'

import React, { useState, useRef, useEffect, ImgHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

interface CloudFrontImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'srcSet'> {
  /**
   * Image path relative to CloudFront domain
   * Example: "hero.jpg" (automatically prefixed with /images/)
   * or "/images/hero.jpg" or "images/hero.jpg"
   * All images are served from: https://assets.capcons.com/images/
   */
  src: string
  
  /**
   * Alt text for the image (required for accessibility)
   */
  alt: string
  
  /**
   * Optional width of the image (for aspect ratio calculation)
   */
  width?: number
  
  /**
   * Optional height of the image (for aspect ratio calculation)
   */
  height?: number
  
  /**
   * Additional CSS classes
   */
  className?: string
  
  /**
   * Enable lazy loading (default: true)
   */
  loading?: 'lazy' | 'eager'
  
  /**
   * Enable blur placeholder while loading (default: false)
   */
  blurDataURL?: string
  
  /**
   * Custom CloudFront domain (overrides NEXT_PUBLIC_CLOUDFRONT_URL)
   */
  cloudFrontDomain?: string
  
  /**
   * Enable responsive images with srcset (default: true)
   */
  responsive?: boolean
  
  /**
   * Quality for image optimization (1-100, default: 90)
   */
  quality?: number
  
  /**
   * Image format (default: auto)
   */
  format?: 'webp' | 'avif' | 'auto' | 'original'
  
  /**
   * Fade in animation on load (default: true)
   */
  fadeIn?: boolean
  
  /**
   * Object fit behavior
   */
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down'
  
  /**
   * Object position
   */
  objectPosition?: string
  
  /**
   * Priority loading (prevents lazy loading, default: false)
   */
  priority?: boolean
}

/**
 * CloudFront Image Component
 * 
 * Fetches all images from AWS CloudFront CDN (assets.capcons.com/images) with optimization support.
 * Images are automatically prefixed with /images/ folder if not already present.
 * 
 * Usage:
 * ```tsx
 * <Image 
 *   src="hero.jpg" 
 *   alt="Hero image"
 *   width={1200}
 *   height={630}
 *   className="rounded-lg"
 * />
 * ```
 * 
 * This will load from: https://assets.capcons.com/images/hero.jpg
 * 
 * You can also provide full paths:
 * ```tsx
 * <Image src="/images/hero.jpg" ... /> // Same result
 * <Image src="images/hero.jpg" ... />  // Same result
 * ```
 */
export const Image: React.FC<CloudFrontImageProps> = ({
  src,
  alt,
  width,
  height,
  className,
  loading = 'lazy',
  blurDataURL,
  cloudFrontDomain,
  responsive = true,
  quality = 90,
  format = 'auto',
  fadeIn = true,
  objectFit,
  objectPosition,
  priority = false,
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [isInView, setIsInView] = useState(priority)
  const imgRef = useRef<HTMLImageElement>(null)

  // Get CloudFront domain from env or prop (defaults to assets.capcons.com)
  const cloudfrontUrl = cloudFrontDomain || process.env.NEXT_PUBLIC_CLOUDFRONT_URL || 'https://assets.capcons.com'
  
  // Build base URL
  const baseUrl = cloudfrontUrl.endsWith('/') 
    ? cloudfrontUrl.slice(0, -1) 
    : cloudfrontUrl
  
  // Normalize src - add /images/ prefix if not already present
  let normalizedSrc = src.startsWith('/') ? src.slice(1) : src
  
  // If src doesn't already include 'images/', prepend it
  if (!normalizedSrc.startsWith('images/')) {
    normalizedSrc = `images/${normalizedSrc}`
  }
  
  // Full image URL
  const imageUrl = `${baseUrl}/${normalizedSrc}`

  // Generate responsive srcset
  const generateSrcSet = () => {
    if (!responsive || !width) return undefined
    
    const widths = [
      Math.round(width * 0.25),
      Math.round(width * 0.5),
      Math.round(width * 0.75),
      width,
      Math.round(width * 1.5),
      Math.round(width * 2),
    ].filter(w => w >= 100 && w <= 4096)

    const formatParam = format === 'auto' ? 'format=auto' : format === 'original' ? '' : `format=${format}`
    const qualityParam = quality ? `quality=${quality}` : ''
    const params = [formatParam, qualityParam].filter(Boolean).join('&')
    const paramString = params ? `?${params}` : ''

    return widths
      .map(w => `${imageUrl}${paramString}&w=${w} ${w}w`)
      .join(', ')
  }

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (priority || loading === 'eager') {
      setIsInView(true)
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true)
            observer.disconnect()
          }
        })
      },
      {
        rootMargin: '50px',
      }
    )

    if (imgRef.current) {
      observer.observe(imgRef.current)
    }

    return () => {
      observer.disconnect()
    }
  }, [priority, loading])

  // Build image URL with optimization params
  const buildImageUrl = (customWidth?: number) => {
    // If no custom width and using default quality/format, return base URL
    if (!customWidth && (!quality || quality === 90) && (!format || format === 'auto' || format === 'original')) {
      return imageUrl
    }

    const params = new URLSearchParams()
    
    if (customWidth) {
      params.append('w', customWidth.toString())
    }
    
    if (quality && quality !== 90) {
      params.append('quality', quality.toString())
    }
    
    if (format === 'webp') {
      params.append('format', 'webp')
    } else if (format === 'avif') {
      params.append('format', 'avif')
    } else if (format === 'auto') {
      params.append('format', 'auto')
    }

    return params.toString() ? `${imageUrl}?${params.toString()}` : imageUrl
  }

  const handleLoad = () => {
    setIsLoaded(true)
    setHasError(false)
  }

  const handleError = () => {
    setHasError(true)
    setIsLoaded(false)
  }

  // Calculate aspect ratio
  const aspectRatio = width && height ? (height / width) * 100 : undefined

  // Styles
  const imageStyles: React.CSSProperties = {
    objectFit: objectFit || 'cover',
    objectPosition: objectPosition || 'center',
    ...props.style,
  }

  // Container styles for aspect ratio
  const containerStyles: React.CSSProperties = {
    width: width ? `${width}px` : '100%',
    ...(aspectRatio && { paddingBottom: `${aspectRatio}%` }),
  }

  return (
    <div
      className={cn(
        'relative overflow-hidden',
        aspectRatio && 'relative',
        className
      )}
      style={aspectRatio ? containerStyles : undefined}
    >
      {/* Blur placeholder */}
      {blurDataURL && !isLoaded && (
        <img
          src={blurDataURL}
          alt=""
          aria-hidden="true"
          className={cn(
            'absolute inset-0 w-full h-full object-cover blur-sm',
            'transition-opacity duration-300',
            isLoaded ? 'opacity-0' : 'opacity-100'
          )}
        />
      )}

      {/* Loading placeholder */}
      {!isLoaded && !blurDataURL && !hasError && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
      )}

      {/* Error placeholder */}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="text-gray-400 text-sm">Failed to load image</div>
        </div>
      )}

      {/* Main image */}
      {isInView && (
        <img
          ref={imgRef}
          src={buildImageUrl()}
          srcSet={responsive ? generateSrcSet() : undefined}
          sizes={width && responsive ? `(max-width: ${width}px) 100vw, ${width}px` : undefined}
          alt={alt}
          width={width}
          height={height}
          loading={priority ? 'eager' : loading}
          decoding="async"
          className={cn(
            aspectRatio ? 'absolute inset-0' : 'w-full h-full',
            fadeIn && 'transition-opacity duration-300',
            fadeIn && (isLoaded ? 'opacity-100' : 'opacity-0'),
            !aspectRatio && 'block'
          )}
          style={imageStyles}
          onLoad={handleLoad}
          onError={handleError}
          {...props}
        />
      )}
    </div>
  )
}

export default Image

