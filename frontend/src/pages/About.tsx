import { motion } from 'framer-motion'
import { Camera, Film, Award, Video, Aperture, Monitor } from 'lucide-react'

const skills = [
  'Cinematography',
  'Color Grading',
  'Motion Graphics',
  'Sound Design',
  'Drone Footage',
  'Live Events',
  'Post-Production',
  'Visual Effects',
]

const equipment = [
  { icon: Camera, name: 'RED Komodo 6K', category: 'Primary Camera' },
  { icon: Video, name: 'Sony FX6', category: 'Secondary Camera' },
  { icon: Aperture, name: 'Sigma Cine Primes', category: 'Lens Kit' },
  { icon: Film, name: 'DJI Ronin 4D', category: 'Gimbal System' },
  { icon: Monitor, name: 'DaVinci Resolve', category: 'Editing Suite' },
  { icon: Award, name: 'DJI Inspire 3', category: 'Drone' },
]

const timeline = [
  { year: '2024', title: 'Director of Photography', description: 'Lead cinematographer for major music video productions' },
  { year: '2022', title: 'Commercial Director', description: 'Directed campaigns for global brands' },
  { year: '2020', title: 'Award Recognition', description: 'Best Cinematography at Film Festival' },
  { year: '2018', title: 'Started Studio', description: 'Founded independent production company' },
  { year: '2015', title: 'First Music Video', description: 'Debut project went viral with 10M+ views' },
]

const About = () => {
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
              About Me
            </span>
            <h1 className="font-display text-5xl md:text-6xl font-bold mt-2">
              The Story
            </h1>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-16 items-start mb-24">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1540390769625-2fc3f8b1f587?w=800&q=80"
                  alt="Kodeen Hunter"
                  className="rounded-lg w-full"
                />
                <div className="absolute -bottom-6 -right-6 bg-kodeen-black text-white p-8 rounded-lg">
                  <p className="font-display text-4xl font-bold">10+</p>
                  <p className="text-sm text-kodeen-gray-400">Years of Experience</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="lg:pt-12"
            >
              <h2 className="font-display text-3xl font-bold mb-6">
                Passionate About Visual Storytelling
              </h2>
              <div className="space-y-4 text-kodeen-gray-600">
                <p>
                  I'm Kodeen Hunter, a videographer and director with over a decade of experience 
                  in creating compelling visual narratives. From my first camera at age 15 to 
                  working with global brands and artists, my journey has been defined by an 
                  unwavering passion for the craft.
                </p>
                <p>
                  My approach combines technical excellence with artistic vision. I believe every 
                  project deserves meticulous attention to detail, whether it's a music video, 
                  commercial, or documentary. The goal is always the same: to create something 
                  that resonates deeply with audiences.
                </p>
                <p>
                  When I'm not behind the camera, I'm exploring new techniques, mentoring emerging 
                  filmmakers, and pushing the boundaries of what's possible in visual media.
                </p>
              </div>

              <div className="mt-8">
                <h3 className="font-semibold mb-4 text-sm tracking-wider uppercase">
                  Expertise
                </h3>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-4 py-2 bg-kodeen-gray-100 rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-24"
          >
            <div className="text-center mb-12">
              <span className="text-kodeen-gray-500 text-sm tracking-[0.3em] uppercase">
                My Gear
              </span>
              <h2 className="font-display text-3xl font-bold mt-2">Equipment</h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {equipment.map((item, index) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="p-6 border border-kodeen-gray-200 rounded-lg hover:border-kodeen-black transition-colors group"
                >
                  <item.icon className="w-8 h-8 mb-4 text-kodeen-gray-400 group-hover:text-kodeen-black transition-colors" />
                  <h3 className="font-medium mb-1">{item.name}</h3>
                  <p className="text-sm text-kodeen-gray-500">{item.category}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="text-center mb-12">
              <span className="text-kodeen-gray-500 text-sm tracking-[0.3em] uppercase">
                Career
              </span>
              <h2 className="font-display text-3xl font-bold mt-2">Journey</h2>
            </div>

            <div className="max-w-2xl mx-auto">
              {timeline.map((item, index) => (
                <motion.div
                  key={item.year}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="relative pl-8 pb-10 border-l-2 border-kodeen-gray-200 last:pb-0"
                >
                  <div className="absolute -left-2 top-0 w-4 h-4 rounded-full bg-kodeen-black" />
                  <span className="text-kodeen-gray-400 text-sm">{item.year}</span>
                  <h3 className="font-display text-xl font-medium mt-1">{item.title}</h3>
                  <p className="text-kodeen-gray-500 mt-1">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-24 text-center"
          >
            <blockquote className="font-display text-3xl md:text-4xl italic max-w-3xl mx-auto">
              "Every frame is an opportunity to tell a story. My job is to make sure that story moves people."
            </blockquote>
            <p className="mt-6 text-kodeen-gray-500">— Kodeen Hunter</p>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default About
