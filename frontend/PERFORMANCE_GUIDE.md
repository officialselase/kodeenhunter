# Performance Optimization Guide

Quick reference for using the performance features implemented in Phase 8.

## Lazy Loading Images

### Basic Usage

Replace standard `<img>` tags with the `LazyImage` component:

```tsx
import LazyImage from '../components/LazyImage'

// Before
<img src={project.thumbnail} alt={project.title} className="w-full h-full object-cover" />

// After
<LazyImage
  src={project.thumbnail}
  alt={project.title}
  className="w-full h-full object-cover"
/>
```

### With Placeholder Styling

```tsx
<LazyImage
  src={product.image}
  alt={product.name}
  className="w-full h-full object-cover"
  placeholderClassName="bg-gray-200"
  onLoad={() => console.log('Image loaded!')}
/>
```

## Image Optimization

### Optimize External Images

```tsx
import { getOptimizedImageUrl } from '../utils/imageOptimization'

<img 
  src={getOptimizedImageUrl(imageUrl, 800, 80)} 
  alt="Optimized image"
/>
```

### Responsive Images with srcSet

```tsx
import { getOptimizedImageUrl, generateSrcSet } from '../utils/imageOptimization'

<img
  src={getOptimizedImageUrl(imageUrl, 800)}
  srcSet={generateSrcSet(imageUrl, [400, 800, 1200, 1600])}
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 800px"
  alt="Responsive image"
/>
```

### Preload Critical Images

```tsx
import { preloadImages } from '../utils/imageOptimization'

useEffect(() => {
  const criticalImages = [
    '/hero-image.jpg',
    '/logo.png',
  ]
  preloadImages(criticalImages)
}, [])
```

## Service Worker

### Check if Offline

```tsx
const [isOnline, setIsOnline] = useState(navigator.onLine)

useEffect(() => {
  const handleOnline = () => setIsOnline(true)
  const handleOffline = () => setIsOnline(false)
  
  window.addEventListener('online', handleOnline)
  window.addEventListener('offline', handleOffline)
  
  return () => {
    window.removeEventListener('online', handleOnline)
    window.removeEventListener('offline', handleOffline)
  }
}, [])

{!isOnline && <div>You are offline. Some features may be limited.</div>}
```

### Unregister Service Worker (if needed)

```tsx
import { unregisterServiceWorker } from '../utils/registerServiceWorker'

// Call when needed
await unregisterServiceWorker()
```

## Web Vitals Monitoring

Web Vitals are automatically monitored in production. To customize:

```tsx
// In main.tsx
import { onCLS, onFID, onFCP, onLCP, onTTFB } from 'web-vitals'

const sendToAnalytics = (metric: any) => {
  // Send to your analytics service
  gtag('event', metric.name, {
    value: Math.round(metric.value),
    event_category: 'Web Vitals',
  })
}

onCLS(sendToAnalytics)
onFID(sendToAnalytics)
onFCP(sendToAnalytics)
onLCP(sendToAnalytics)
onTTFB(sendToAnalytics)
```

## Code Splitting

### Lazy Load Components

```tsx
import { lazy, Suspense } from 'react'

const HeavyComponent = lazy(() => import('./HeavyComponent'))

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HeavyComponent />
    </Suspense>
  )
}
```

### Preload Routes on Hover

```tsx
import { preloadRoute } from '../hooks/useRoutePreload'

<Link 
  to="/portfolio" 
  onMouseEnter={() => preloadRoute('/portfolio')}
>
  Portfolio
</Link>
```

## Backend Caching

### Cache Configuration

Adjust cache timeout in `backend/settings.py`:

```python
API_CACHE_TIMEOUT = 300  # 5 minutes
```

### Clear Cache

```python
from django.core.cache import cache

# Clear all cache
cache.clear()

# Clear specific key
cache.delete('key_name')
```

## Performance Testing

### Lighthouse Audit

```bash
cd frontend
npm run build
npm run preview
# Open Chrome DevTools > Lighthouse > Run audit
```

### Bundle Analysis

```bash
cd frontend
npm run build
# Check dist/ folder size
```

### Network Throttling

1. Open Chrome DevTools
2. Go to Network tab
3. Select "Fast 3G" or "Slow 3G"
4. Test page load performance

## Best Practices

### Images
- Use LazyImage for all images below the fold
- Optimize images before uploading (compress, resize)
- Use appropriate image formats (JPEG for photos, PNG for graphics)
- Always include alt text for accessibility

### Code
- Keep components small and focused
- Use React.memo() for expensive components
- Avoid inline functions in render
- Use useCallback and useMemo appropriately

### API
- Implement pagination for large lists
- Use query parameters for filtering
- Cache responses when appropriate
- Handle loading and error states

### Assets
- Minimize third-party scripts
- Load fonts efficiently
- Defer non-critical JavaScript
- Use CSS instead of JavaScript for animations when possible

## Monitoring

### Check Performance Metrics

```bash
# Frontend build size
cd frontend
npm run build
# Check dist/ folder

# Backend query performance
python manage.py shell
>>> from django.db import connection
>>> # Run your queries
>>> print(len(connection.queries))
>>> print(connection.queries)
```

### Production Monitoring

Consider adding:
- Google Analytics for user metrics
- Sentry for error tracking
- Vercel Analytics for Web Vitals
- LogRocket for session replay

## Troubleshooting

### Service Worker Not Working
- Service workers only work over HTTPS (or localhost)
- Check browser console for registration errors
- Clear browser cache and reload

### Images Not Lazy Loading
- Check if Intersection Observer is supported
- Verify imgRef is properly attached
- Check browser console for errors

### Cache Not Working
- Verify cache middleware is enabled
- Check cache timeout settings
- Clear cache and test again

### Slow API Responses
- Check database indexes
- Verify select_related/prefetch_related usage
- Monitor query count with Django Debug Toolbar

## Resources

- [Web Vitals](https://web.dev/vitals/)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)
- [Service Workers](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
- [Django Caching](https://docs.djangoproject.com/en/5.0/topics/cache/)
- [Vite Performance](https://vitejs.dev/guide/performance.html)
