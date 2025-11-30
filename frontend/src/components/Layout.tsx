import { ReactNode, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, ShoppingBag } from 'lucide-react'
import { useCart } from '../context/CartContext'
import Cart from './Cart'

interface LayoutProps {
  children: ReactNode
}

const navLinks = [
  { path: '/', label: 'Home' },
  { path: '/portfolio', label: 'Portfolio' },
  { path: '/about', label: 'About' },
  { path: '/shop', label: 'Shop' },
  { path: '/contact', label: 'Contact' },
]

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)
  const { itemCount } = useCart()

  return (
    <div className="min-h-screen bg-white">
      <header className="fixed top-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-md">
        <nav className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <motion.div
              className="relative"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <svg width="40" height="40" viewBox="0 0 80 80" className="text-kodeen-black">
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
            <span className="font-display text-lg font-semibold tracking-tight hidden sm:block">
              KODEEN HUNTER
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`nav-link ${
                  location.pathname === link.path ? 'text-kodeen-black' : 'text-kodeen-gray-500'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setCartOpen(true)}
              className="relative p-2 hover:bg-kodeen-gray-100 rounded-full transition-colors"
            >
              <ShoppingBag className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-kodeen-black text-white text-xs rounded-full flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-2 hover:bg-kodeen-gray-100 rounded-full transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </nav>
      </header>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-white"
          >
            <div className="p-6 flex justify-between items-center">
              <span className="font-display text-lg font-semibold">KODEEN HUNTER</span>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 hover:bg-kodeen-gray-100 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <nav className="flex flex-col items-center justify-center h-[calc(100vh-100px)] gap-8">
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.path}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    to={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`text-3xl font-display font-medium ${
                      location.pathname === link.path
                        ? 'text-kodeen-black'
                        : 'text-kodeen-gray-400'
                    }`}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      <Cart isOpen={cartOpen} onClose={() => setCartOpen(false)} />

      <main className="pt-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      <footer className="bg-white border-t border-kodeen-gray-100 mt-20">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid md:grid-cols-4 gap-10">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <svg width="32" height="32" viewBox="0 0 80 80" className="text-kodeen-black">
                  <path
                    d="M40 15 L40 65 M28 28 L40 40 L28 52 M52 28 L40 40 L52 52"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                  />
                  <circle cx="40" cy="40" r="32" stroke="currentColor" strokeWidth="1.5" fill="none" />
                </svg>
                <span className="font-display text-lg font-semibold">KODEEN HUNTER</span>
              </div>
              <p className="text-kodeen-gray-500 text-sm max-w-sm">
                Crafting visual stories that captivate and inspire. Professional videography for music videos, commercials, and creative projects.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-sm tracking-wider uppercase">Navigation</h4>
              <ul className="space-y-2">
                {navLinks.map((link) => (
                  <li key={link.path}>
                    <Link
                      to={link.path}
                      className="text-kodeen-gray-500 hover:text-kodeen-black transition-colors text-sm"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-sm tracking-wider uppercase">Connect</h4>
              <ul className="space-y-2 text-sm text-kodeen-gray-500">
                <li><a href="#" className="hover:text-kodeen-black transition-colors">Instagram</a></li>
                <li><a href="#" className="hover:text-kodeen-black transition-colors">YouTube</a></li>
                <li><a href="#" className="hover:text-kodeen-black transition-colors">Vimeo</a></li>
                <li><a href="#" className="hover:text-kodeen-black transition-colors">Twitter</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-kodeen-gray-100 mt-12 pt-8 text-center text-sm text-kodeen-gray-400">
            <p>&copy; {new Date().getFullYear()} Kodeen Hunter. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Layout
