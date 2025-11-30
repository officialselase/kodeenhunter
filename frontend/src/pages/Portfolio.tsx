import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, X } from 'lucide-react'
import { portfolioApi, Project, Category } from '../services/api'

const fallbackProjects = [
  {
    id: 1,
    title: 'Midnight Echoes',
    slug: 'midnight-echoes',
    category: { id: 1, name: 'Music Videos', slug: 'music-videos' },
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
    category: { id: 2, name: 'Commercials', slug: 'commercials' },
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
    category: { id: 3, name: 'Short Films', slug: 'short-films' },
    thumbnail: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800&q=80',
    video_url: '',
    description: '',
    year: 2023,
    featured: true,
  },
  {
    id: 4,
    title: 'Neon Dreams',
    slug: 'neon-dreams',
    category: { id: 1, name: 'Music Videos', slug: 'music-videos' },
    thumbnail: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&q=80',
    video_url: '',
    description: '',
    year: 2023,
    featured: false,
  },
  {
    id: 5,
    title: 'The Journey',
    slug: 'the-journey',
    category: { id: 2, name: 'Commercials', slug: 'commercials' },
    thumbnail: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800&q=80',
    video_url: '',
    description: '',
    year: 2023,
    featured: false,
  },
  {
    id: 6,
    title: 'Summer Festival',
    slug: 'summer-festival',
    category: { id: 4, name: 'Events', slug: 'events' },
    thumbnail: 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=800&q=80',
    video_url: '',
    description: '',
    year: 2023,
    featured: false,
  },
]

const Portfolio = () => {
  const [projects, setProjects] = useState<Project[]>(fallbackProjects)
  const [categories, setCategories] = useState<Category[]>([])
  const [activeCategory, setActiveCategory] = useState('All')
  const [selectedProject, setSelectedProject] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projectsData, categoriesData] = await Promise.all([
          portfolioApi.getProjects(),
          portfolioApi.getCategories(),
        ])
        if (projectsData.length > 0) {
          setProjects(projectsData)
        }
        if (categoriesData.length > 0) {
          setCategories(categoriesData)
        }
      } catch (error) {
        console.log('Using fallback data:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const allCategories = ['All', ...new Set(
    categories.length > 0 
      ? categories.map(c => c.name)
      : projects.map(p => p.category.name)
  )]

  const filteredProjects = activeCategory === 'All'
    ? projects
    : projects.filter((p) => p.category.name === activeCategory)

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
              My Work
            </span>
            <h1 className="font-display text-5xl md:text-6xl font-bold mt-2">
              Portfolio
            </h1>
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
              <div className="animate-pulse text-kodeen-gray-400">Loading projects...</div>
            </div>
          ) : (
            <motion.div layout className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence mode="popLayout">
                {filteredProjects.map((project, index) => (
                  <motion.div
                    key={project.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <div
                      onClick={() => setSelectedProject(project.id)}
                      className="group cursor-pointer"
                    >
                      <div className="portfolio-card aspect-video rounded-lg overflow-hidden mb-4">
                        <img
                          src={project.thumbnail}
                          alt={project.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10">
                          <motion.div
                            whileHover={{ scale: 1.1 }}
                            className="w-14 h-14 rounded-full bg-white flex items-center justify-center"
                          >
                            <Play className="w-5 h-5 text-kodeen-black ml-1" />
                          </motion.div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-kodeen-gray-400 text-xs tracking-wider uppercase mb-1">
                            {project.category.name}
                          </p>
                          <h3 className="font-display text-lg font-medium group-hover:text-kodeen-gray-600 transition-colors">
                            {project.title}
                          </h3>
                        </div>
                        <span className="text-kodeen-gray-400 text-sm">{project.year}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </section>

      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-6"
            onClick={() => setSelectedProject(null)}
          >
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
            >
              <X className="w-6 h-6 text-white" />
            </motion.button>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="w-full max-w-5xl aspect-video bg-kodeen-gray-900 rounded-lg overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {(() => {
                const project = projects.find((p) => p.id === selectedProject)
                return project ? (
                  <div className="relative w-full h-full">
                    {project.video_url ? (
                      <iframe
                        src={project.video_url}
                        title={project.title}
                        className="w-full h-full"
                        allowFullScreen
                      />
                    ) : (
                      <>
                        <img
                          src={project.thumbnail}
                          alt={project.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                          <div className="text-center text-white">
                            <Play className="w-20 h-20 mx-auto mb-4" />
                            <p className="text-lg">Video Preview</p>
                            <p className="text-sm text-white/60 mt-2">{project.title}</p>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                ) : null
              })()}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Portfolio
