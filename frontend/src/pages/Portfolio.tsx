import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, X } from 'lucide-react'

const categories = ['All', 'Music Videos', 'Commercials', 'Short Films', 'Events']

const projects = [
  {
    id: 1,
    title: 'Midnight Echoes',
    category: 'Music Videos',
    thumbnail: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&q=80',
    year: '2024',
  },
  {
    id: 2,
    title: 'Urban Pulse',
    category: 'Commercials',
    thumbnail: 'https://images.unsplash.com/photo-1536240478700-b869070f9279?w=800&q=80',
    year: '2024',
  },
  {
    id: 3,
    title: 'Beyond the Frame',
    category: 'Short Films',
    thumbnail: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800&q=80',
    year: '2023',
  },
  {
    id: 4,
    title: 'Neon Dreams',
    category: 'Music Videos',
    thumbnail: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&q=80',
    year: '2023',
  },
  {
    id: 5,
    title: 'The Journey',
    category: 'Commercials',
    thumbnail: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800&q=80',
    year: '2023',
  },
  {
    id: 6,
    title: 'Summer Festival',
    category: 'Events',
    thumbnail: 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=800&q=80',
    year: '2023',
  },
  {
    id: 7,
    title: 'City Lights',
    category: 'Short Films',
    thumbnail: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=800&q=80',
    year: '2022',
  },
  {
    id: 8,
    title: 'Brand Story',
    category: 'Commercials',
    thumbnail: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800&q=80',
    year: '2022',
  },
  {
    id: 9,
    title: 'Electric Soul',
    category: 'Music Videos',
    thumbnail: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=80',
    year: '2022',
  },
]

const Portfolio = () => {
  const [activeCategory, setActiveCategory] = useState('All')
  const [selectedProject, setSelectedProject] = useState<number | null>(null)

  const filteredProjects = activeCategory === 'All'
    ? projects
    : projects.filter((p) => p.category === activeCategory)

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
            {categories.map((category) => (
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
                          {project.category}
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
