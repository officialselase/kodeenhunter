const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://15f9f2b9-356b-49b9-9387-984831e38905-00-2y3bfrunaxxkd.picard.replit.dev'

const apiClient = {
  async get<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${API_BASE_URL}/api${endpoint}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`)
    }
    return response.json()
  },

  async post<T>(endpoint: string, data: unknown): Promise<T> {
    const response = await fetch(`${API_BASE_URL}/api${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`)
    }
    return response.json()
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
  description: string
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

export default apiClient
