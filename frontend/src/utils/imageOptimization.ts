// Image optimization utilities

export const getOptimizedImageUrl = (url: string, width?: number, quality: number = 80): string => {
  // For external URLs (Unsplash, etc.), add optimization parameters
  if (url.includes('unsplash.com')) {
    const separator = url.includes('?') ? '&' : '?'
    let optimized = `${url}${separator}auto=format&fit=crop&q=${quality}`
    if (width) {
      optimized += `&w=${width}`
    }
    return optimized
  }
  
  // For local images, return as-is (CDN optimization would be added here)
  return url
}

export const generateSrcSet = (url: string, widths: number[] = [400, 800, 1200, 1600]): string => {
  return widths
    .map(width => `${getOptimizedImageUrl(url, width)} ${width}w`)
    .join(', ')
}

export const preloadImage = (url: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve()
    img.onerror = reject
    img.src = url
  })
}

export const preloadImages = async (urls: string[]): Promise<void> => {
  await Promise.all(urls.map(url => preloadImage(url)))
}
