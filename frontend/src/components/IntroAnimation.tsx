import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import gsap from 'gsap'

interface IntroAnimationProps {
  onComplete: () => void
}

const IntroAnimation = ({ onComplete }: IntroAnimationProps) => {
  const [phase, setPhase] = useState<'qr' | 'dissolve' | 'clapperboard' | 'logo' | 'done'>('qr')
  const containerRef = useRef<HTMLDivElement>(null)
  const qrRef = useRef<SVGSVGElement>(null)
  const clapperRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    const timeline = gsap.timeline()

    setTimeout(() => setPhase('dissolve'), 800)
    setTimeout(() => setPhase('clapperboard'), 1800)
    setTimeout(() => setPhase('logo'), 3200)
    setTimeout(() => {
      setPhase('done')
      onComplete()
    }, 5500)

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

        {phase === 'clapperboard' && (
          <motion.div
            key="clapperboard"
            initial={{ opacity: 0, rotateX: -90 }}
            animate={{ opacity: 1, rotateX: 0 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ 
              duration: 0.6, 
              ease: [0.34, 1.56, 0.64, 1],
              rotateX: { duration: 0.4 }
            }}
            className="absolute perspective-1000"
          >
            <motion.svg
              ref={clapperRef}
              width="280"
              height="220"
              viewBox="0 0 280 220"
              className="text-kodeen-black"
            >
              <motion.g
                initial={{ rotateX: -30 }}
                animate={{ rotateX: [0, -25, 0] }}
                transition={{ 
                  duration: 0.4, 
                  delay: 0.3,
                  times: [0, 0.5, 1],
                  ease: 'easeOut'
                }}
                style={{ transformOrigin: '140px 45px' }}
              >
                <path
                  d="M20 10 L260 10 L260 55 L20 55 Z"
                  fill="currentColor"
                />
                <line x1="60" y1="10" x2="40" y2="55" stroke="white" strokeWidth="8" />
                <line x1="100" y1="10" x2="80" y2="55" stroke="white" strokeWidth="8" />
                <line x1="140" y1="10" x2="120" y2="55" stroke="white" strokeWidth="8" />
                <line x1="180" y1="10" x2="160" y2="55" stroke="white" strokeWidth="8" />
                <line x1="220" y1="10" x2="200" y2="55" stroke="white" strokeWidth="8" />
                <line x1="260" y1="10" x2="240" y2="55" stroke="white" strokeWidth="8" />
              </motion.g>
              <rect x="20" y="55" width="240" height="150" fill="currentColor" rx="4" />
              <rect x="30" y="70" width="100" height="20" fill="white" rx="2" />
              <rect x="30" y="100" width="80" height="15" fill="white" rx="2" />
              <rect x="30" y="125" width="60" height="15" fill="white" rx="2" />
              <circle cx="200" cy="130" r="40" fill="none" stroke="white" strokeWidth="3" />
              <circle cx="200" cy="130" r="15" fill="white" />
              <motion.line
                x1="200"
                y1="130"
                x2="200"
                y2="100"
                stroke="white"
                strokeWidth="2"
                initial={{ rotate: 0 }}
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                style={{ transformOrigin: '200px 130px' }}
              />
            </motion.svg>
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
              animate={{
                scale: [1, 1.08, 1, 1.08, 1],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              <svg width="80" height="80" viewBox="0 0 80 80" className="text-kodeen-black">
                <motion.path
                  d="M40 10 L40 70 M25 25 L40 40 L25 55 M55 25 L40 40 L55 55"
                  stroke="currentColor"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1, ease: 'easeInOut' }}
                />
                <motion.circle
                  cx="40"
                  cy="40"
                  r="35"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 1.2, delay: 0.3, ease: 'easeInOut' }}
                />
              </svg>
            </motion.div>
            <motion.div
              className="mt-8 overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <motion.h1
                className="font-display text-4xl md:text-5xl font-bold tracking-tight"
                initial={{ y: 50 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.6, delay: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
              >
                KODEEN HUNTER
              </motion.h1>
            </motion.div>
            <motion.div
              className="mt-3 overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <motion.p
                className="text-sm tracking-[0.3em] text-kodeen-gray-500 uppercase"
                initial={{ y: 30 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.5, delay: 0.9, ease: 'easeOut' }}
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
