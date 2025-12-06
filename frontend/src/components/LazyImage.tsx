import { useState } from 'react'
import { motion } from 'framer-motion'
import useLazyImage from '../hooks/useLazyImage'

interface LazyImageProps {
  src: string
  alt: string
  className?: string
  placeholderClassName?: string
  onLoad?: () => void
}

const LazyImage = ({ src, alt, className = '', placeholderClassName = '', onLoad }: LazyImageProps) => {
  const { imgRef, isVisible } = useLazyImage()
  const [isLoaded, setIsLoaded] = useState(false)

  const handleLoad = () => {
    setIsLoaded(true)
    onLoad?.()
  }

  return (
    <div className="relative overflow-hidden">
      {!isLoaded && (
        <div className={`absolute inset-0 bg-kodeen-gray-100 animate-pulse ${placeholderClassName}`} />
      )}
      <motion.img
        ref={imgRef}
        src={isVisible ? src : undefined}
        alt={alt}
        className={className}
        onLoad={handleLoad}
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoaded ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        loading="lazy"
      />
    </div>
  )
}

export default LazyImage
