# Architecture Decisions

## Booking System

### Decision: Floating Widget (Recommended)
- **Location**: Bottom-right corner, accessible from all pages
- **Behavior**: Slide-up panel with minimize/maximize
- **Components**: 
  - `BookingWidget.tsx` - Main widget container
  - `BookingForm.tsx` - Form with date picker, service selection
  - `BookingConfirmation.tsx` - Success state
- **State Management**: React Context or local state
- **Animation**: Framer Motion for smooth transitions

### Alternative: Dedicated Page
- Route: `/booking`
- Full-page experience
- Requires navigation from CTAs

## Payment Integration

### Decision: Stripe (Recommended)
- **Reason**: Best developer experience, comprehensive docs, fraud protection
- **Implementation**: 
  - Frontend: `@stripe/stripe-js` and `@stripe/react-stripe-js`
  - Backend: `stripe` Python package
- **Flow**: 
  1. Create payment intent on backend
  2. Collect payment on frontend
  3. Confirm payment
  4. Deliver digital product/send confirmation

### Alternative: PayPal
- Good for customers who prefer PayPal
- Can implement both (recommended for maximum conversion)

## Email Service

### Decision: SendGrid (Recommended for MVP)
- **Reason**: Easy setup, free tier (100 emails/day), good templates
- **Implementation**: `sendgrid` Python package
- **Templates Needed**:
  - Order confirmation
  - Digital product download link
  - Booking confirmation
  - Booking reminder (24h before)
  - Contact form notification (to admin)

### Alternative: AWS SES
- Cheaper at scale ($0.10 per 1000 emails)
- Requires AWS account setup
- Good for production scaling

## Video Hosting

### Decision: Self-hosted for Hero Video
- **Reason**: Full control, no external dependencies
- **Format**: MP4 (H.264) + WebM (VP9) for compatibility
- **Size**: Compress to <5MB
- **Fallback**: Static image for unsupported browsers

### Portfolio Videos: YouTube/Vimeo Embeds
- **Reason**: Reduce server bandwidth, professional player
- **Implementation**: Embed URLs in Project model

## State Management

### Current: React Context API
- **Cart**: CartContext for shopping cart state
- **Future**: Consider adding BookingContext if needed

### No Redux/Zustand Needed
- App complexity doesn't justify additional state management
- Context API sufficient for current requirements

## Styling Approach

### Tailwind CSS v4 (Current)
- Utility-first approach
- No custom CSS files except index.css
- Responsive design with mobile-first
- Custom colors defined in tailwind.config.js

### Animation Libraries
- **Framer Motion**: Page transitions, component animations
- **GSAP**: Complex timeline animations (if needed)
- **Three.js**: 3D elements (Camera3D component - archived)

## API Architecture

### RESTful API (Current)
- Django REST Framework
- Standard CRUD operations
- Pagination enabled (12 items per page)

### Future Consideration: GraphQL
- Only if frontend needs become more complex
- Not needed for MVP

## File Storage

### Development: Local Storage
- Media files in `/media/` directory
- Static files in `/static/` directory

### Production: CDN Recommended
- **Options**: Cloudflare, AWS CloudFront, Vercel Edge
- **Reason**: Faster global delivery, reduced server load
- **Priority**: Medium (implement after MVP launch)

## Database

### Development: SQLite (Current)
- Simple, no setup required
- Good for development and small-scale production

### Production: Consider PostgreSQL
- Better performance at scale
- Required for advanced features (full-text search)
- **Priority**: Low (SQLite fine for MVP)

## Deployment Strategy

### Frontend: Vercel (Current)
- **Reason**: Excellent Vite support, automatic deployments, edge network
- **Config**: Root directory set to `frontend/`

### Backend: Railway/Replit (Current)
- **Reason**: Easy Django deployment, free tier available
- **Alternative**: AWS Elastic Beanstalk, DigitalOcean App Platform

### Future: Monorepo Deployment
- Consider deploying both from single repo
- Use Vercel for frontend, Railway for backend
- Connect via environment variables

## Security Decisions

### HTTPS: Required for Production
- Vercel provides automatic HTTPS
- Backend must also use HTTPS (Railway provides this)

### CORS: Configured for Development
- Allow localhost:5173 for development
- Update for production domains

### CSRF Protection: Enabled
- Django CSRF middleware active
- Frontend must include CSRF token for POST requests

### Rate Limiting: To Be Implemented
- Use Django REST Framework throttling
- Protect API endpoints from abuse
- **Priority**: High (implement before launch)

## Testing Strategy

### Unit Tests: To Be Implemented
- Frontend: Vitest + React Testing Library
- Backend: Django TestCase

### E2E Tests: To Be Implemented
- Playwright or Cypress
- Test critical user flows (booking, checkout)

### Manual Testing: Required
- Cross-browser testing
- Mobile device testing
- Accessibility testing

## Performance Targets

### Lighthouse Scores (Target)
- Performance: 90+
- Accessibility: 95+
- Best Practices: 95+
- SEO: 95+

### Load Times (Target)
- First Contentful Paint: <1.5s
- Time to Interactive: <3.5s
- Total Page Load: <3s

### Bundle Size (Target)
- Initial JS bundle: <300KB
- Total assets: <1MB (excluding videos)

## Accessibility Standards

### Target: WCAG 2.1 AA Compliance
- Keyboard navigation
- Screen reader support
- Proper ARIA labels
- Color contrast ratios
- Focus indicators

## Browser Support

### Modern Browsers (Target)
- Chrome/Edge: Last 2 versions
- Firefox: Last 2 versions
- Safari: Last 2 versions
- Mobile Safari: Last 2 versions
- Chrome Mobile: Last 2 versions

### No IE11 Support
- Modern features required (ES6+, CSS Grid, etc.)
- Graceful degradation for older browsers

---

**Last Updated**: December 6, 2025
**Status**: Decisions documented for implementation
