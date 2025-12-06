import { useEffect, useRef, useState } from 'react'

interface UseLazyImageOptions {
  threshold?: number
  rootMargin?: string
}

export const useLazyImage = (options: UseLazyImageOptions = {}) => {
  const { threshold = 0.1, rootMargin = '50px' } = options
  const [isVisible, setIsVisible] = useState(false)
  const imgRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    const currentImg = imgRef.current
    if (!currentImg) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold, rootMargin }
    )

    observer.observe(currentImg)

    return () => {
      if (currentImg) {
        observer.unobserve(currentImg)
      }
    }
  }, [threshold, rootMargin])

  return { imgRef, isVisible }
}

export default useLazyImage
