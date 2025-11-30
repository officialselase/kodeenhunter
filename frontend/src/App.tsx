import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import IntroAnimation from './components/IntroAnimation'
import Layout from './components/Layout'
import Home from './pages/Home'
import Portfolio from './pages/Portfolio'
import About from './pages/About'
import Shop from './pages/Shop'
import Contact from './pages/Contact'
import ProjectDetail from './pages/ProjectDetail'
import { CartProvider } from './context/CartContext'

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

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    if (urlParams.get('skip') === 'true') {
      sessionStorage.setItem('hasSeenIntro', 'true')
    }
  }, [])

  const handleIntroComplete = () => {
    sessionStorage.setItem('hasSeenIntro', 'true')
    setShowIntro(false)
    setTimeout(() => setIntroComplete(true), 100)
  }

  return (
    <CartProvider>
      <Router>
        <AnimatePresence mode="wait">
          {showIntro && !introComplete ? (
            <IntroAnimation key="intro" onComplete={handleIntroComplete} />
          ) : (
            <Layout key="main">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/portfolio" element={<Portfolio />} />
                <Route path="/portfolio/:id" element={<ProjectDetail />} />
                <Route path="/about" element={<About />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/contact" element={<Contact />} />
              </Routes>
            </Layout>
          )}
        </AnimatePresence>
      </Router>
    </CartProvider>
  )
}

export default App
