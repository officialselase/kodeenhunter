# Phase 10: Quick Start Guide

This guide helps you quickly set up and test the new Phase 10 features.

---

## 1. Environment Setup (2 minutes)

### Create `.env` file in `frontend/` directory:

```bash
# Copy the example file
cp frontend/.env.example frontend/.env
```

### Edit `frontend/.env` and add your credentials:

```bash
# Backend API (already configured)
VITE_API_URL=http://localhost:8000

# Google Analytics 4 (optional - get from https://analytics.google.com)
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
VITE_ENABLE_ANALYTICS=true

# Sentry Error Tracking (optional - get from https://sentry.io)
VITE_SENTRY_DSN=
VITE_ENABLE_ERROR_LOGGING=false

# Environment
VITE_ENV=development
```

---

## 2. Test SEO Features (5 minutes)

### Test Sitemap
1. Start backend: `python manage.py runserver 8000`
2. Visit: http://localhost:8000/sitemap.xml
3. ✅ Should see XML with all pages, projects, and products

### Test Robots.txt
1. Visit: http://localhost:5173/robots.txt
2. ✅ Should see robots directives

### Test Meta Tags
1. Start frontend: `cd frontend && npm run dev`
2. Visit any page
3. Right-click → Inspect → `<head>` section
4. ✅ Should see meta tags, Open Graph, Twitter Cards

### Test Structured Data
1. Visit: https://search.google.com/test/rich-results
2. Enter your page URL (when deployed)
3. ✅ Should detect structured data

---

## 3. Test Analytics (5 minutes)

### Enable GA4 DebugView
1. Install Chrome extension: "Google Analytics Debugger"
2. Enable the extension
3. Visit: https://analytics.google.com/analytics/web/#/debugview

### Test Events
1. Navigate between pages → ✅ See `page_view` events
2. Add product to cart → ✅ See `add_to_cart` event
3. Start checkout → ✅ See `begin_checkout` event
4. Complete order → ✅ See `purchase` event
5. Start booking → ✅ See `booking_started` event
6. Submit contact form → ✅ See `form_submission` event

### Verify in Console
```javascript
// Open browser console
// You should see: [Web Vitals] CLS, FCP, LCP, etc.
```

---

## 4. Test Security Features (5 minutes)

### Test Input Validation
```javascript
// Open browser console
import { isValidEmail, isValidPhone } from './utils/security'

isValidEmail('test@example.com') // ✅ true
isValidEmail('invalid-email') // ❌ false

isValidPhone('555-123-4567') // ✅ true
isValidPhone('abc') // ❌ false
```

### Test Secure Storage
```javascript
// Open browser console
import { secureStorage } from './utils/security'

secureStorage.setItem('test', { data: 'secret' })
secureStorage.getItem('test') // ✅ { data: 'secret' }

// Check localStorage - should see base64 encoded data
localStorage.getItem('test') // ✅ Encoded string
```

### Test Cart Persistence
1. Add items to cart
2. Refresh page
3. ✅ Cart items should persist

### Test Rate Limiting
```javascript
// Open browser console
import { RateLimiter } from './utils/security'

const limiter = new RateLimiter()
for (let i = 0; i < 10; i++) {
  console.log(`Attempt ${i + 1}:`, limiter.isAllowed('test', 5, 60000))
}
// ✅ First 5 should be true, rest false
```

---

## 5. Test Error Handling (5 minutes)

### Test 404 Page
1. Visit: http://localhost:5173/nonexistent-page
2. ✅ Should see custom 404 page with navigation

### Test 500 Page
1. Visit: http://localhost:5173/500
2. ✅ Should see custom 500 page

### Test Error Boundary
1. Temporarily break a component (add `throw new Error('test')`)
2. ✅ Should see error boundary UI
3. Remove the error

### Test Error Logging
```javascript
// Open browser console
import { logError, getErrorLogs } from './utils/errorLogger'

logError(new Error('Test error'), { context: 'testing' })
getErrorLogs() // ✅ Should see logged error

// Check localStorage
localStorage.getItem('error_logs') // ✅ Should see error data
```

### Test API Error Handling
1. Stop backend server
2. Try to load portfolio page
3. ✅ Should see error logged in console
4. ✅ Should retry 3 times (check Network tab)

---

## 6. Production Checklist

### Before Deploying

