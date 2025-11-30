import { motion } from 'framer-motion'

interface HeartbeatLoaderProps {
  size?: 'sm' | 'md' | 'lg'
  showText?: boolean
}

const HeartbeatLoader = ({ size = 'md', showText = true }: HeartbeatLoaderProps) => {
  const sizes = {
    sm: { icon: 24, text: 'text-xs' },
    md: { icon: 40, text: 'text-sm' },
    lg: { icon: 60, text: 'text-base' },
  }

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <motion.div
        animate={{
          scale: [1, 1.1, 1, 1.1, 1],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        <svg
          width={sizes[size].icon}
          height={sizes[size].icon}
          viewBox="0 0 80 80"
          className="text-kodeen-black"
        >
          <path
            d="M40 15 L40 65 M28 28 L40 40 L28 52 M52 28 L40 40 L52 52"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          <circle
            cx="40"
            cy="40"
            r="32"
            stroke="currentColor"
            strokeWidth="1.5"
            fill="none"
          />
        </svg>
      </motion.div>
      {showText && (
        <motion.p
          className={`${sizes[size].text} text-kodeen-gray-400 tracking-widest uppercase`}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          Loading
        </motion.p>
      )}
    </div>
  )
}

export default HeartbeatLoader
