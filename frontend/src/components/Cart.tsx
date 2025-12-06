import { motion, AnimatePresence } from 'framer-motion'
import { X, Minus, Plus, ShoppingBag } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useState } from 'react'
import Checkout from './Checkout'

interface CartProps {
  isOpen: boolean
  onClose: () => void
}

const Cart = ({ isOpen, onClose }: CartProps) => {
  const { items, removeItem, updateQuantity, total, clearCart } = useCart()
  const [checkoutOpen, setCheckoutOpen] = useState(false)

  const handleCheckout = () => {
    setCheckoutOpen(true)
    onClose() // Close cart when opening checkout
  }

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              key="cart-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-black/20 z-50"
            />
            <motion.div
              key="cart-panel"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 shadow-2xl"
            >
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between p-6 border-b border-kodeen-gray-100">
                <h2 className="font-display text-xl font-semibold">Your Cart</h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-kodeen-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                {items.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <ShoppingBag className="w-16 h-16 text-kodeen-gray-300 mb-4" />
                    <p className="text-kodeen-gray-500 mb-2">Your cart is empty</p>
                    <p className="text-sm text-kodeen-gray-400">
                      Add some items to get started
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {items.map((item) => (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -100 }}
                        className="flex gap-4"
                      >
                        <div className="w-20 h-20 bg-kodeen-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-sm">{item.name}</h3>
                          <p className="text-kodeen-gray-500 text-sm mt-1">
                            ${item.price.toFixed(2)}
                          </p>
                          <div className="flex items-center gap-3 mt-2">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-7 h-7 rounded-full border border-kodeen-gray-200 flex items-center justify-center hover:bg-kodeen-gray-100 transition-colors"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-sm font-medium w-6 text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-7 h-7 rounded-full border border-kodeen-gray-200 flex items-center justify-center hover:bg-kodeen-gray-100 transition-colors"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-kodeen-gray-400 hover:text-kodeen-black transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {items.length > 0 && (
                <div className="border-t border-kodeen-gray-100 p-6 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-kodeen-gray-500">Subtotal</span>
                    <span className="font-semibold">${total.toFixed(2)}</span>
                  </div>
                  <button onClick={handleCheckout} className="btn-primary w-full text-center">
                    Checkout
                  </button>
                  <button
                    onClick={clearCart}
                    className="w-full text-center text-sm text-kodeen-gray-500 hover:text-kodeen-black transition-colors"
                  >
                    Clear Cart
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </>
        )}
      </AnimatePresence>
      
      <Checkout isOpen={checkoutOpen} onClose={() => setCheckoutOpen(false)} />
    </>
  )
}

export default Cart
