# Tech Stack

## Frontend

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite 7.x
- **Styling**: Tailwind CSS v4 with PostCSS
- **Animations**: Framer Motion, GSAP
- **3D Graphics**: Three.js, @react-three/fiber, @react-three/drei
- **Routing**: React Router DOM v7
- **Icons**: Lucide React
- **State Management**: React Context API (CartContext)

## Backend

- **Framework**: Django 5.x
- **API**: Django REST Framework
- **Database**: SQLite (development)
- **CORS**: django-cors-headers
- **Media Handling**: Pillow
- **Server**: Gunicorn (production)

## Development Environment

- **Python**: >=3.11 (managed with uv/pyproject.toml)
- **Node**: Uses npm for package management
- **Deployment**: Vercel (frontend), Railway/Replit (backend)

## Common Commands

### Frontend Development
```bash
cd frontend
npm install
npm run dev          # Start dev server on port 5173
npm run build        # Build for production (TypeScript + Vite)
npm run preview      # Preview production build
```

### Backend Development
```bash
python manage.py runserver 8000    # Start Django dev server
python manage.py migrate           # Run database migrations
python manage.py createsuperuser   # Create admin user
python manage.py collectstatic     # Collect static files
```

### Admin Access
- URL: `/admin/`
- Default credentials: admin / admin123

## Environment Variables

### Frontend (.env)
- `VITE_API_URL` - Backend API URL (defaults to Replit dev URL)

### Backend
- `SESSION_SECRET` - Django secret key (defaults to dev key)

## API Endpoints

- `/api/portfolio/projects/` - Portfolio projects (GET)
- `/api/portfolio/projects/featured/` - Featured projects (GET)
- `/api/portfolio/categories/` - Project categories (GET)
- `/api/portfolio/contact/` - Contact form submissions (POST)
- `/api/shop/products/` - Shop products (GET)
- `/api/shop/products/featured/` - Featured products (GET)
- `/api/shop/categories/` - Product categories (GET)
- `/api/shop/orders/` - Order management (POST)
