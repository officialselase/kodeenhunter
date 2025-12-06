// Web Vitals monitoring for performance tracking

export interface WebVitalsMetric {
  name: string
  value: number
  rating: 'good' | 'needs-improvement' | 'poor'
  delta: number
  id: string
}

export const reportWebVitals = (metric: WebVitalsMetric) => {
  // Log to console in development
  if (import.meta.env.DEV) {
    console.log(`[Web Vitals] ${metric.name}:`, {
      value: metric.value,
      rating: metric.rating,
      id: metric.id,
    })
  }

  // In production, send to analytics service
  // Example: Google Analytics, Vercel Analytics, etc.
  if (import.meta.env.PROD && window.gtag) {
    window.gtag('event', metric.name, {
      value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
      event_category: 'Web Vitals',
      event_label: metric.id,
      non_interaction: true,
    })
  }
}

// Initialize Web Vitals monitoring
export const initWebVitals = async () => {
  if ('web-vital' in window) {
    const { onCLS, onINP, onFCP, onLCP, onTTFB } = await import('web-vitals')
    onCLS(reportWebVitals)
    onINP(reportWebVitals)
    onFCP(reportWebVitals)
    onLCP(reportWebVitals)
    onTTFB(reportWebVitals)
  }
}


