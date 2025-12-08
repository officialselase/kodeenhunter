import { useRef, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { Play, ArrowRight, Award, Film, Users, Star, Quote, Video, Camera, Palette, Music, Plane, ShoppingBag, Eye, Check } from 'lucide-react'
import { portfolioApi, shopApi, homepageApi, newsletterApi, Project, Service, Testimonial, Award as AwardType, Product } from '../services/api'
import ProjectModal from '../components/ProjectModal'
import ProductModal from '../components/ProductModal'
import { useCart } from '../context/CartContext'
import { trackContact } from '../utils/analytics'

const stats = [
  { icon: Film, value: '150+', label: 'Projects Completed' },
  { icon: Award, value: '12', label: 'Awards Won' },
  { icon: Users, value: '50+', label: 'Happy Clients' },
]

const iconMap: Record<string, typeof Video> = {
  Video, Camera, Palette, Music, Film, Plane
}

const Home = () => {
  const heroRef = useRef<HTMLDivElement>(null)
  const [featuredProjects, setFeaturedProjects] = useState<Project[]>([])
  const [selectedProject, setSelectedProject] = useState<string | null>(null)
  const [services, setServices] = useState<Service[]>([])
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [awards, setAwards] = useState<AwardType[]>([])
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [currentTestimonial, setCurrentTestimonial] = useState(0)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [addedItems, setAddedItems] = useState<number[]>([])
  const [newsletterEmail, setNewsletterEmail] = useState('')
  const [newsletterStatus, setNewsletterStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [newsletterMessage, setNewsletterMessage] = useState('')
  const { addItem } = useCart()

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  })

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 1.1])
  const y = useTransform(scrollYProgress, [0, 0.5], [0, 100])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projects, servicesData, testimonialsData, awardsData, products] = await Promise.allSettled([
          portfolioApi.getFeaturedProjects(),
          homepageApi.getServices(),
          homepageApi.getTestimonials(),
          homepageApi.getAwards(),
          shopApi.getFeaturedProducts()
        ])
        
        if (projects.status === 'fulfilled') {
          setFeaturedProjects(projects.value.slice(0, 3))
        }
        if (servicesData.status === 'fulfilled') {
          setServices(servicesData.value)
        }
        if (testimonialsData.status === 'fulfilled') {
          setTestimonials(testimonialsData.value)
        }
        if (awardsData.status === 'fulfilled') {
          setAwards(awardsData.value)
        }
        if (products.status === 'fulfilled') {
          setFeaturedProducts(products.value.slice(0, 3))
        }
      } catch (error) {
        console.error('Error fetching homepage data:', error)
      }
    }
    fetchData()
  }, [])

  useEffect(() => {
    if (testimonials.length > 1) {
      const interval = setInterval(() => {
        setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
      }, 6000)
      return () => clearInterval(interval)
    }
  }, [testimonials.length])

  const handleNavigate = (direction: 'prev' | 'next') => {
    if (!selectedProject) return
    const currentIndex = featuredProjects.findIndex((p) => p.slug === selectedProject)
    if (direction === 'prev' && currentIndex > 0) {
      setSelectedProject(featuredProjects[currentIndex - 1].slug)
    } else if (direction === 'next' && currentIndex < featuredProjects.length - 1) {
      setSelectedProject(featuredProjects[currentIndex + 1].slug)
    }
  }

  const currentProjectIndex = selectedProject
    ? featuredProjects.findIndex((p) => p.slug === selectedProject)
    : -1

  return (
    <div className="bg-white">
      <section ref={heroRef} className="relative min-h-screen flex items-center overflow-hidden">
        <motion.div
          style={{ opacity, scale }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-white/60 via-white/40 to-white z-10" />
          {/* Hero background video */}
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover opacity-40"
          >
            <source
              src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
              type="video/mp4"
            />
          </video>
        </motion.div>

        <div className="relative z-20 max-w-7xl mx-auto px-6 py-32 grid lg:grid-cols-2 gap-16 items-center">
          <motion.div style={{ y }}>
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-block text-kodeen-gray-500 text-sm tracking-[0.3em] uppercase mb-6"
            >
              Videographer / Director
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="font-display text-5xl md:text-7xl font-bold leading-tight mb-6"
            >
              Crafting
              <br />
              <span className="text-stroke">Visual</span>
              <br />
              Stories
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-kodeen-gray-500 text-lg max-w-md mb-8"
            >
              Transforming moments into cinematic experiences. From music videos to commercials, 
              every frame tells a story worth remembering.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap gap-4"
            >
              <Link to="/portfolio" className="btn-primary inline-flex items-center gap-2">
                View Work <ArrowRight className="w-4 h-4" />
              </Link>
              <button className="btn-secondary inline-flex items-center gap-2">
                <Play className="w-4 h-4" /> Play Reel
              </button>
            </motion.div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-6 h-10 border-2 border-kodeen-black rounded-full flex justify-center pt-2"
          >
            <motion.div
              animate={{ y: [0, 8, 0], opacity: [1, 0.5, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1 h-2 bg-kodeen-black rounded-full"
            />
          </motion.div>
        </motion.div>
      </section>

      <section className="py-20 bg-kodeen-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center py-10"
              >
                <stat.icon className="w-8 h-8 mx-auto mb-4 text-kodeen-gray-400" />
                <p className="font-display text-4xl font-bold mb-2">{stat.value}</p>
                <p className="text-kodeen-gray-500 text-sm tracking-wide">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-end justify-between mb-12">
            <div>
              <motion.span
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="text-kodeen-gray-500 text-sm tracking-[0.3em] uppercase"
              >
                Selected Work
              </motion.span>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="section-title text-4xl md:text-5xl mt-2"
              >
                Featured Projects
              </motion.h2>
            </div>
            <Link
              to="/portfolio"
              className="hidden md:flex items-center gap-2 text-sm font-medium hover:gap-4 transition-all"
            >
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {featuredProjects.length === 0 ? (
            <div className="text-center py-12 text-kodeen-gray-400">
              <p>No featured projects available at the moment.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-6">
              {featuredProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div
                    onClick={() => setSelectedProject(project.slug)}
                    className="group block cursor-pointer"
                  >
                    <div className="portfolio-card aspect-[4/5] rounded-lg overflow-hidden mb-4">
                      <img
                        src={project.thumbnail}
                        alt={project.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10">
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          className="w-16 h-16 rounded-full bg-white flex items-center justify-center"
                        >
                          <Play className="w-6 h-6 text-kodeen-black ml-1" />
                        </motion.div>
                      </div>
                    </div>
                    <p className="text-kodeen-gray-400 text-xs tracking-wider uppercase mb-1">
                      {project.category.name}
                    </p>
                    <h3 className="font-display text-xl font-medium group-hover:text-kodeen-gray-600 transition-colors">
                      {project.title}
                    </h3>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          <div className="md:hidden mt-10 text-center">
            <Link to="/portfolio" className="btn-secondary inline-flex items-center gap-2">
              View All Projects <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {services.length > 0 && (
        <section className="py-24 bg-kodeen-gray-50">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <motion.span
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="text-kodeen-gray-500 text-sm tracking-[0.3em] uppercase"
              >
                What I Do
              </motion.span>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="section-title text-4xl md:text-5xl mt-2"
              >
                Services Offered
              </motion.h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service, index) => {
                const IconComponent = iconMap[service.icon] || Video
                return (
                  <motion.div
                    key={service.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white p-8 rounded-lg hover:shadow-lg transition-shadow group"
                  >
                    <div className="w-12 h-12 bg-kodeen-gray-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-kodeen-black transition-colors">
                      <IconComponent className="w-6 h-6 text-kodeen-gray-600 group-hover:text-white transition-colors" />
                    </div>
                    <h3 className="font-display text-xl font-medium mb-3">{service.name}</h3>
                    <p className="text-kodeen-gray-500 text-sm leading-relaxed">
                      {service.short_description}
                    </p>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {testimonials.length > 0 && (
        <section className="py-24 bg-white">
          <div className="max-w-4xl mx-auto px-6">
            <div className="text-center mb-16">
              <motion.span
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="text-kodeen-gray-500 text-sm tracking-[0.3em] uppercase"
              >
                Client Feedback
              </motion.span>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="section-title text-4xl md:text-5xl mt-2"
              >
                What Clients Say
              </motion.h2>
            </div>

            <div className="relative">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentTestimonial}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="text-center"
                >
                  <Quote className="w-12 h-12 text-kodeen-gray-200 mx-auto mb-6" />
                  <p className="text-xl md:text-2xl text-kodeen-gray-700 leading-relaxed mb-8 italic">
                    "{testimonials[currentTestimonial].testimonial}"
                  </p>
                  <div className="flex items-center justify-center gap-4">
                    {testimonials[currentTestimonial].client_photo && (
                      <img
                        src={testimonials[currentTestimonial].client_photo}
                        alt={testimonials[currentTestimonial].client_name}
                        className="w-16 h-16 rounded-full object-cover grayscale"
                      />
                    )}
                    <div className="text-left">
                      <p className="font-display font-medium text-lg">
                        {testimonials[currentTestimonial].client_name}
                      </p>
                      <p className="text-kodeen-gray-500 text-sm">
                        {testimonials[currentTestimonial].client_title}
                        {testimonials[currentTestimonial].client_company && 
                          ` at ${testimonials[currentTestimonial].client_company}`}
                      </p>
                      <div className="flex gap-1 mt-1">
                        {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-kodeen-black text-kodeen-black" />
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              {testimonials.length > 1 && (
                <div className="flex justify-center gap-2 mt-8">
                  {testimonials.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentTestimonial(index)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        index === currentTestimonial
                          ? 'bg-kodeen-black w-8'
                          : 'bg-kodeen-gray-300 hover:bg-kodeen-gray-400'
                      }`}
                      aria-label={`View testimonial ${index + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {featuredProducts.length > 0 && (
        <section className="py-24 bg-kodeen-gray-50">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-end justify-between mb-12">
              <div>
                <motion.span
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  className="text-kodeen-gray-500 text-sm tracking-[0.3em] uppercase"
                >
                  Digital Products
                </motion.span>
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="section-title text-4xl md:text-5xl mt-2"
                >
                  Latest from Shop
                </motion.h2>
              </div>
              <Link
                to="/shop"
                className="hidden md:flex items-center gap-2 text-sm font-medium hover:gap-4 transition-all"
              >
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {featuredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
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
                        onClick={() => {
                          const price = typeof product.current_price === 'number' 
                            ? product.current_price 
                            : parseFloat(String(product.current_price))
                          
                          addItem({
                            id: product.id,
                            name: product.name,
                            price: price,
                            image: product.image,
                          })
                          setAddedItems((prev) => [...prev, product.id])
                          setTimeout(() => {
                            setAddedItems((prev) => prev.filter((id) => id !== product.id))
                          }, 2000)
                        }}
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
                  </div>
                  <p className="text-kodeen-gray-400 text-xs tracking-wider uppercase mb-1">
                    {product.category.name}
                  </p>
                  <h3 className="font-display text-xl font-medium mb-2 group-hover:text-kodeen-gray-600 transition-colors">
                    {product.name}
                  </h3>
                  <p className="font-medium">
                    {product.sale_price ? (
                      <>
                        <span className="text-kodeen-gray-400 line-through mr-2">${product.price}</span>
                        <span>${product.sale_price}</span>
                      </>
                    ) : (
                      <span>${product.price}</span>
                    )}
                  </p>
                </motion.div>
              ))}
            </div>

            <div className="md:hidden mt-10 text-center">
              <Link to="/shop" className="btn-secondary inline-flex items-center gap-2">
                View All Products <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {awards.length > 0 && (
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <motion.span
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="text-kodeen-gray-500 text-sm tracking-[0.3em] uppercase"
              >
                Recognition
              </motion.span>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="section-title text-4xl md:text-5xl mt-2"
              >
                Awards & Achievements
              </motion.h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {awards.map((award, index) => (
                <motion.div
                  key={award.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center group"
                >
                  <div className="w-20 h-20 bg-kodeen-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-kodeen-black transition-colors">
                    <Award className="w-10 h-10 text-kodeen-gray-600 group-hover:text-white transition-colors" />
                  </div>
                  <p className="text-kodeen-gray-400 text-xs tracking-wider uppercase mb-2">
                    {award.year}
                  </p>
                  <h3 className="font-display text-lg font-medium mb-1">{award.title}</h3>
                  <p className="text-kodeen-gray-500 text-sm">{award.organization}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-24 bg-kodeen-gray-50">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display text-4xl md:text-5xl font-bold mb-6"
          >
            Let's Create
            <br />
            Something Amazing
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-kodeen-gray-500 mb-8 max-w-lg mx-auto"
          >
            Have a project in mind? I'd love to hear about it. Let's discuss how we can bring your vision to life.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <Link to="/contact" className="btn-primary inline-flex items-center gap-2">
              Get In Touch <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      <section className="py-24 bg-kodeen-gray-50">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <motion.span
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-kodeen-gray-500 text-sm tracking-[0.3em] uppercase"
            >
              Stay Connected
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="section-title text-4xl md:text-5xl mt-2"
            >
              Join the Newsletter
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-kodeen-gray-500 mt-4 max-w-2xl mx-auto"
            >
              Get exclusive behind-the-scenes content, early access to new projects, and special offers delivered to your inbox.
            </motion.p>
          </div>

          <motion.form
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            onSubmit={async (e) => {
              e.preventDefault()
              setNewsletterStatus('loading')
              setNewsletterMessage('')
              
              try {
                const response = await newsletterApi.subscribe({
                  email: newsletterEmail,
                  source: 'homepage'
                })
                setNewsletterStatus('success')
                setNewsletterMessage(response.message)
                setNewsletterEmail('')
                trackContact.submitForm('newsletter')
                
                // Reset success message after 5 seconds
                setTimeout(() => {
                  setNewsletterStatus('idle')
                  setNewsletterMessage('')
                }, 5000)
              } catch (error) {
                setNewsletterStatus('error')
                setNewsletterMessage(error instanceof Error ? error.message : 'Failed to subscribe. Please try again.')
                
                // Reset error message after 5 seconds
                setTimeout(() => {
                  setNewsletterStatus('idle')
                  setNewsletterMessage('')
                }, 5000)
              }
            }}
            className="max-w-md mx-auto"
          >
            <div className="flex gap-2">
              <input
                type="email"
                name="email"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="Enter your email"
                required
                disabled={newsletterStatus === 'loading' || newsletterStatus === 'success'}
                className="flex-1 px-4 py-3 rounded-lg border border-kodeen-gray-300 focus:outline-none focus:border-kodeen-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <button
                type="submit"
                disabled={newsletterStatus === 'loading' || newsletterStatus === 'success'}
                className="btn-primary whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {newsletterStatus === 'loading' ? 'Subscribing...' : newsletterStatus === 'success' ? 'Subscribed!' : 'Subscribe'}
              </button>
            </div>
            {newsletterMessage && (
              <p className={`text-sm mt-3 text-center ${newsletterStatus === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                {newsletterMessage}
              </p>
            )}
            {!newsletterMessage && (
              <p className="text-xs text-kodeen-gray-400 mt-3 text-center">
                No spam, unsubscribe anytime. Your privacy is important to us.
              </p>
            )}
          </motion.form>
        </div>
      </section>

      <AnimatePresence>
        {selectedProject && (
          <ProjectModal
            projectSlug={selectedProject}
            onClose={() => setSelectedProject(null)}
            onNavigate={handleNavigate}
            hasPrev={currentProjectIndex > 0}
            hasNext={currentProjectIndex < featuredProjects.length - 1}
          />
        )}
      </AnimatePresence>

      <ProductModal 
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </div>
  )
}

export default Home
