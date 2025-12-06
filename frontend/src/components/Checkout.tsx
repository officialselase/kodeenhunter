import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ArrowLeft, CreditCard, Lock, Check, Mail, User, Phone } from 'lucide-react'
import { useCart } from '../context/CartContext'

interface CheckoutProps {
  isOpen: boolean
  onClose: () => void
}

type CheckoutStep = 'info' | 'payment' | 'success'

const Checkout = ({ isOpen, onClose }: CheckoutProps) => {
  const { items, total, checkout, isCheckingOut } = useCart()
  const [step, setStep] = useState<CheckoutStep>('info')
  const [orderNumber, setOrderNumber] = useState('')
  const [error, setError] = useState('')
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    notes: '',
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleSubmitInfo = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    // Basic validation
    if (!formData.name || !formData.email) {
      setError('Please fill in all required fields')
      return
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address')
      return
    }
    
    setStep('payment')
  }

  const handlePlaceOrder = async () => {
    setError('')
    
    try {
      const result = await checkout({
        customer_name: formData.name,
        customer_email: formData.email,
      })
      
      if (result.success && result.orderNumber) {
        setOrderNumber(result.orderNumber)
        setStep('success')
      } else {
        setError(result.error || 'Failed to place order. Please try again.')
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
      console.error('Checkout error:', err)
    }
  }

  const handleClose = () => {
    if (step === 'success') {
      // Reset everything on close after success
      setStep('info')
      setFormData({ name: '', email: '', phone: '', notes: '' })
      setOrderNumber('')
    }
    setError('')
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-4 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-2xl md:max-h-[90vh] bg-white rounded-2xl z-50 overflow-hidden shadow-2xl"
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-kodeen-gray-100">
                <div className="flex items-center gap-4">
                  {step !== 'info' && step !== 'success' && (
                    <button
                      onClick={() => setStep('info')}
                      className="p-2 hover:bg-kodeen-gray-100 rounded-full transition-colors"
                    >
                      <ArrowLeft className="w-5 h-5" />
                    </button>
                  )}
                  <h2 className="font-display text-xl font-semibold">
                    {step === 'info' && 'Checkout'}
                    {step === 'payment' && 'Payment'}
                    {step === 'success' && 'Order Confirmed'}
                  </h2>
                </div>
                <button
                  onClick={handleClose}
                  className="p-2 hover:bg-kodeen-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6">
                {/* Customer Info Step */}
                {step === 'info' && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <form onSubmit={handleSubmitInfo} className="space-y-6">
                      {/* Order Summary */}
                      <div className="bg-kodeen-gray-50 rounded-lg p-4">
                        <h3 className="font-semibold mb-3">Order Summary</h3>
                        <div className="space-y-2">
                          {items.map(item => (
                            <div key={item.id} className="flex justify-between text-sm">
                              <span className="text-kodeen-gray-600">
                                {item.name} × {item.quantity}
                              </span>
                              <span className="font-medium">
                                ${(item.price * item.quantity).toFixed(2)}
                              </span>
                            </div>
                          ))}
                          <div className="border-t border-kodeen-gray-200 pt-2 mt-2 flex justify-between font-semibold">
                            <span>Total</span>
                            <span>${total.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>

                      {/* Customer Information */}
                      <div className="space-y-4">
                        <h3 className="font-semibold">Your Information</h3>
                        
                        <div>
                          <label className="block text-sm font-medium text-kodeen-gray-700 mb-2">
                            Full Name *
                          </label>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-kodeen-gray-400" />
                            <input
                              type="text"
                              name="name"
                              value={formData.name}
                              onChange={handleInputChange}
                              required
                              className="w-full pl-10 pr-4 py-3 border border-kodeen-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-kodeen-black"
                              placeholder="John Doe"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-kodeen-gray-700 mb-2">
                            Email Address *
                          </label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-kodeen-gray-400" />
                            <input
                              type="email"
                              name="email"
                              value={formData.email}
                              onChange={handleInputChange}
                              required
                              className="w-full pl-10 pr-4 py-3 border border-kodeen-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-kodeen-black"
                              placeholder="john@example.com"
                            />
                          </div>
                          <p className="text-xs text-kodeen-gray-500 mt-1">
                            Download links will be sent to this email
                          </p>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-kodeen-gray-700 mb-2">
                            Phone Number (Optional)
                          </label>
                          <div className="relative">
                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-kodeen-gray-400" />
                            <input
                              type="tel"
                              name="phone"
                              value={formData.phone}
                              onChange={handleInputChange}
                              className="w-full pl-10 pr-4 py-3 border border-kodeen-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-kodeen-black"
                              placeholder="+1 (555) 000-0000"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-kodeen-gray-700 mb-2">
                            Order Notes (Optional)
                          </label>
                          <textarea
                            name="notes"
                            value={formData.notes}
                            onChange={handleInputChange}
                            rows={3}
                            className="w-full px-4 py-3 border border-kodeen-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-kodeen-black resize-none"
                            placeholder="Any special requests or notes..."
                          />
                        </div>
                      </div>

                      {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                          {error}
                        </div>
                      )}

                      <button
                        type="submit"
                        className="w-full btn-primary flex items-center justify-center gap-2"
                      >
                        Continue to Payment
                        <CreditCard className="w-5 h-5" />
                      </button>
                    </form>
                  </motion.div>
                )}

                {/* Payment Step */}
                {step === 'payment' && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <Lock className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <h4 className="font-semibold text-blue-900 mb-1">
                            Secure Payment
                          </h4>
                          <p className="text-sm text-blue-700">
                            Your payment information is encrypted and secure.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Order Summary */}
                    <div className="bg-kodeen-gray-50 rounded-lg p-4">
                      <h3 className="font-semibold mb-3">Order Details</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-kodeen-gray-600">Customer</span>
                          <span className="font-medium">{formData.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-kodeen-gray-600">Email</span>
                          <span className="font-medium">{formData.email}</span>
                        </div>
                        <div className="border-t border-kodeen-gray-200 pt-2 mt-2">
                          {items.map(item => (
                            <div key={item.id} className="flex justify-between mb-1">
                              <span className="text-kodeen-gray-600">
                                {item.name} × {item.quantity}
                              </span>
                              <span className="font-medium">
                                ${(item.price * item.quantity).toFixed(2)}
                              </span>
                            </div>
                          ))}
                        </div>
                        <div className="border-t border-kodeen-gray-200 pt-2 flex justify-between font-semibold text-base">
                          <span>Total</span>
                          <span>${total.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Payment Method Placeholder */}
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <p className="text-sm text-yellow-800">
                        <strong>Demo Mode:</strong> Payment gateway integration pending. 
                        Click "Place Order" to simulate a successful purchase.
                      </p>
                    </div>

                    {error && (
                      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                        {error}
                      </div>
                    )}

                    <button
                      onClick={handlePlaceOrder}
                      disabled={isCheckingOut}
                      className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isCheckingOut ? (
                        <>Processing...</>
                      ) : (
                        <>
                          <Lock className="w-5 h-5" />
                          Place Order - ${total.toFixed(2)}
                        </>
                      )}
                    </button>
                  </motion.div>
                )}

                {/* Success Step */}
                {step === 'success' && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-8 space-y-6"
                  >
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                      <Check className="w-10 h-10 text-green-600" />
                    </div>
                    
                    <div>
                      <h3 className="font-display text-2xl font-bold mb-2">
                        Order Confirmed!
                      </h3>
                      <p className="text-kodeen-gray-600">
                        Thank you for your purchase, {formData.name}
                      </p>
                    </div>

                    <div className="bg-kodeen-gray-50 rounded-lg p-6 space-y-3">
                      <div>
                        <p className="text-sm text-kodeen-gray-500 mb-1">Order Number</p>
                        <p className="font-mono font-semibold text-lg">{orderNumber}</p>
                      </div>
                      <div>
                        <p className="text-sm text-kodeen-gray-500 mb-1">Confirmation Email</p>
                        <p className="font-medium">{formData.email}</p>
                      </div>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left">
                      <h4 className="font-semibold text-blue-900 mb-2">What's Next?</h4>
                      <ul className="text-sm text-blue-700 space-y-1">
                        <li>• Check your email for order confirmation</li>
                        <li>• Download links have been sent to {formData.email}</li>
                        <li>• Save your order number for reference</li>
                      </ul>
                    </div>

                    <button
                      onClick={handleClose}
                      className="w-full btn-primary"
                    >
                      Continue Shopping
                    </button>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default Checkout
