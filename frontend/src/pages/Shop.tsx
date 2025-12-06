import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingBag, Check, Eye } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { shopApi, Product } from '../services/api'
import ProductModal from '../components/ProductModal'

const fallbackProducts = [
  {
    id: 1,
    name: 'Cinematic LUT Pack',
    slug: 'cinematic-lut-pack',
    category: { id: 1, name: 'LUTs', slug: 'luts' },
    price: '49.99',
    sale_price: null,
    current_price: 49.99,
    description: '20 professional cinematic LUTs for film-like color grading',
    image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=600&q=80',
    features: ['20 LUTs', 'Compatible with all NLEs', 'Before/After previews'],
    featured: true,
    is_digital: true,
  },
  {
    id: 2,
    name: 'Music Video Presets',
    slug: 'music-video-presets',
    category: { id: 2, name: 'Presets', slug: 'presets' },
    price: '39.99',
    sale_price: null,
    current_price: 39.99,
    description: 'Premiere Pro presets for stunning music video looks',
    image: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=600&q=80',
    features: ['15 Presets', 'One-click application', 'Adjustable parameters'],
    featured: true,
    is_digital: true,
  },
  {
    id: 3,
    name: 'Transition Pack Vol.1',
    slug: 'transition-pack-vol-1',
    category: { id: 3, name: 'Templates', slug: 'templates' },
    price: '29.99',
    sale_price: null,
    current_price: 29.99,
    description: 'Smooth, professional transitions for your edits',
    image: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=600&q=80',
    features: ['50+ Transitions', 'Easy to use', 'Sound effects included'],
    featured: true,
    is_digital: true,
  },
  {
    id: 4,
    name: 'Kodeen Hunter Tee',
    slug: 'kodeen-hunter-tee',
    category: { id: 4, name: 'Merchandise', slug: 'merchandise' },
    price: '34.99',
    sale_price: null,
    current_price: 34.99,
    description: 'Premium cotton tee with embroidered logo',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80',
    features: ['100% Cotton', 'Embroidered logo', 'Multiple sizes'],
    featured: false,
    is_digital: false,
  },
  {
    id: 5,
    name: 'Film Grain Overlays',
    slug: 'film-grain-overlays',
    category: { id: 3, name: 'Templates', slug: 'templates' },
    price: '24.99',
    sale_price: null,
    current_price: 24.99,
    description: 'Authentic film grain textures for vintage looks',
    image: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=600&q=80',
    features: ['4K Resolution', '10 Overlays', 'Loop-ready'],
    featured: false,
    is_digital: true,
  },
  {
    id: 6,
    name: 'Orange & Teal LUTs',
    slug: 'orange-teal-luts',
    category: { id: 1, name: 'LUTs', slug: 'luts' },
    price: '34.99',
    sale_price: null,
    current_price: 34.99,
    description: 'The classic cinematic look made easy',
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&q=80',
    features: ['12 Variations', 'LOG compatible', 'Skin tone safe'],
    featured: false,
    is_digital: true,
  },
]

const Shop = () => {
  const [products, setProducts] = useState<Product[]>(fallbackProducts)
  const [activeCategory, setActiveCategory] = useState('All')
  const [addedItems, setAddedItems] = useState<number[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const { addItem } = useCart()

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await shopApi.getProducts()
        if (data.length > 0) {
          setProducts(data)
        }
      } catch (error) {
        console.log('Using fallback products:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  const allCategories = ['All', ...new Set(products.map(p => p.category.name))]

  const filteredProducts = activeCategory === 'All'
    ? products
    : products.filter((p) => p.category.name === activeCategory)

  const handleAddToCart = (product: Product) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.current_price,
      image: product.image,
    })
    setAddedItems((prev) => [...prev, product.id])
    setTimeout(() => {
      setAddedItems((prev) => prev.filter((id) => id !== product.id))
    }, 2000)
  }

  return (
    <div className="bg-white min-h-screen">
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <span className="text-kodeen-gray-500 text-sm tracking-[0.3em] uppercase">
              Resources
            </span>
            <h1 className="font-display text-5xl md:text-6xl font-bold mt-2">
              Shop
            </h1>
            <p className="text-kodeen-gray-500 mt-4 max-w-lg mx-auto">
              Professional tools and resources to elevate your video production workflow
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-wrap justify-center gap-3 mb-12"
          >
            {allCategories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                  activeCategory === category
                    ? 'bg-kodeen-black text-white'
                    : 'bg-kodeen-gray-100 text-kodeen-gray-600 hover:bg-kodeen-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </motion.div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-pulse text-kodeen-gray-400">Loading products...</div>
            </div>
          ) : (
            <motion.div layout className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <AnimatePresence mode="popLayout">
                {filteredProducts.map((product, index) => (
                  <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: index * 0.05 }}
                    className="group"
                  >
                    <div className="relative aspect-square rounded-lg overflow-hidden bg-kodeen-gray-100 mb-4">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex flex-col items-center justify-center gap-3 opacity-0 group-hover:opacity-100">
                        <button 
                          onClick={() => setSelectedProduct(product)}
                          className="bg-white text-kodeen-black px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 hover:bg-kodeen-gray-100 transition-colors"
                        >
                          <Eye className="w-4 h-4" /> Quick View
                        </button>
                        <motion.button
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleAddToCart(product)}
                          className={`px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 transition-all ${
                            addedItems.includes(product.id)
                              ? 'bg-green-500 text-white'
                              : 'bg-kodeen-black text-white hover:bg-kodeen-gray-800'
                          }`}
                        >
                          {addedItems.includes(product.id) ? (
                            <>
                              <Check className="w-4 h-4" /> Added
                            </>
                          ) : (
                            <>
                              <ShoppingBag className="w-4 h-4" /> Add to Cart
                            </>
                          )}
                        </motion.button>
                      </div>
                      <span className="absolute top-4 left-4 bg-white px-3 py-1 rounded-full text-xs font-medium">
                        {product.category.name}
                      </span>
                      {product.sale_price && (
                        <span className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                          Sale
                        </span>
                      )}
                    </div>

                    <h3 className="font-display text-lg font-medium mb-1">
                      {product.name}
                    </h3>
                    <p className="text-kodeen-gray-500 text-sm mb-3">
                      {product.short_description || product.description}
                    </p>

                    <ul className="mb-4 space-y-1">
                      {product.features.map((feature) => (
                        <li key={feature} className="text-xs text-kodeen-gray-400 flex items-center gap-2">
                          <Check className="w-3 h-3" /> {feature}
                        </li>
                      ))}
                    </ul>

                    <div className="flex items-center gap-2">
                      <span className="font-display text-xl font-bold">
                        ${product.current_price.toFixed(2)}
                      </span>
                      {product.sale_price && (
                        <span className="text-kodeen-gray-400 line-through text-sm">
                          ${parseFloat(product.price).toFixed(2)}
                        </span>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-24 bg-kodeen-gray-50 rounded-2xl p-12 text-center"
          >
            <h2 className="font-display text-3xl font-bold mb-4">
              Need Custom Solutions?
            </h2>
            <p className="text-kodeen-gray-500 mb-6 max-w-lg mx-auto">
              Looking for custom LUTs, presets, or templates tailored to your specific needs? 
              Let's discuss your project.
            </p>
            <a href="/contact" className="btn-primary inline-block">
              Get in Touch
            </a>
          </motion.div>
        </div>
      </section>

      <ProductModal 
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </div>
  )
}

export default Shop
