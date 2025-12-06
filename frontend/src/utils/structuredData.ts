/**
 * Structured data (JSON-LD) utilities for SEO
 * Helps search engines understand your content better
 */

interface Person {
  '@type': 'Person'
  name: string
  jobTitle: string
  url: string
  image?: string
  sameAs?: string[]
}

interface Organization {
  '@type': 'Organization'
  name: string
  url: string
  logo?: string
  sameAs?: string[]
}

interface Product {
  '@type': 'Product'
  name: string
  description: string
  image: string
  offers: {
    '@type': 'Offer'
    price: number
    priceCurrency: string
    availability: string
  }
}

interface VideoObject {
  '@type': 'VideoObject'
  name: string
  description: string
  thumbnailUrl: string
  uploadDate: string
  contentUrl?: string
  embedUrl?: string
}

/**
 * Generate Person schema (for about page)
 */
export const generatePersonSchema = (): Person => {
  return {
    '@type': 'Person',
    name: 'Kodeen Hunter',
    jobTitle: 'Professional Videographer & Cinematographer',
    url: 'https://kodeenhunter.com',
    image: 'https://kodeenhunter.com/images/kodeen-hunter.jpg',
    sameAs: [
      'https://instagram.com/kodeenhunter',
      'https://youtube.com/@kodeenhunter',
      'https://vimeo.com/kodeenhunter',
    ],
  }
}

/**
 * Generate Organization schema (for homepage)
 */
export const generateOrganizationSchema = (): Organization => {
  return {
    '@type': 'Organization',
    name: 'Kodeen Hunter Productions',
    url: 'https://kodeenhunter.com',
    logo: 'https://kodeenhunter.com/logo.png',
    sameAs: [
      'https://instagram.com/kodeenhunter',
      'https://youtube.com/@kodeenhunter',
      'https://vimeo.com/kodeenhunter',
    ],
  }
}

/**
 * Generate Product schema (for shop items)
 */
export const generateProductSchema = (product: {
  name: string
  description: string
  image: string
  price: number
}): Product => {
  return {
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.image,
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
    },
  }
}

/**
 * Generate VideoObject schema (for portfolio videos)
 */
export const generateVideoSchema = (video: {
  name: string
  description: string
  thumbnailUrl: string
  uploadDate: string
  embedUrl?: string
}): VideoObject => {
  return {
    '@type': 'VideoObject',
    name: video.name,
    description: video.description,
    thumbnailUrl: video.thumbnailUrl,
    uploadDate: video.uploadDate,
    embedUrl: video.embedUrl,
  }
}

/**
 * Inject structured data into page
 */
export const injectStructuredData = (data: any) => {
  const script = document.createElement('script')
  script.type = 'application/ld+json'
  script.text = JSON.stringify({
    '@context': 'https://schema.org',
    ...data,
  })

  // Remove existing structured data script if present
  const existing = document.querySelector('script[type="application/ld+json"]')
  if (existing) {
    existing.remove()
  }

  document.head.appendChild(script)
}
