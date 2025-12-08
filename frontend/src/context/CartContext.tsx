import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { shopApi } from '../services/api'
import { secureStorage } from '../utils/security'

interface CartItem {
  id: number
  name: string
  price: number
  quantity: number
  image: string
}

interface CheckoutData {
  customer_name: string
  customer_email: string
}

interface CartContextType {
  items: CartItem[]
  addItem: (item: Omit<CartItem, 'quantity'>) => void
  removeItem: (id: number) => void
  updateQuantity: (id: number, quantity: number) => void
  clearCart: () => void
  checkout: (data: CheckoutData) => Promise<{ success: boolean; orderNumber?: string; error?: string }>
  itemCount: number
  total: number
  isCheckingOut: boolean
}

const CartContext = createContext<CartContextType | undefined>(undefined)

const CART_STORAGE_KEY = 'kodeen_cart'

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    // Load cart from localStorage on mount
    const stored = secureStorage.getItem(CART_STORAGE_KEY)
    if (stored && Array.isArray(stored)) {
      // Ensure prices are numbers when loading from storage
      return stored.map(item => ({
        ...item,
        price: typeof item.price === 'number' ? item.price : parseFloat(String(item.price))
      }))
    }
    return []
  })
  const [isCheckingOut, setIsCheckingOut] = useState(false)

  // Persist cart to localStorage whenever it changes
  useEffect(() => {
    secureStorage.setItem(CART_STORAGE_KEY, items)
  }, [items])

  const addItem = (newItem: Omit<CartItem, 'quantity'>) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === newItem.id)
      if (existingItem) {
        return prevItems.map((item) =>
          item.id === newItem.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      return [...prevItems, { ...newItem, quantity: 1 }]
    })
  }

  const removeItem = (id: number) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== id))
  }

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id)
      return
    }
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, quantity } : item
      )
    )
  }

  const clearCart = () => {
    setItems([])
    secureStorage.removeItem(CART_STORAGE_KEY)
  }

  const checkout = async (data: CheckoutData): Promise<{ success: boolean; orderNumber?: string; error?: string }> => {
    if (items.length === 0) {
      return { success: false, error: 'Cart is empty' }
    }

    setIsCheckingOut(true)

    try {
      const orderData = {
        customer_name: data.customer_name,
        customer_email: data.customer_email,
        items: items.map((item) => ({
          product_id: item.id,
          quantity: item.quantity,
        })),
      }

      const response = await shopApi.createOrder(orderData) as { order?: { order_number: string } }
      clearCart()
      return { success: true, orderNumber: response.order?.order_number }
    } catch (error) {
      console.error('Checkout error:', error)
      return { success: false, error: 'Unable to process your order. Please try again or contact support.' }
    } finally {
      setIsCheckingOut(false)
    }
  }

  const itemCount = items.reduce((count, item) => count + item.quantity, 0)
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <CartContext.Provider
      value={{ 
        items, 
        addItem, 
        removeItem, 
        updateQuantity, 
        clearCart, 
        checkout,
        itemCount, 
        total,
        isCheckingOut
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
