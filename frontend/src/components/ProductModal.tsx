import { motion, AnimatePresence } from 'framer-motion'
import { X, ShoppingBag, Check, Heart, Download } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { Product } from '../services/api'
import { useCart } from '../context/CartContext'
import { useFocusTrap } from '../hooks/useFocusTrap'
import { useKeyboardNavigation } from '../hooks/useKeyboardNavigation'

interface ProductModalProps {
  product: Product | null
  isOpen: boolean
  onClose: () => void
}

const ProductModal = ({ product, isOpen, onClose }: ProductModalProps) => {
  const [added, setAdded] = useState(false)
  const { addItem } = useCart()
  const modalRef = useRef<HTMLDivElement>(null)

  useFocusTrap(modalRef, isOpen)
  useKeyboardNavigation({
    onEscape: onClose,
    enabled: isOpen,
  })

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  if (!product) return null

  const handleAddToCart = () => {
    const price = typeof product.current_price === 'number' 
      ? product.current_price 
      : parseFloat(String(product.current_price))
    
    addItem({
      id: product.id,
      name: product.name,
      price: price,
      image: product.image,
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm"
          />
          <motion.div
            ref={modalRef}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-4 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-4xl md:max-h-[90vh] bg-white rounded-2xl z-50 overflow-hidden shadow-2xl"
            role="dialog"
            aria-modal="true"
            aria-labelledby="product-modal-title"
          >
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between p-6 border-b border-kodeen-gray-100">
                <span className="text-sm text-kodeen-gray-500 tracking-wider uppercase">
                  {product.category.name}
                </span>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-kodeen-gray-100 rounded-full transition-colors"
                  aria-label="Close product details"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto">
                <div className="grid md:grid-cols-2 gap-8 p-6">
                  <div className="space-y-4">
                    <div className="aspect-square rounded-lg overflow-hidden bg-kodeen-gray-100">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h2 id="product-modal-title" className="font-display text-3xl font-bold mb-2">
                        {product.name}
                      </h2>
                      <div className="flex items-center gap-3 mb-4">
                        <span className="font-display text-2xl font-bold">
                          ${typeof product.current_price === 'number' 
                            ? product.current_price.toFixed(2) 
                            : parseFloat(String(product.current_price)).toFixed(2)}
                        </span>
                        {product.sale_price && (
                          <>
                            <span className="text-kodeen-gray-400 line-through text-lg">
                              ${parseFloat(product.price).toFixed(2)}
                            </span>
                            <span className="bg-red-500 text-white px-2 py-1 rounded text-xs font-medium">
                              SAVE ${(parseFloat(product.price) - (typeof product.current_price === 'number' 
                                ? product.current_price 
                                : parseFloat(String(product.current_price)))).toFixed(2)}
                            </span>
                          </>
                        )}
                      </div>
                      <p className="text-kodeen-gray-600 leading-relaxed">
                        {product.description}
                      </p>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-3">What's Included:</h3>
                      <ul className="space-y-2">
                        {product.features.map((feature, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm text-kodeen-gray-600">
                            <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {product.is_digital && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                          <Download className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <h4 className="font-semibold text-blue-900 mb-1">
                              Instant Digital Download
                            </h4>
                            <p className="text-sm text-blue-700">
                              Get immediate access after purchase. Download link sent to your email.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="flex gap-3 pt-4">
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={handleAddToCart}
                        className={`flex-1 px-6 py-3 rounded-full font-medium flex items-center justify-center gap-2 transition-all ${
                          added
                            ? 'bg-green-500 text-white'
                            : 'bg-kodeen-black text-white hover:bg-kodeen-gray-800'
                        }`}
                      >
                        {added ? (
                          <>
                            <Check className="w-5 h-5" /> Added to Cart
                          </>
                        ) : (
                          <>
                            <ShoppingBag className="w-5 h-5" /> Add to Cart
                          </>
                        )}
                      </motion.button>
                      <button 
                        className="px-4 py-3 rounded-full border border-kodeen-gray-200 hover:bg-kodeen-gray-50 transition-colors"
                        aria-label="Add to wishlist"
                      >
                        <Heart className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default ProductModal
