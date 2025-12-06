import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { registerServiceWorker } from './utils/registerServiceWorker'
import { onCLS, onINP, onFCP, onLCP, onTTFB } from 'web-vitals'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

// Register service worker for offline functionality
registerServiceWorker()

// Monitor Web Vitals in production
if (import.meta.env.PROD) {
  const reportWebVitals = (metric: any) => {
    console.log(`[Web Vitals] ${metric.name}:`, metric.value)
    // Send to analytics in production
  }
  
  onCLS(reportWebVitals)
  onINP(reportWebVitals)
  onFCP(reportWebVitals)
  onLCP(reportWebVitals)
  onTTFB(reportWebVitals)
}
