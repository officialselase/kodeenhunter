import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Home, RefreshCw } from 'lucide-react'
import SEO from '../components/SEO'

const ServerError = () => {
  return (
    <>
      <SEO
        title="500 - Server Error"
        description="Something went wrong on our end. We're working to fix it."
      />
      
      <div className="min-h-screen bg-white flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl"
        >
          {/* 500 Number */}
          <motion.h1
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-[150px] md:text-[200px] font-display font-bold leading-none mb-4"
          >
            500
          </motion.h1>

          {/* Message */}
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
            Server Error
          </h2>
          <p className="text-lg text-kodeen-gray-500 mb-12 max-w-md mx-auto">
            Something went wrong on our end. Our team has been notified and
            we're working to fix it.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-kodeen-black text-white rounded-full hover:bg-kodeen-gray-800 transition-colors"
            >
              <RefreshCw size={20} />
              Try Again
            </button>
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-kodeen-gray-300 rounded-full hover:bg-kodeen-gray-50 transition-colors"
            >
              <Home size={20} />
              Go Home
            </Link>
          </div>

          {/* Status Updates */}
          <div className="mt-16 pt-8 border-t border-kodeen-gray-200">
            <p className="text-sm text-kodeen-gray-400 mb-4">
              If the problem persists, please contact us:
            </p>
            <Link
              to="/contact"
              className="text-kodeen-gray-600 hover:text-kodeen-black transition-colors underline"
            >
              Contact Support
            </Link>
          </div>
        </motion.div>
      </div>
    </>
  )
}

export default ServerError
