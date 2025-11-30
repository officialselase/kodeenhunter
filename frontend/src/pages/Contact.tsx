import { useState } from 'react'
import { motion } from 'framer-motion'
import { Send, MapPin, Mail, Phone, Instagram, Youtube, Twitter } from 'lucide-react'

const contactInfo = [
  { icon: MapPin, label: 'Location', value: 'Los Angeles, California' },
  { icon: Mail, label: 'Email', value: 'hello@kodeenhunter.com' },
  { icon: Phone, label: 'Phone', value: '+1 (555) 123-4567' },
]

const socials = [
  { icon: Instagram, label: 'Instagram', url: '#' },
  { icon: Youtube, label: 'YouTube', url: '#' },
  { icon: Twitter, label: 'Twitter', url: '#' },
]

const projectTypes = [
  'Music Video',
  'Commercial',
  'Short Film',
  'Event Coverage',
  'Documentary',
  'Other',
]

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    projectType: '',
    budget: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsSubmitting(false)
    setSubmitted(true)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
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
              Get in Touch
            </span>
            <h1 className="font-display text-5xl md:text-6xl font-bold mt-2">
              Let's Work Together
            </h1>
            <p className="text-kodeen-gray-500 mt-4 max-w-lg mx-auto">
              Have a project in mind? I'd love to hear about it. Fill out the form below and I'll get back to you within 24 hours.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-5 gap-16">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-2"
            >
              <div className="space-y-8">
                {contactInfo.map((item) => (
                  <div key={item.label} className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-kodeen-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-kodeen-gray-400 text-sm">{item.label}</p>
                      <p className="font-medium">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-12">
                <p className="text-sm text-kodeen-gray-400 uppercase tracking-wider mb-4">
                  Follow Me
                </p>
                <div className="flex gap-3">
                  {socials.map((social) => (
                    <a
                      key={social.label}
                      href={social.url}
                      className="w-12 h-12 bg-kodeen-gray-100 rounded-lg flex items-center justify-center hover:bg-kodeen-black hover:text-white transition-colors"
                    >
                      <social.icon className="w-5 h-5" />
                    </a>
                  ))}
                </div>
              </div>

              <div className="mt-12 p-6 bg-kodeen-gray-50 rounded-lg">
                <h3 className="font-display font-semibold mb-2">Office Hours</h3>
                <div className="text-sm text-kodeen-gray-500 space-y-1">
                  <p>Monday - Friday: 9am - 6pm PST</p>
                  <p>Saturday: By appointment</p>
                  <p>Sunday: Closed</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="lg:col-span-3"
            >
              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="h-full flex items-center justify-center text-center p-12 border-2 border-dashed border-kodeen-gray-200 rounded-lg"
                >
                  <div>
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: 'spring' }}
                      className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
                    >
                      <Send className="w-8 h-8 text-green-600" />
                    </motion.div>
                    <h3 className="font-display text-2xl font-bold mb-2">
                      Message Sent!
                    </h3>
                    <p className="text-kodeen-gray-500">
                      Thank you for reaching out. I'll get back to you soon.
                    </p>
                  </div>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">Name</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-kodeen-gray-200 rounded-lg focus:outline-none focus:border-kodeen-black transition-colors"
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-kodeen-gray-200 rounded-lg focus:outline-none focus:border-kodeen-black transition-colors"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">Project Type</label>
                      <select
                        name="projectType"
                        value={formData.projectType}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-kodeen-gray-200 rounded-lg focus:outline-none focus:border-kodeen-black transition-colors bg-white"
                      >
                        <option value="">Select a project type</option>
                        {projectTypes.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Budget Range</label>
                      <select
                        name="budget"
                        value={formData.budget}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-kodeen-gray-200 rounded-lg focus:outline-none focus:border-kodeen-black transition-colors bg-white"
                      >
                        <option value="">Select your budget</option>
                        <option value="under-5k">Under $5,000</option>
                        <option value="5k-15k">$5,000 - $15,000</option>
                        <option value="15k-50k">$15,000 - $50,000</option>
                        <option value="50k-plus">$50,000+</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Project Details</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      className="w-full px-4 py-3 border border-kodeen-gray-200 rounded-lg focus:outline-none focus:border-kodeen-black transition-colors resize-none"
                      placeholder="Tell me about your project, timeline, and vision..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-primary w-full md:w-auto flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                          className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                        />
                        Sending...
                      </>
                    ) : (
                      <>
                        Send Message <Send className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Contact
