import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronLeft, ChevronRight, Play, Calendar, User, Video, Camera } from 'lucide-react'
import { portfolioApi } from '../services/api'
import { useFocusTrap } from '../hooks/useFocusTrap'

interface ProjectImage {
  id: number
  image: string
  caption: string
  is_behind_the_scenes: boolean
}

interface Credit {
  id: number
  role: string
  name: string
}

interface ProjectDetail {
  id: number
  title: string
  slug: string
  category: { id: number; name: string; slug: string }
  client: string
  year: number
  duration: string
  description: string
  thumbnail: string
  video_url: string
  video_file: string
  featured: boolean
  images: ProjectImage[]
  credits: Credit[]
  equipment: string[]
  behind_the_scenes: ProjectImage[]
}

interface ProjectModalProps {
  projectSlug: string
  onClose: () => void
  onNavigate?: (direction: 'prev' | 'next') => void
  hasPrev?: boolean
  hasNext?: boolean
}

const ProjectModal = ({ projectSlug, onClose, onNavigate, hasPrev, hasNext }: ProjectModalProps) => {
  const [project, setProject] = useState<ProjectDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [activeTab, setActiveTab] = useState<'details' | 'bts'>('details')
  const modalRef = useRef<HTMLDivElement>(null)

  useFocusTrap(modalRef, !loading && !error)

  useEffect(() => {
    const fetchProject = async () => {
      setLoading(true)
      setError(false)
      try {
        const data = await portfolioApi.getProject(projectSlug)
        setProject(data as unknown as ProjectDetail)
      } catch (err) {
        console.error('Failed to fetch project:', err)
        setError(true)
      } finally {
        setLoading(false)
      }
    }
    fetchProject()
  }, [projectSlug])

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft' && hasPrev && onNavigate) onNavigate('prev')
      if (e.key === 'ArrowRight' && hasNext && onNavigate) onNavigate('next')
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose, onNavigate, hasPrev, hasNext])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/95 z-50 overflow-y-auto"
      onClick={onClose}
    >
      <div className="min-h-screen py-8 px-4 md:px-8">
        {/* Header Controls */}
        <div className="max-w-7xl mx-auto mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {hasPrev && onNavigate && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onNavigate('prev')
                }}
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                aria-label="Previous project"
              >
                <ChevronLeft className="w-5 h-5 text-white" />
              </button>
            )}
            {hasNext && onNavigate && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onNavigate('next')
                }}
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                aria-label="Next project"
              >
                <ChevronRight className="w-5 h-5 text-white" />
              </button>
            )}
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
            aria-label="Close project details"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Content */}
        <motion.div
          ref={modalRef}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="max-w-7xl mx-auto bg-white rounded-lg overflow-hidden"
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-labelledby="project-modal-title"
        >
          {loading ? (
            <div className="flex items-center justify-center py-32">
              <div className="animate-pulse text-kodeen-gray-400">Loading project details...</div>
            </div>
          ) : error || !project ? (
            <div className="flex flex-col items-center justify-center py-32">
              <p className="text-kodeen-gray-400 mb-4">Failed to load project details</p>
              <button
                onClick={onClose}
                className="px-6 py-2 bg-kodeen-black text-white rounded-full hover:bg-kodeen-gray-800 transition-colors"
              >
                Close
              </button>
            </div>
          ) : (
            <>
              {/* Video Section */}
              <div className="aspect-video bg-kodeen-gray-900 relative">
                {project.video_url ? (
                  <iframe
                    src={project.video_url}
                    title={`${project.title} video`}
                    className="w-full h-full"
                    allowFullScreen
                    aria-label={`Video player for ${project.title}`}
                  />
                ) : (
                  <div className="relative w-full h-full">
                    <img
                      src={project.thumbnail}
                      alt={project.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                      <div className="text-center text-white">
                        <Play className="w-16 h-16 mx-auto mb-3 opacity-60" />
                        <p className="text-sm opacity-60">Video coming soon</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Project Info */}
              <div className="p-8 md:p-12">
                <div className="mb-8">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-kodeen-gray-400 text-xs tracking-wider uppercase">
                      {project.category.name}
                    </span>
                    {project.featured && (
                      <span className="px-2 py-1 bg-kodeen-black text-white text-xs rounded">
                        Featured
                      </span>
                    )}
                  </div>
                  <h2 id="project-modal-title" className="font-display text-4xl md:text-5xl font-bold mb-4">
                    {project.title}
                  </h2>
                  
                  {/* Meta Info */}
                  <div className="flex flex-wrap gap-6 text-sm text-kodeen-gray-600">
                    {project.client && (
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        <span>{project.client}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>{project.year}</span>
                    </div>
                    {project.duration && (
                      <div className="flex items-center gap-2">
                        <Video className="w-4 h-4" />
                        <span>{project.duration}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Description */}
                {project.description && (
                  <div className="mb-8">
                    <p className="text-kodeen-gray-700 leading-relaxed whitespace-pre-line">
                      {project.description}
                    </p>
                  </div>
                )}

                {/* Tabs */}
                <div className="border-b border-kodeen-gray-200 mb-8">
                  <div className="flex gap-8">
                    <button
                      onClick={() => setActiveTab('details')}
                      className={`pb-3 text-sm font-medium transition-colors relative ${
                        activeTab === 'details'
                          ? 'text-kodeen-black'
                          : 'text-kodeen-gray-400 hover:text-kodeen-gray-600'
                      }`}
                    >
                      Details
                      {activeTab === 'details' && (
                        <motion.div
                          layoutId="activeTab"
                          className="absolute bottom-0 left-0 right-0 h-0.5 bg-kodeen-black"
                        />
                      )}
                    </button>
                    {project.behind_the_scenes.length > 0 && (
                      <button
                        onClick={() => setActiveTab('bts')}
                        className={`pb-3 text-sm font-medium transition-colors relative ${
                          activeTab === 'bts'
                            ? 'text-kodeen-black'
                            : 'text-kodeen-gray-400 hover:text-kodeen-gray-600'
                        }`}
                      >
                        Behind the Scenes
                        {activeTab === 'bts' && (
                          <motion.div
                            layoutId="activeTab"
                            className="absolute bottom-0 left-0 right-0 h-0.5 bg-kodeen-black"
                          />
                        )}
                      </button>
                    )}
                  </div>
                </div>

                {/* Tab Content */}
                <AnimatePresence mode="wait">
                  {activeTab === 'details' ? (
                    <motion.div
                      key="details"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="grid md:grid-cols-2 gap-8"
                    >
                      {/* Credits */}
                      {project.credits.length > 0 && (
                        <div>
                          <h3 className="font-display text-xl font-semibold mb-4">Credits</h3>
                          <div className="space-y-2">
                            {project.credits.map((credit) => (
                              <div key={credit.id} className="flex justify-between">
                                <span className="text-kodeen-gray-600">{credit.role}</span>
                                <span className="font-medium">{credit.name}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Equipment */}
                      {project.equipment.length > 0 && (
                        <div>
                          <h3 className="font-display text-xl font-semibold mb-4 flex items-center gap-2">
                            <Camera className="w-5 h-5" />
                            Equipment Used
                          </h3>
                          <ul className="space-y-2">
                            {project.equipment.map((item, index) => (
                              <li key={index} className="text-kodeen-gray-700">
                                • {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </motion.div>
                  ) : (
                    <motion.div
                      key="bts"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="grid md:grid-cols-2 lg:grid-cols-3 gap-4"
                    >
                      {project.behind_the_scenes.map((image) => (
                        <div key={image.id} className="group">
                          <div className="aspect-video rounded-lg overflow-hidden mb-2">
                            <img
                              src={image.image}
                              alt={image.caption || 'Behind the scenes'}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                          </div>
                          {image.caption && (
                            <p className="text-sm text-kodeen-gray-600">{image.caption}</p>
                          )}
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </motion.div>
  )
}

export default ProjectModal
