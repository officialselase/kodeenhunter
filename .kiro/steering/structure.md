# Project Structure

## Root Layout
```
/
├── frontend/          # React TypeScript application
├── backend/           # Django project settings
├── portfolio/         # Django app: projects, categories, contact
├── shop/             # Django app: products, orders
├── static/           # Django static files (images, videos)
├── media/            # User uploaded files (portfolio/, shop/)
├── templates/        # Django templates
├── manage.py         # Django management script
├── pyproject.toml    # Python dependencies (uv)
└── package.json      # Root workspace package
```

## Frontend Structure
```
frontend/
├── src/
│   ├── components/   # Reusable UI components
│   │   ├── archive/             # Archived components (not in use)
│   │   │   └── Camera3D.tsx     # Three.js 3D film reel (archived)
│   │   ├── Cart.tsx             # Shopping cart UI
│   │   ├── HeartbeatLoader.tsx  # Custom loading animation
│   │   ├── IntroAnimation.tsx   # Intro sequence
│   │   └── Layout.tsx           # Main layout wrapper
│   ├── pages/        # Route-based page components
│   │   ├── Home.tsx
│   │   ├── Portfolio.tsx
│   │   ├── ProjectDetail.tsx
│   │   ├── About.tsx
│   │   ├── Shop.tsx
│   │   └── Contact.tsx
│   ├── context/      # React Context providers
│   │   └── CartContext.tsx      # Cart state management
│   ├── services/     # API service layer
│   │   └── api.ts               # API client and type definitions
│   ├── hooks/        # Custom React hooks (empty, ready for use)
│   ├── utils/        # Utility functions (empty, ready for use)
│   ├── assets/       # Static assets (empty, ready for use)
│   ├── App.tsx       # Main app component with routing
│   ├── main.tsx      # React entry point
│   └── index.css     # Global styles (Tailwind imports)
├── public/           # Static public assets
│   └── favicon.svg
├── vite.config.ts    # Vite configuration
├── tailwind.config.js # Tailwind CSS configuration
├── tsconfig.json     # TypeScript configuration
└── package.json      # Frontend dependencies
```

## Django Apps

### Portfolio App
- **Models**: Project, Category, ProjectImage, Credit, Equipment, ContactSubmission
- **Purpose**: Manage videography projects, categories, and contact inquiries
- **Key Features**: Featured projects, image galleries, credits, equipment tracking

### Shop App
- **Models**: Product, ProductCategory, ProductFeature, ProductImage, Order, OrderItem
- **Purpose**: E-commerce for digital products (presets, LUTs, templates)
- **Key Features**: Digital downloads, featured products, order management

## Conventions

### Django Models
- Use `slug` fields for URL-friendly identifiers (unique=True)
- Include `order` fields for manual sorting (PositiveIntegerField)
- Use `featured` boolean for highlighting content
- Include `created_at` and `updated_at` timestamps
- Use `related_name` for reverse relationships
- Implement `__str__` methods for admin readability

### Frontend Components
- TypeScript for all components (.tsx)
- Functional components with hooks
- Props interfaces defined inline or exported
- Use Framer Motion for page transitions
- API calls through centralized service layer (services/api.ts)
- Fallback data for offline/demo mode

### API Integration
- Centralized API client in `services/api.ts`
- TypeScript interfaces for all API responses
- Environment-based API URL configuration
- Error handling with try/catch and fallback data

### Styling
- Tailwind CSS utility classes
- No custom CSS files except index.css (Tailwind imports)
- Responsive design with mobile-first approach
- Consistent white background theme
