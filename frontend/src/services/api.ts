import { logAPIError, logNetworkError } from '../utils/errorLogger'
import { getCSRFToken } from '../utils/security'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

// Retry configuration
const MAX_RETRIES = 3
const RETRY_DELAY = 1000

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

const apiClient = {
  async get<T>(endpoint: string, retries = 0): Promise<T> {
    try {
      const response = await fetch(`${API_BASE_URL}/api${endpoint}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      })
      
      if (!response.ok) {
        const errorText = await response.text()
        logAPIError(endpoint, response.status, errorText)
        
        // Retry on 5xx errors
        if (response.status >= 500 && retries < MAX_RETRIES) {
          await sleep(RETRY_DELAY * (retries + 1))
          return this.get<T>(endpoint, retries + 1)
        }
        
        throw new Error(`API Error: ${response.status} - ${errorText}`)
      }
      
      return response.json()
    } catch (error) {
      if (error instanceof Error) {
        logNetworkError(`${API_BASE_URL}/api${endpoint}`, error)
      }
      throw error
    }
  },

  async post<T>(endpoint: string, data: unknown, retries = 0): Promise<T> {
    try {
      const csrfToken = getCSRFToken()
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      }
      
      if (csrfToken) {
        headers['X-CSRFToken'] = csrfToken
      }
      
      const response = await fetch(`${API_BASE_URL}/api${endpoint}`, {
        method: 'POST',
        headers,
        credentials: 'include',
        body: JSON.stringify(data),
      })
      
      if (!response.ok) {
        const errorText = await response.text()
        logAPIError(endpoint, response.status, errorText)
        
        // Retry on 5xx errors
        if (response.status >= 500 && retries < MAX_RETRIES) {
          await sleep(RETRY_DELAY * (retries + 1))
          return this.post<T>(endpoint, data, retries + 1)
        }
        
        throw new Error(`API Error: ${response.status} - ${errorText}`)
      }
      
      return response.json()
    } catch (error) {
      if (error instanceof Error) {
        logNetworkError(`${API_BASE_URL}/api${endpoint}`, error)
      }
      throw error
    }
  },
}

export interface Category {
  id: number
  name: string
  slug: string
}

export interface Project {
  id: number
  title: string
  slug: string
  category: Category
  thumbnail: string
  video_url: string
  description: string
  year: number
  featured: boolean
  client?: string
  duration?: string
}

export interface Product {
  id: number
  name: string
  slug: string
  category: { id: number; name: string; slug: string }
  price: string
  sale_price: string | null
  current_price: number
  description?: string
  short_description?: string
  image: string
  features: string[]
  featured: boolean
  is_digital: boolean
}

export interface ContactSubmission {
  name: string
  email: string
  phone?: string
  project_type: string
  message: string
  budget?: string
}

export interface OrderItem {
  product_id: number
  quantity: number
}

export interface OrderData {
  customer_name: string
  customer_email: string
  items: OrderItem[]
}

export interface BookingService {
  id: number
  name: string
  slug: string
  description: string
  duration_hours: string
  price: string
}

export interface BookingData {
  service: number
  customer_name: string
  customer_email: string
  customer_phone: string
  booking_date: string
  booking_time: string
  location?: string
  message?: string
}

export interface Booking {
  id: number
  booking_number: string
  service: number
  service_name: string
  customer_name: string
  customer_email: string
  customer_phone: string
  booking_date: string
  booking_time: string
  duration_hours: string
  location: string
  message: string
  status: string
  price: string
  created_at: string
}

export interface AvailableSlot {
  date: string
  time: string
  available: boolean
}

export const portfolioApi = {
  getCategories: () => apiClient.get<Category[]>('/portfolio/categories/'),
  getProjects: (category?: string) => {
    const params = category ? `?category=${category}` : ''
    return apiClient.get<Project[]>(`/portfolio/projects/${params}`)
  },
  getFeaturedProjects: () => apiClient.get<Project[]>('/portfolio/projects/featured/'),
  getProject: (slug: string) => apiClient.get<Project>(`/portfolio/projects/${slug}/`),
  submitContact: (data: ContactSubmission) => apiClient.post('/portfolio/contact/', data),
}

export const shopApi = {
  getCategories: () => apiClient.get<{ id: number; name: string; slug: string }[]>('/shop/categories/'),
  getProducts: (category?: string) => {
    const params = category ? `?category=${category}` : ''
    return apiClient.get<Product[]>(`/shop/products/${params}`)
  },
  getFeaturedProducts: () => apiClient.get<Product[]>('/shop/products/featured/'),
  getProduct: (slug: string) => apiClient.get<Product>(`/shop/products/${slug}/`),
  createOrder: (data: OrderData) => apiClient.post('/shop/orders/', data),
}

export const bookingApi = {
  getServices: async () => {
    const response = await apiClient.get<{ results: BookingService[] }>('/booking/services/')
    return response.results || []
  },
  getAvailableSlots: (date: string, serviceId?: number) => {
    const params = serviceId ? `?date=${date}&service=${serviceId}` : `?date=${date}`
    return apiClient.get<AvailableSlot[]>(`/booking/bookings/available_slots/${params}`)
  },
  createBooking: (data: BookingData) => apiClient.post<{ message: string; booking: Booking }>('/booking/bookings/', data),
  getBookings: async (email: string) => {
    const response = await apiClient.get<{ results: Booking[] }>(`/booking/bookings/?email=${email}`)
    return response.results || []
  },
}

export interface Service {
  id: number
  name: string
  slug: string
  icon: string
  short_description: string
  description: string
  featured: boolean
}

export interface Testimonial {
  id: number
  client_name: string
  client_title: string
  client_company: string
  client_photo: string | null
  testimonial: string
  rating: number
  project_title?: string
  featured: boolean
}

export interface Award {
  id: number
  title: string
  organization: string
  year: number
  category: string
  project_title?: string
  description: string
  image: string | null
  featured: boolean
}

export const homepageApi = {
  getServices: () => apiClient.get<Service[]>('/portfolio/services/'),
  getTestimonials: () => apiClient.get<Testimonial[]>('/portfolio/testimonials/featured/'),
  getAwards: () => apiClient.get<Award[]>('/portfolio/awards/featured/'),
}

export interface NewsletterSubscription {
  email: string
  name?: string
  source?: string
}

export interface NewsletterResponse {
  message: string
}

export const newsletterApi = {
  subscribe: (data: NewsletterSubscription) => 
    apiClient.post<NewsletterResponse>('/newsletter/subscribe/', data),
  unsubscribe: (email: string) => 
    apiClient.post<NewsletterResponse>('/newsletter/unsubscribe/', { email }),
  checkStatus: (email: string) => 
    apiClient.get<{ subscribed: boolean; subscribed_at?: string }>(`/newsletter/status/?email=${email}`),
}

export default apiClient
