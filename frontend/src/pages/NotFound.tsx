import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Home, ArrowLeft } from 'lucide-react'
import SEO from '../components/SEO'

const NotFound = () => {
  return (
    <>
      <SEO
        title="404 - Page Not Found"
        description="The page you're looking for doesn't exist."
      />
      
      <div className="min-h-screen bg-white flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl"
        >
          {/* 404 Number */}
          <motion.h1
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-[150px] md:text-[200px] font-display font-bold leading-none mb-4"
          >
            404
          </motion.h1>

          {/* Message */}
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
            Page Not Found
          </h2>
          <p className="text-lg text-kodeen-gray-500 mb-12 max-w-md mx-auto">
            The page you're looking for doesn't exist or has been moved.
            Let's get you back on track.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-kodeen-black text-white rounded-full hover:bg-kodeen-gray-800 transition-colors"
            >
              <Home size={20} />
              Go Home
            </Link>
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-kodeen-gray-300 rounded-full hover:bg-kodeen-gray-50 transition-colors"
            >
              <ArrowLeft size={20} />
              Go Back
            </button>
          </div>

          {/* Helpful Links */}
          <div className="mt-16 pt-8 border-t border-kodeen-gray-200">
            <p className="text-sm text-kodeen-gray-400 mb-4">
              Or explore these pages:
            </p>
            <div className="flex flex-wrap gap-4 justify-center text-sm">
              <Link
                to="/portfolio"
                className="text-kodeen-gray-600 hover:text-kodeen-black transition-colors"
              >
                Portfolio
              </Link>
              <Link
                to="/shop"
                className="text-kodeen-gray-600 hover:text-kodeen-black transition-colors"
              >
                Shop
              </Link>
              <Link
                to="/about"
                className="text-kodeen-gray-600 hover:text-kodeen-black transition-colors"
              >
                About
              </Link>
              <Link
                to="/contact"
                className="text-kodeen-gray-600 hover:text-kodeen-black transition-colors"
              >
                Contact
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  )
}

export default NotFound
