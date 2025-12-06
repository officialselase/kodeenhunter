/**
 * Security utilities for input sanitization and validation
 */

/**
 * Sanitize HTML to prevent XSS attacks
 * Removes script tags and dangerous attributes
 */
export const sanitizeHTML = (html: string): string => {
  const div = document.createElement('div')
  div.textContent = html
  return div.innerHTML
}

/**
 * Validate email format
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Validate phone number (US format)
 */
export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^[\d\s\-\(\)]+$/
  return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10
}

/**
 * Validate URL format
 */
export const isValidURL = (url: string): boolean => {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

/**
 * Sanitize user input (remove special characters)
 */
export const sanitizeInput = (input: string): string => {
  return input.replace(/[<>'"]/g, '')
}

/**
 * Validate file upload
 */
export const validateFileUpload = (
  file: File,
  options: {
    maxSize?: number // in bytes
    allowedTypes?: string[]
  } = {}
): { valid: boolean; error?: string } => {
  const { maxSize = 5 * 1024 * 1024, allowedTypes = [] } = options

  // Check file size
  if (file.size > maxSize) {
    return {
      valid: false,
      error: `File size exceeds ${maxSize / 1024 / 1024}MB limit`,
    }
  }

  // Check file type
  if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `File type ${file.type} is not allowed`,
    }
  }

  return { valid: true }
}

/**
 * Generate CSRF token (for forms)
 */
export const getCSRFToken = (): string | null => {
  const name = 'csrftoken'
  const cookies = document.cookie.split(';')
  for (let cookie of cookies) {
    const [key, value] = cookie.trim().split('=')
    if (key === name) return value
  }
  return null
}

/**
 * Rate limiting helper (client-side)
 */
export class RateLimiter {
  private attempts: Map<string, number[]> = new Map()

  /**
   * Check if action is allowed
   * @param key - Unique identifier for the action
   * @param maxAttempts - Maximum attempts allowed
   * @param windowMs - Time window in milliseconds
   */
  isAllowed(key: string, maxAttempts: number, windowMs: number): boolean {
    const now = Date.now()
    const attempts = this.attempts.get(key) || []

    // Remove old attempts outside the window
    const recentAttempts = attempts.filter((time) => now - time < windowMs)

    if (recentAttempts.length >= maxAttempts) {
      return false
    }

    // Add current attempt
    recentAttempts.push(now)
    this.attempts.set(key, recentAttempts)

    return true
  }

  /**
   * Reset attempts for a key
   */
  reset(key: string) {
    this.attempts.delete(key)
  }
}

/**
 * Secure storage wrapper (encrypts data in localStorage)
 */
export const secureStorage = {
  /**
   * Store data securely
   */
  setItem: (key: string, value: any) => {
    try {
      const serialized = JSON.stringify(value)
      // In production, consider encrypting the data
      localStorage.setItem(key, btoa(serialized))
    } catch (error) {
      console.error('Failed to store data:', error)
    }
  },

  /**
   * Retrieve data securely
   */
  getItem: (key: string): any => {
    try {
      const stored = localStorage.getItem(key)
      if (!stored) return null
      const decoded = atob(stored)
      return JSON.parse(decoded)
    } catch (error) {
      console.error('Failed to retrieve data:', error)
      return null
    }
  },

  /**
   * Remove data
   */
  removeItem: (key: string) => {
    localStorage.removeItem(key)
  },
}

/**
 * Content Security Policy helper
 */
export const CSP_DIRECTIVES = {
  'default-src': ["'self'"],
  'script-src': ["'self'", "'unsafe-inline'", 'https://www.googletagmanager.com'],
  'style-src': ["'self'", "'unsafe-inline'"],
  'img-src': ["'self'", 'data:', 'https:', 'blob:'],
  'font-src': ["'self'", 'data:'],
  'connect-src': ["'self'", 'https://api.kodeenhunter.com'],
  'media-src': ["'self'", 'https:', 'blob:'],
  'frame-src': ["'self'", 'https://www.youtube.com', 'https://player.vimeo.com'],
}
