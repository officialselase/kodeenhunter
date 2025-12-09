import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import gsap from 'gsap'

interface IntroAnimationProps {
  onComplete: () => void
}

const IntroAnimation = ({ onComplete }: IntroAnimationProps) => {
  const [phase, setPhase] = useState<'qr' | 'dissolve' | 'logo' | 'done'>('qr')
  const containerRef = useRef<HTMLDivElement>(null)
  const qrRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    const timeline = gsap.timeline()

    setTimeout(() => setPhase('dissolve'), 800)
    setTimeout(() => setPhase('logo'), 1800)
    setTimeout(() => {
      setPhase('done')
      onComplete()
    }, 4000)

    return () => {
      timeline.kill()
    }
  }, [onComplete])

  return (
    <motion.div
      ref={containerRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-white"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: 'easeInOut' }}
    >
      <AnimatePresence mode="wait">
        {(phase === 'qr' || phase === 'dissolve') && (
          <motion.div
            key="qr"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ 
              opacity: phase === 'dissolve' ? 0 : 1, 
              scale: phase === 'dissolve' ? 1.2 : 1,
              filter: phase === 'dissolve' ? 'blur(20px)' : 'blur(0px)'
            }}
            exit={{ opacity: 0, scale: 1.5, filter: 'blur(30px)' }}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
            className="absolute"
          >
            <svg
              ref={qrRef}
              width="200"
              height="200"
              viewBox="0 0 200 200"
              className="text-kodeen-black"
            >
              <defs>
                <pattern id="qrPattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                  <rect x="0" y="0" width="8" height="8" fill="currentColor" />
                  <rect x="12" y="0" width="8" height="8" fill="currentColor" />
                  <rect x="0" y="12" width="8" height="8" fill="currentColor" />
                </pattern>
              </defs>
              <rect x="10" y="10" width="60" height="60" fill="none" stroke="currentColor" strokeWidth="4" />
              <rect x="20" y="20" width="40" height="40" fill="currentColor" />
              <rect x="130" y="10" width="60" height="60" fill="none" stroke="currentColor" strokeWidth="4" />
              <rect x="140" y="20" width="40" height="40" fill="currentColor" />
              <rect x="10" y="130" width="60" height="60" fill="none" stroke="currentColor" strokeWidth="4" />
              <rect x="20" y="140" width="40" height="40" fill="currentColor" />
              <rect x="80" y="80" width="40" height="40" fill="url(#qrPattern)" />
              <rect x="80" y="10" width="8" height="8" fill="currentColor" />
              <rect x="100" y="10" width="8" height="8" fill="currentColor" />
              <rect x="80" y="30" width="8" height="8" fill="currentColor" />
              <rect x="100" y="50" width="8" height="8" fill="currentColor" />
              <rect x="130" y="80" width="8" height="8" fill="currentColor" />
              <rect x="150" y="100" width="8" height="8" fill="currentColor" />
              <rect x="170" y="80" width="8" height="8" fill="currentColor" />
              <rect x="80" y="130" width="8" height="8" fill="currentColor" />
              <rect x="100" y="150" width="8" height="8" fill="currentColor" />
              <rect x="130" y="130" width="60" height="60" fill="currentColor" opacity="0.1" />
              <rect x="140" y="140" width="40" height="40" fill="currentColor" opacity="0.2" />
            </svg>
          </motion.div>
        )}

        {phase === 'logo' && (
          <motion.div
            key="logo"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
            className="absolute flex flex-col items-center"
          >
            <motion.div
              className="relative"
              initial={{ opacity: 0, y: 30 }}
              animate={{ 
                opacity: 1, 
                y: 0,
                scale: [1, 1.02, 1, 1.02, 1],
              }}
              transition={{
                opacity: { duration: 0.8, ease: 'easeOut' },
                y: { duration: 0.8, ease: [0.34, 1.56, 0.64, 1] },
                scale: {
                  duration: 1.5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }
              }}
            >
              <img 
                src="/kodeen-logo1.jpeg" 
                alt="Kodeen Hunter" 
                className="w-64 md:w-80 h-auto"
                style={{ maxWidth: '90vw' }}
              />
            </motion.div>
            <motion.div
              className="mt-6 overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <motion.p
                className="text-sm tracking-[0.3em] text-kodeen-gray-500 uppercase"
                initial={{ y: 30 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.5, delay: 0.7, ease: 'easeOut' }}
              >
                Videographer
              </motion.p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: phase === 'logo' ? 1 : 0 }}
        transition={{ delay: 1.2 }}
      >
        <div className="flex items-center gap-2">
          <motion.div
            className="w-1 h-1 rounded-full bg-kodeen-black"
            animate={{ scale: [1, 1.5, 1] }}
            transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 0.2 }}
          />
          <motion.div
            className="w-1 h-1 rounded-full bg-kodeen-black"
            animate={{ scale: [1, 1.5, 1] }}
            transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 0.2, delay: 0.2 }}
          />
          <motion.div
            className="w-1 h-1 rounded-full bg-kodeen-black"
            animate={{ scale: [1, 1.5, 1] }}
            transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 0.2, delay: 0.4 }}
          />
        </div>
      </motion.div>
    </motion.div>
  )
}

export default IntroAnimation