#### Backend Configuration
```python
# backend/settings.py or environment variables
DEBUG=False
ALLOWED_HOSTS=kodeenhunter.com,www.kodeenhunter.com
SESSION_SECRET=your-super-secret-key-here
```

#### Frontend Configuration
```bash
# frontend/.env.production
VITE_API_URL=https://api.kodeenhunter.com
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
VITE_ENABLE_ANALYTICS=true
VITE_SENTRY_DSN=https://xxx@sentry.io/xxx
VITE_ENABLE_ERROR_LOGGING=true
VITE_ENV=production
```

#### Security Headers Check
Visit: https://securityheaders.com
Enter your domain and verify:
- ✅ HSTS enabled
- ✅ X-Frame-Options: DENY
- ✅ X-Content-Type-Options: nosniff
- ✅ Referrer-Policy set

#### SSL Certificate
- ✅ HTTPS enabled
- ✅ Valid SSL certificate
- ✅ HTTP redirects to HTTPS

#### SEO Submission
1. Submit sitemap to Google Search Console
2. Submit sitemap to Bing Webmaster Tools
3. Verify robots.txt is accessible
4. Test structured data with Google Rich Results Test

---

## 7. Monitoring & Maintenance

### Daily Checks
- [ ] Check GA4 for traffic and events
- [ ] Check error logs in Sentry (if enabled)
- [ ] Monitor server uptime

### Weekly Checks
- [ ] Review error logs in localStorage (development)
- [ ] Check analytics conversion rates
- [ ] Review security headers
- [ ] Test critical user flows

### Monthly Checks
- [ ] Update dependencies
- [ ] Review and optimize bundle size
- [ ] Audit SEO performance
- [ ] Review and update meta descriptions

---

## 8. Troubleshooting

### Analytics Not Working
- ✅ Check GA_MEASUREMENT_ID is correct
- ✅ Check browser console for errors
- ✅ Verify GA4 script loads (Network tab)
- ✅ Check ad blockers are disabled
- ✅ Use GA4 DebugView for real-time testing

### SEO Issues
- ✅ Verify meta tags in page source
- ✅ Check sitemap.xml loads correctly
- ✅ Test with Google Rich Results Test
- ✅ Verify canonical URLs are correct

### Security Issues
- ✅ Check CSRF token in POST requests
- ✅ Verify HTTPS redirect works
- ✅ Test security headers with securityheaders.com
- ✅ Check CORS configuration

### Error Logging Issues
- ✅ Check browser console for errors
- ✅ Verify error_logs in localStorage
- ✅ Check Sentry DSN is correct (if using)
- ✅ Test global error handlers

---

## 9. Optional Enhancements

### Sentry Integration
```bash
# Install Sentry
npm install @sentry/react

# Uncomment Sentry code in:
# - frontend/src/utils/errorLogger.ts
# - Add VITE_SENTRY_DSN to .env
```

### Hotjar Integration
```html
<!-- Add to frontend/index.html -->
<script>
  (function(h,o,t,j,a,r){
    h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
    h._hjSettings={hjid:YOUR_HOTJAR_ID,hjsv:6};
    a=o.getElementsByTagName('head')[0];
    r=o.createElement('script');r.async=1;
    r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
    a.appendChild(r);
  })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
</script>
```

---

## 10. Resources

### Documentation
- [Google Analytics 4](https://developers.google.com/analytics/devguides/collection/ga4)
- [Sentry React](https://docs.sentry.io/platforms/javascript/guides/react/)
- [Schema.org](https://schema.org/)
- [Open Graph Protocol](https://ogp.me/)
- [Twitter Cards](https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/abouts-cards)

### Tools
- [Google Search Console](https://search.google.com/search-console)
- [Google Rich Results Test](https://search.google.com/test/rich-results)
- [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
- [Twitter Card Validator](https://cards-dev.twitter.com/validator)
- [Security Headers](https://securityheaders.com/)
- [SSL Labs](https://www.ssllabs.com/ssltest/)

---

## Summary

Phase 10 adds production-ready features:
- ✅ **SEO**: Meta tags, structured data, sitemap
- ✅ **Analytics**: GA4 with comprehensive tracking
- ✅ **Security**: Input validation, CSRF, secure storage
- ✅ **Error Handling**: Custom pages, logging, retry logic

**Total Setup Time**: ~20 minutes  
**Status**: ✅ Ready for Production

---

**Next**: Phase 11 - Testing & QA
