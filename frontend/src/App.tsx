import { useState, useEffect, lazy, Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { HelmetProvider } from 'react-helmet-async'
import IntroAnimation from './components/IntroAnimation'
import Layout from './components/Layout'
import ErrorBoundary from './components/ErrorBoundary'
import RouteLoadingIndicator from './components/RouteLoadingIndicator'
import HeartbeatLoader from './components/HeartbeatLoader'
import { CartProvider } from './context/CartContext'
import { useRoutePreload } from './hooks/useRoutePreload'
import { initGA, trackPageView } from './utils/analytics'
import { setupGlobalErrorHandlers } from './utils/errorLogger'
import { initWebVitals } from './utils/webVitals'

// Lazy load pages for better performance
const Home = lazy(() => import('./pages/Home'))
const Portfolio = lazy(() => import('./pages/Portfolio'))
const About = lazy(() => import('./pages/About'))
const Shop = lazy(() => import('./pages/Shop'))
const Contact = lazy(() => import('./pages/Contact'))
const ProjectDetail = lazy(() => import('./pages/ProjectDetail'))
const NotFound = lazy(() => import('./pages/NotFound'))
const ServerError = lazy(() => import('./pages/ServerError'))

// Analytics tracker component
function AnalyticsTracker() {
  const location = useLocation()

  useEffect(() => {
    trackPageView(location.pathname, document.title)
  }, [location])

  return null
}

const shouldSkipIntro = () => {
  if (typeof window === 'undefined') return false
  const urlParams = new URLSearchParams(window.location.search)
  const skipIntro = urlParams.get('skip') === 'true'
  const hasSeenIntro = sessionStorage.getItem('hasSeenIntro')
  return skipIntro || !!hasSeenIntro
}

function App() {
  const [showIntro, setShowIntro] = useState(!shouldSkipIntro())
  const [introComplete, setIntroComplete] = useState(shouldSkipIntro())

  // Preload critical routes
  useRoutePreload()

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    if (urlParams.get('skip') === 'true') {
      sessionStorage.setItem('hasSeenIntro', 'true')
    }

    // Initialize analytics (replace with your GA4 measurement ID)
    const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID
    if (GA_MEASUREMENT_ID) {
      initGA(GA_MEASUREMENT_ID)
    }

    // Setup global error handlers
    setupGlobalErrorHandlers()

    // Initialize web vitals monitoring
    initWebVitals()
  }, [])

  const handleIntroComplete = () => {
    sessionStorage.setItem('hasSeenIntro', 'true')
    setShowIntro(false)
    setTimeout(() => setIntroComplete(true), 100)
  }

  return (
    <HelmetProvider>
      <ErrorBoundary>
        <CartProvider>
          <Router>
            <AnalyticsTracker />
            <RouteLoadingIndicator />
            <AnimatePresence mode="wait">
              {showIntro && !introComplete ? (
                <IntroAnimation key="intro" onComplete={handleIntroComplete} />
              ) : (
                <Layout key="main">
                  <Suspense
                    fallback={
                      <div className="min-h-screen flex items-center justify-center">
                        <HeartbeatLoader />
                      </div>
                    }
                  >
                    <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/portfolio" element={<Portfolio />} />
                      <Route path="/portfolio/:id" element={<ProjectDetail />} />
                      <Route path="/about" element={<About />} />
                      <Route path="/shop" element={<Shop />} />
                      <Route path="/contact" element={<Contact />} />
                      <Route path="/500" element={<ServerError />} />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </Suspense>
                </Layout>
              )}
            </AnimatePresence>
          </Router>
        </CartProvider>
      </ErrorBoundary>
    </HelmetProvider>
  )
}

export default App
