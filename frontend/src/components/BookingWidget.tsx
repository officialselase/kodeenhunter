import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar, X, Minimize2, Maximize2 } from 'lucide-react'
import BookingForm from './BookingForm'

export default function BookingWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)

  return (
    <>
      {/* Floating Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-50 bg-black text-white p-4 rounded-full shadow-2xl hover:bg-gray-800 transition-colors"
            aria-label="Open booking form"
          >
            <Calendar className="w-6 h-6" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Booking Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
            />

            {/* Panel */}
            <motion.div
              initial={{ x: '100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className={`fixed right-0 top-0 h-full bg-white shadow-2xl z-50 flex flex-col ${
                isMinimized ? 'w-80' : 'w-full md:w-[600px]'
              }`}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <Calendar className="w-6 h-6" />
                  <h2 className="text-2xl font-bold">Book a Session</h2>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsMinimized(!isMinimized)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    aria-label={isMinimized ? 'Maximize' : 'Minimize'}
                  >
                    {isMinimized ? (
                      <Maximize2 className="w-5 h-5" />
                    ) : (
                      <Minimize2 className="w-5 h-5" />
                    )}
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    aria-label="Close booking form"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Content */}
              {!isMinimized && (
                <div className="flex-1 overflow-y-auto">
                  <BookingForm onSuccess={() => setIsOpen(false)} />
                </div>
              )}

              {isMinimized && (
                <div className="p-6 text-center text-gray-500">
                  <p>Click maximize to continue booking</p>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
