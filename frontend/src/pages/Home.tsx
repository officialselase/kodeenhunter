import { useRef, Suspense, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Play, ArrowRight, Award, Film, Users } from 'lucide-react'
import Camera3D from '../components/Camera3D'
import HeartbeatLoader from '../components/HeartbeatLoader'
import { portfolioApi, Project } from '../services/api'

const fallbackProjects = [
  {
    id: 1,
    title: 'Midnight Echoes',
    slug: 'midnight-echoes',
    category: { id: 1, name: 'Music Video', slug: 'music-videos' },
    thumbnail: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&q=80',
    video_url: '',
    description: '',
    year: 2024,
    featured: true,
  },
  {
    id: 2,
    title: 'Urban Pulse',
    slug: 'urban-pulse',
    category: { id: 2, name: 'Commercial', slug: 'commercials' },
    thumbnail: 'https://images.unsplash.com/photo-1536240478700-b869070f9279?w=800&q=80',
    video_url: '',
    description: '',
    year: 2024,
    featured: true,
  },
  {
    id: 3,
    title: 'Beyond the Frame',
    slug: 'beyond-the-frame',
    category: { id: 3, name: 'Short Film', slug: 'short-films' },
    thumbnail: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800&q=80',
    video_url: '',
    description: '',
    year: 2023,
    featured: true,
  },
]

const stats = [
  { icon: Film, value: '150+', label: 'Projects Completed' },
  { icon: Award, value: '12', label: 'Awards Won' },
  { icon: Users, value: '50+', label: 'Happy Clients' },
]

const Home = () => {
  const heroRef = useRef<HTMLDivElement>(null)
  const [featuredProjects, setFeaturedProjects] = useState<Project[]>(fallbackProjects)

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  })

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 1.1])
  const y = useTransform(scrollYProgress, [0, 0.5], [0, 100])

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const data = await portfolioApi.getFeaturedProjects()
        if (data.length > 0) {
          setFeaturedProjects(data.slice(0, 3))
        }
      } catch (error) {
        console.log('Using fallback featured projects:', error)
      }
    }
    fetchFeatured()
  }, [])

  return (
    <div className="bg-white">
      <section ref={heroRef} className="relative min-h-screen flex items-center overflow-hidden">
        <motion.div
          style={{ opacity, scale }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-white via-white/50 to-white z-10" />
          <img
            src="https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=1920&q=80"
            alt="Background"
            className="w-full h-full object-cover opacity-20"
          />
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

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="hidden lg:block"
          >
            <Suspense fallback={<HeartbeatLoader />}>
              <Camera3D />
            </Suspense>
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

          <div className="grid md:grid-cols-3 gap-6">
            {featuredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link to={`/portfolio/${project.slug || project.id}`} className="group block">
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
                </Link>
              </motion.div>
            ))}
          </div>

          <div className="md:hidden mt-10 text-center">
            <Link to="/portfolio" className="btn-secondary inline-flex items-center gap-2">
              View All Projects <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="py-24 bg-kodeen-black text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <motion.span
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="text-kodeen-gray-400 text-sm tracking-[0.3em] uppercase"
              >
                About Me
              </motion.span>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="font-display text-4xl md:text-5xl font-bold mt-2 mb-6"
              >
                The Vision Behind
                <br />
                The Lens
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-kodeen-gray-400 mb-8"
              >
                With over a decade of experience in visual storytelling, I've had the privilege 
                of working with global brands, emerging artists, and creative visionaries. 
                Every project is an opportunity to push boundaries and create something extraordinary.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                <Link
                  to="/about"
                  className="inline-flex items-center gap-2 text-sm font-medium border-b border-white pb-1 hover:gap-4 transition-all"
                >
                  Learn More <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative"
            >
              <img
                src="https://images.unsplash.com/photo-1540390769625-2fc3f8b1f587?w=800&q=80"
                alt="Kodeen Hunter"
                className="rounded-lg grayscale hover:grayscale-0 transition-all duration-700"
              />
              <div className="absolute -bottom-6 -right-6 bg-white text-kodeen-black p-6 rounded-lg shadow-xl">
                <p className="font-display text-3xl font-bold">10+</p>
                <p className="text-sm text-kodeen-gray-500">Years Experience</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-24">
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
    </div>
  )
}

export default Home
