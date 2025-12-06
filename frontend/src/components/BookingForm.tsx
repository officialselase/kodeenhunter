import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Calendar, Clock, User, Mail, Phone, MapPin, MessageSquare, CheckCircle } from 'lucide-react'
import { bookingApi, BookingService, AvailableSlot } from '../services/api'

interface BookingFormProps {
  onSuccess?: () => void
}

export default function BookingForm({ onSuccess }: BookingFormProps) {
  const [step, setStep] = useState<'form' | 'success'>('form')
  const [services, setServices] = useState<BookingService[]>([])
  const [availableSlots, setAvailableSlots] = useState<AvailableSlot[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [bookingNumber, setBookingNumber] = useState('')

  const [formData, setFormData] = useState({
    service: '',
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    booking_date: '',
    booking_time: '',
    location: '',
    message: '',
  })

  // Load services on mount
  useEffect(() => {
    loadServices()
  }, [])

  // Load available slots when date or service changes
  useEffect(() => {
    if (formData.booking_date) {
      loadAvailableSlots()
    }
  }, [formData.booking_date, formData.service])

  const loadServices = async () => {
    try {
      const data = await bookingApi.getServices()
      setServices(data)
    } catch (err) {
      console.error('Failed to load services:', err)
    }
  }

  const loadAvailableSlots = async () => {
    try {
      const serviceId = formData.service ? parseInt(formData.service) : undefined
      const slots = await bookingApi.getAvailableSlots(formData.booking_date, serviceId)
      setAvailableSlots(slots)
    } catch (err) {
      console.error('Failed to load available slots:', err)
      setAvailableSlots([])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await bookingApi.createBooking({
        ...formData,
        service: parseInt(formData.service),
      })
      setBookingNumber(response.booking.booking_number)
      setStep('success')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit booking. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  // Get minimum date (today)
  const minDate = new Date().toISOString().split('T')[0]

  if (step === 'success') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 md:p-8"
      >
        <div className="text-center py-12">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.2 }}
          >
            <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
          </motion.div>
          <h3 className="text-2xl font-bold mb-4">Booking Request Submitted!</h3>
          <p className="text-gray-600 mb-2">
            Your booking number is: <span className="font-mono font-bold">{bookingNumber}</span>
          </p>
          <p className="text-gray-600 mb-8">
            You will receive a confirmation email at <span className="font-semibold">{formData.customer_email}</span> shortly.
          </p>
          <button
            onClick={() => {
              setStep('form')
              setFormData({
                service: '',
                customer_name: '',
                customer_email: '',
                customer_phone: '',
                booking_date: '',
                booking_time: '',
                location: '',
                message: '',
              })
              onSuccess?.()
            }}
            className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            Close
          </button>
        </div>
      </motion.div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
          {error}
        </div>
      )}

      {/* Service Selection */}
      <div>
        <label className="flex items-center gap-2 text-sm font-medium mb-2">
          <Calendar className="w-4 h-4" />
          Service *
        </label>
        <select
          name="service"
          value={formData.service}
          onChange={handleChange}
          required
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
        >
          <option value="">Select a service</option>
          {services.map((service) => (
            <option key={service.id} value={service.id}>
              {service.name} - ${service.price} ({service.duration_hours}h)
            </option>
          ))}
        </select>
        {formData.service && (
          <p className="mt-2 text-sm text-gray-600">
            {services.find(s => s.id === parseInt(formData.service))?.description}
          </p>
        )}
      </div>

      {/* Date Selection */}
      <div>
        <label className="flex items-center gap-2 text-sm font-medium mb-2">
          <Calendar className="w-4 h-4" />
          Date *
        </label>
        <input
          type="date"
          name="booking_date"
          value={formData.booking_date}
          onChange={handleChange}
          min={minDate}
          required
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
        />
      </div>

      {/* Time Selection */}
      {formData.booking_date && (
        <div>
          <label className="flex items-center gap-2 text-sm font-medium mb-2">
            <Clock className="w-4 h-4" />
            Time *
          </label>
          <select
            name="booking_time"
            value={formData.booking_time}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
          >
            <option value="">Select a time</option>
            {availableSlots
              .filter(slot => slot.available)
              .map((slot) => (
                <option key={slot.time} value={slot.time}>
                  {new Date(`2000-01-01T${slot.time}`).toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true,
                  })}
                </option>
              ))}
          </select>
          {availableSlots.length === 0 && (
            <p className="mt-2 text-sm text-gray-500">Loading available times...</p>
          )}
          {availableSlots.length > 0 && availableSlots.filter(s => s.available).length === 0 && (
            <p className="mt-2 text-sm text-red-600">No available times for this date. Please choose another date.</p>
          )}
        </div>
      )}

      {/* Customer Information */}
      <div className="pt-4 border-t border-gray-200">
        <h3 className="text-lg font-semibold mb-4">Your Information</h3>

        <div className="space-y-4">
          <div>
            <label className="flex items-center gap-2 text-sm font-medium mb-2">
              <User className="w-4 h-4" />
              Full Name *
            </label>
            <input
              type="text"
              name="customer_name"
              value={formData.customer_name}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium mb-2">
              <Mail className="w-4 h-4" />
              Email *
            </label>
            <input
              type="email"
              name="customer_email"
              value={formData.customer_email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              placeholder="john@example.com"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium mb-2">
              <Phone className="w-4 h-4" />
              Phone *
            </label>
            <input
              type="tel"
              name="customer_phone"
              value={formData.customer_phone}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              placeholder="+1 (555) 123-4567"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium mb-2">
              <MapPin className="w-4 h-4" />
              Location (Optional)
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              placeholder="Shoot location or meeting place"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium mb-2">
              <MessageSquare className="w-4 h-4" />
              Additional Details (Optional)
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent resize-none"
              placeholder="Tell us about your project, special requirements, or any questions..."
            />
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full py-4 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed font-medium text-lg"
      >
        {loading ? 'Submitting...' : 'Submit Booking Request'}
      </button>

      <p className="text-sm text-gray-500 text-center">
        * Required fields. You'll receive a confirmation email after submission.
      </p>
    </form>
  )
}
