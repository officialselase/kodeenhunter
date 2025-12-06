import { useEffect } from 'react'

// Preload critical routes on app mount
export const useRoutePreload = () => {
  useEffect(() => {
    const criticalRoutes = ['/portfolio', '/shop', '/contact']
    
    criticalRoutes.forEach((route) => {
      const link = document.createElement('link')
      link.rel = 'prefetch'
      link.href = route
      document.head.appendChild(link)
    })
  }, [])
}

// Preload a specific route
export const preloadRoute = (path: string) => {
  const link = document.createElement('link')
  link.rel = 'prefetch'
  link.href = path
  document.head.appendChild(link)
}
