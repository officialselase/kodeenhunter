import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Play, Calendar, Clock, Tag } from 'lucide-react'

const projects = [
  {
    id: '1',
    title: 'Midnight Echoes',
    category: 'Music Video',
    artist: 'Aurora Dreams',
    year: '2024',
    duration: '4:32',
    description: 'An atmospheric visual journey through neon-lit cityscapes, exploring themes of isolation and connection in the digital age. Shot over three nights in downtown Los Angeles, this music video combines intimate performance shots with sweeping drone footage.',
    thumbnail: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=1600&q=80',
    behindTheScenes: [
      'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&q=80',
      'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=600&q=80',
      'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=600&q=80',
    ],
    credits: [
      { role: 'Director', name: 'Kodeen Hunter' },
      { role: 'Director of Photography', name: 'Kodeen Hunter' },
      { role: 'Editor', name: 'Kodeen Hunter' },
      { role: 'Colorist', name: 'Sarah Chen' },
      { role: 'Producer', name: 'Mike Wilson' },
    ],
    equipment: ['RED Komodo 6K', 'Sigma Cine Primes', 'DJI Ronin 4D', 'DJI Inspire 3'],
  },
  {
    id: '2',
    title: 'Urban Pulse',
    category: 'Commercial',
    artist: 'Nike',
    year: '2024',
    duration: '0:60',
    description: 'A high-energy commercial capturing the spirit of street culture and athletic excellence. Following three athletes through their daily routines, the piece celebrates dedication and urban creativity.',
    thumbnail: 'https://images.unsplash.com/photo-1536240478700-b869070f9279?w=1600&q=80',
    behindTheScenes: [
      'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=600&q=80',
      'https://images.unsplash.com/photo-1540390769625-2fc3f8b1f587?w=600&q=80',
    ],
    credits: [
      { role: 'Director', name: 'Kodeen Hunter' },
      { role: 'Executive Producer', name: 'James Miller' },
      { role: 'Production Company', name: 'Hunter Studios' },
    ],
    equipment: ['Sony FX6', 'Canon CN-E Primes', 'Steadicam'],
  },
]

const ProjectDetail = () => {
  const { id } = useParams()
  const project = projects.find((p) => p.id === id) || projects[0]

  return (
    <div className="bg-white min-h-screen">
      <section className="relative h-[70vh] overflow-hidden">
        <motion.div
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0"
        >
          <img
            src={project.thumbnail}
            alt={project.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-white via-white/30 to-transparent" />
        </motion.div>

        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Link
                to="/portfolio"
                className="inline-flex items-center gap-2 text-kodeen-gray-500 hover:text-kodeen-black mb-4 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" /> Back to Portfolio
              </Link>
              <p className="text-kodeen-gray-500 text-sm tracking-[0.2em] uppercase mb-2">
                {project.category}
              </p>
              <h1 className="font-display text-4xl md:text-6xl font-bold mb-4">
                {project.title}
              </h1>
              <div className="flex flex-wrap gap-6 text-sm text-kodeen-gray-500">
                <span className="flex items-center gap-2">
                  <Tag className="w-4 h-4" /> {project.artist}
                </span>
                <span className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" /> {project.year}
                </span>
                <span className="flex items-center gap-2">
                  <Clock className="w-4 h-4" /> {project.duration}
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-3 gap-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-2"
            >
              <div className="aspect-video bg-kodeen-gray-100 rounded-lg overflow-hidden relative group cursor-pointer mb-8">
                <img
                  src={project.thumbnail}
                  alt={project.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="w-20 h-20 rounded-full bg-white flex items-center justify-center"
                  >
                    <Play className="w-8 h-8 text-kodeen-black ml-1" />
                  </motion.div>
                </div>
              </div>

              <h2 className="font-display text-2xl font-bold mb-4">About This Project</h2>
              <p className="text-kodeen-gray-600 leading-relaxed mb-8">
                {project.description}
              </p>

              <h3 className="font-display text-xl font-bold mb-4">Behind The Scenes</h3>
              <div className="grid grid-cols-3 gap-4">
                {project.behindTheScenes.map((img, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="aspect-square rounded-lg overflow-hidden"
                  >
                    <img
                      src={img}
                      alt={`Behind the scenes ${index + 1}`}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <div className="sticky top-28 space-y-8">
                <div>
                  <h3 className="font-display text-lg font-bold mb-4">Credits</h3>
                  <div className="space-y-3">
                    {project.credits.map((credit) => (
                      <div key={credit.role} className="flex justify-between text-sm">
                        <span className="text-kodeen-gray-400">{credit.role}</span>
                        <span className="font-medium">{credit.name}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t border-kodeen-gray-200 pt-8">
                  <h3 className="font-display text-lg font-bold mb-4">Equipment Used</h3>
                  <div className="flex flex-wrap gap-2">
                    {project.equipment.map((item) => (
                      <span
                        key={item}
                        className="px-3 py-1 bg-kodeen-gray-100 rounded-full text-sm"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="border-t border-kodeen-gray-200 pt-8">
                  <h3 className="font-display text-lg font-bold mb-4">
                    Interested in Similar Work?
                  </h3>
                  <Link to="/contact" className="btn-primary block text-center">
                    Get in Touch
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default ProjectDetail
