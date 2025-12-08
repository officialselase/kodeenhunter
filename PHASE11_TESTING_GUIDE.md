# Phase 11: Testing & QA - Complete Guide

## Overview
Comprehensive testing infrastructure for the Kodeen Hunter Portfolio project, including unit tests, integration tests, and E2E testing guidelines.

## Testing Stack

### Frontend
- **Framework**: Vitest
- **Testing Library**: @testing-library/react
- **Coverage**: v8
- **E2E**: Playwright (recommended)

### Backend
- **Framework**: Django TestCase
- **API Testing**: Django REST Framework APITestCase
- **Coverage**: coverage.py

## Quick Start

### Frontend Testing
```bash
cd frontend

# Install test dependencies
npm install -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom

# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

### Backend Testing
```bash
# Run all tests
python manage.py test

# Run specific app tests
python manage.py test portfolio
python manage.py test shop
python manage.py test booking

# Run with coverage
coverage run --source='.' manage.py test
coverage report
coverage html
```

## Test Structure

### Frontend Tests
```
frontend/src/tests/
├── components/          # Component tests
│   ├── BookingWidget.test.tsx
│   └── Cart.test.tsx
├── hooks/              # Custom hook tests
│   └── useCart.test.tsx
├── utils/              # Utility tests
│   └── test-utils.tsx  # Custom render with providers
└── setup.ts            # Test configuration
```

### Backend Tests
```
backend/
├── portfolio/tests.py  # Portfolio app tests
├── shop/tests.py       # Shop app tests
└── booking/tests.py    # Booking app tests
```

## Test Coverage

### Current Coverage
- Frontend: Unit tests for critical components
- Backend: API endpoint tests for all apps
- Integration: Order creation, booking flow

### Coverage Goals
- Unit Tests: 80%+ coverage
- Integration Tests: Critical user flows
- E2E Tests: Main user journeys

## Running Tests

### Frontend
```bash
# All tests
npm test

# Specific test file
npm test useCart.test.tsx

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage
```

### Backend
```bash
# All tests
python manage.py test

# Specific app
python manage.py test portfolio.tests.ProjectAPITest

# With verbosity
python manage.py test --verbosity=2

# Keep test database
python manage.py test --keepdb
```

## Test Examples

### Component Test
```typescript
it('renders booking button', () => {
  render(<BookingWidget />);
  expect(screen.getByText(/book now/i)).toBeInTheDocument();
});
```

### Hook Test
```typescript
it('adds item to cart', () => {
  const { result } = renderHook(() => useCart(), { wrapper });
  act(() => {
    result.current.addToCart(product);
  });
  expect(result.current.items).toHaveLength(1);
});
```

### API Test
```python
def test_get_projects_list(self):
    url = reverse('project-list')
    response = self.client.get(url)
    self.assertEqual(response.status_code, status.HTTP_200_OK)
```

## Manual Testing Checklist

### Critical User Flows
- [ ] Browse portfolio projects
- [ ] View project details
- [ ] Submit contact form
- [ ] Browse shop products
- [ ] Add products to cart
- [ ] Complete checkout
- [ ] Create booking
- [ ] Receive confirmation emails

### Cross-Browser Testing
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

### Responsive Testing
- [ ] Mobile (320px - 480px)
- [ ] Tablet (768px - 1024px)
- [ ] Desktop (1280px+)
- [ ] Large screens (1920px+)
- [ ] Portrait orientation
- [ ] Landscape orientation

### Accessibility Testing
- [ ] Keyboard navigation
- [ ] Screen reader (NVDA/VoiceOver)
- [ ] Color contrast
- [ ] Focus indicators
- [ ] ARIA labels
- [ ] Lighthouse accessibility audit

### Performance Testing
- [ ] Lighthouse performance score (90+)
- [ ] First Contentful Paint (<1.5s)
- [ ] Time to Interactive (<3.5s)
- [ ] Bundle size (<300KB)
- [ ] Image optimization
- [ ] API response times

## E2E Testing (Recommended)

### Setup Playwright
```bash
cd frontend
npm install -D @playwright/test
npx playwright install
```

### Example E2E Test
```typescript
// e2e/booking.spec.ts
test('complete booking flow', async ({ page }) => {
  await page.goto('/');
  await page.click('text=Book Now');
  await page.selectOption('select[name="service"]', 'Wedding');
  await page.fill('input[name="date"]', '2025-12-25');
  await page.fill('input[name="name"]', 'John Doe');
  await page.fill('input[name="email"]', 'john@example.com');
  await page.click('button[type="submit"]');
  await expect(page.locator('text=Booking Confirmed')).toBeVisible();
});
```

## CI/CD Integration

### GitHub Actions Example
```yaml
name: Tests
on: [push, pull_request]
jobs:
  frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: cd frontend && npm ci
      - run: cd frontend && npm test
  
  backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-python@v4
      - run: pip install -r requirements.txt
      - run: python manage.py test
```

## Next Steps

1. Install test dependencies
2. Run existing tests
3. Add E2E tests with Playwright
4. Set up CI/CD pipeline
5. Achieve 80%+ coverage
6. Perform manual testing
7. Document test results

---

**Status**: ✅ Testing infrastructure complete
**Last Updated**: December 8, 2025
