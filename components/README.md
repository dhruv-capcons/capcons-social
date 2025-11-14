# CloudFront Image Component

A client-side optimized Image component that fetches all images from AWS CloudFront CDN.

**All images are automatically served from: `https://assets.capcons.com/images/`**

## Setup

The component defaults to `https://assets.capcons.com/images/`. You can override this by setting:

```env
NEXT_PUBLIC_CLOUDFRONT_URL=https://assets.capcons.com
```

Or pass `cloudFrontDomain` prop to individual Image components.

## Basic Usage

```tsx
import Image from '@/components/image'

// Simple usage - automatically adds /images/ prefix
<Image
  src="hero.jpg"
  alt="Hero banner"
  width={1200}
  height={630}
/>

// Full paths also work
<Image
  src="/images/hero.jpg"
  alt="Hero banner"
  width={1200}
  height={630}
/>
```

All examples above will load from: `https://assets.capcons.com/images/hero.jpg`

## Features

- ✅ **CloudFront CDN Integration** - All images served from AWS CloudFront
- ✅ **Lazy Loading** - Automatic lazy loading with Intersection Observer
- ✅ **Responsive Images** - Automatic srcset generation for different screen sizes
- ✅ **Image Optimization** - Quality and format optimization parameters
- ✅ **Blur Placeholder** - Optional blur-up effect while loading
- ✅ **Fade-in Animation** - Smooth fade-in on image load
- ✅ **Error Handling** - Graceful error handling with placeholder
- ✅ **Aspect Ratio** - Maintains aspect ratio with padding-bottom trick
- ✅ **Priority Loading** - Support for above-the-fold images

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `src` | `string` | **required** | Image path (e.g., "hero.jpg" - automatically prefixed with /images/) |
| `alt` | `string` | **required** | Alt text for accessibility |
| `width` | `number` | `undefined` | Image width (for aspect ratio) |
| `height` | `number` | `undefined` | Image height (for aspect ratio) |
| `className` | `string` | `undefined` | Additional CSS classes |
| `loading` | `'lazy' \| 'eager'` | `'lazy'` | Loading behavior |
| `priority` | `boolean` | `false` | Priority loading (disables lazy load) |
| `quality` | `number` | `90` | Image quality (1-100) |
| `format` | `'webp' \| 'avif' \| 'auto' \| 'original'` | `'auto'` | Image format |
| `responsive` | `boolean` | `true` | Enable responsive srcset |
| `fadeIn` | `boolean` | `true` | Enable fade-in animation |
| `blurDataURL` | `string` | `undefined` | Blur placeholder base64 string |
| `cloudFrontDomain` | `string` | `env var` | Override CloudFront domain |
| `objectFit` | `string` | `'cover'` | CSS object-fit value |
| `objectPosition` | `string` | `'center'` | CSS object-position value |

## Examples

### Basic Image
```tsx
<Image
  src="/images/product.jpg"
  alt="Product"
  width={800}
  height={600}
/>
```

### Optimized with WebP
```tsx
<Image
  src="/images/banner.jpg"
  alt="Banner"
  width={1920}
  height={600}
  quality={85}
  format="webp"
/>
```

### Priority Loading (Above the Fold)
```tsx
<Image
  src="/images/logo.svg"
  alt="Logo"
  width={200}
  height={50}
  priority={true}
/>
```

### With Blur Placeholder
```tsx
<Image
  src="/images/gallery.jpg"
  alt="Gallery"
  width={1200}
  height={800}
  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRg..."
/>
```

### Custom CloudFront Domain
```tsx
<Image
  src="/images/custom.jpg"
  alt="Custom"
  width={800}
  height={600}
  cloudFrontDomain="https://custom.cloudfront.net"
/>
```

### Full Width Responsive
```tsx
<Image
  src="/images/banner.jpg"
  alt="Full width"
  width={1920}
  height={600}
  responsive={true}
  className="w-full"
/>
```

## CloudFront URL Format

The component automatically builds URLs in this format:

```
https://assets.capcons.com/images/hero.jpg?w=1200&quality=90&format=auto
```

All images are served from `https://assets.capcons.com` by default.

Query parameters:
- `w` - Width (for responsive images)
- `quality` - Quality (1-100)
- `format` - Format (webp, avif, auto)


## Migration from Next.js Image

Replace:
```tsx
import Image from 'next/image'

<Image src="/hero.jpg" alt="Hero" width={1200} height={630} />
```

With:
```tsx
import Image from '@/components/image'

<Image src="/hero.jpg" alt="Hero" width={1200} height={630} />
```

## Notes

- All images are loaded client-side from CloudFront
- The component uses Intersection Observer for lazy loading
- Aspect ratio is maintained using padding-bottom technique
- Supports all standard HTML img attributes
- Automatically generates responsive srcset for different screen sizes

