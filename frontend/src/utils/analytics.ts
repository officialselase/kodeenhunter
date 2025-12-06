/**
 * Analytics utilities for tracking user interactions
 * Supports Google Analytics 4 and custom event tracking
 */

// Google Analytics 4 types
declare global {
  interface Window {
    gtag?: (...args: any[]) => void
    dataLayer?: any[]
  }
}

/**
 * Initialize Google Analytics 4
 * Call this in your main App component
 */
export const initGA = (measurementId: string) => {
  if (typeof window === 'undefined') return

  // Load GA4 script
  const script = document.createElement('script')
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`
  script.async = true
  document.head.appendChild(script)

  // Initialize dataLayer
  window.dataLayer = window.dataLayer || []
  window.gtag = function gtag() {
    window.dataLayer?.push(arguments)
  }
  window.gtag('js', new Date())
  window.gtag('config', measurementId, {
    send_page_view: false, // We'll send page views manually
  })
}

/**
 * Track page views
 */
export const trackPageView = (path: string, title?: string) => {
  if (typeof window === 'undefined' || !window.gtag) return

  window.gtag('event', 'page_view', {
    page_path: path,
    page_title: title || document.title,
  })
}

/**
 * Track custom events
 */
export const trackEvent = (
  eventName: string,
  params?: Record<string, any>
) => {
  if (typeof window === 'undefined' || !window.gtag) return

  window.gtag('event', eventName, params)
}

/**
 * E-commerce event tracking
 */
export const trackEcommerce = {
  // View product
  viewItem: (product: {
    id: string
    name: string
    price: number
    category?: string
  }) => {
    trackEvent('view_item', {
      currency: 'USD',
      value: product.price,
      items: [
        {
          item_id: product.id,
          item_name: product.name,
          item_category: product.category,
          price: product.price,
        },
      ],
    })
  },

  // Add to cart
  addToCart: (product: {
    id: string
    name: string
    price: number
    quantity: number
  }) => {
    trackEvent('add_to_cart', {
      currency: 'USD',
      value: product.price * product.quantity,
      items: [
        {
          item_id: product.id,
          item_name: product.name,
          price: product.price,
          quantity: product.quantity,
        },
      ],
    })
  },

  // Begin checkout
  beginCheckout: (items: any[], total: number) => {
    trackEvent('begin_checkout', {
      currency: 'USD',
      value: total,
      items: items.map((item) => ({
        item_id: item.id,
        item_name: item.name,
        price: item.price,
        quantity: item.quantity,
      })),
    })
  },

  // Purchase
  purchase: (orderId: string, items: any[], total: number) => {
    trackEvent('purchase', {
      transaction_id: orderId,
      currency: 'USD',
      value: total,
      items: items.map((item) => ({
        item_id: item.id,
        item_name: item.name,
        price: item.price,
        quantity: item.quantity,
      })),
    })
  },
}

/**
 * Booking event tracking
 */
export const trackBooking = {
  // Start booking flow
  startBooking: (service: string) => {
    trackEvent('booking_started', {
      service_type: service,
    })
  },

  // Complete booking
  completeBooking: (service: string, date: string, price: number) => {
    trackEvent('booking_completed', {
      service_type: service,
      booking_date: date,
      value: price,
      currency: 'USD',
    })
  },
}

/**
 * Contact form tracking
 */
export const trackContact = {
  // Form submission
  submitForm: (formType: 'contact' | 'booking' | 'newsletter') => {
    trackEvent('form_submission', {
      form_type: formType,
    })
  },
}

/**
 * Video interaction tracking
 */
export const trackVideo = {
  // Video play
  play: (videoTitle: string) => {
    trackEvent('video_play', {
      video_title: videoTitle,
    })
  },

  // Video complete
  complete: (videoTitle: string) => {
    trackEvent('video_complete', {
      video_title: videoTitle,
    })
  },
}

/**
 * Social media tracking
 */
export const trackSocial = (platform: string, action: 'click' | 'share') => {
  trackEvent('social_interaction', {
    platform,
    action,
  })
}

/**
 * Download tracking
 */
export const trackDownload = (fileName: string, fileType: string) => {
  trackEvent('file_download', {
    file_name: fileName,
    file_type: fileType,
  })
}
