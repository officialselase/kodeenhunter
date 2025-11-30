# Kodeen Hunter - Videographer Portfolio

## Overview
A world-class minimalist portfolio website for Kodeen Hunter, a professional videographer. Features stunning animations, 3D elements, video showcase, and an integrated shop with Django backend for content management.

## Tech Stack
- **Frontend**: React 18, TypeScript, Tailwind CSS v4, Framer Motion, Three.js
- **Backend**: Django 5.x, Django REST Framework
- **Database**: SQLite (development)

## Project Structure
```
/
├── frontend/          # React frontend application
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── pages/        # Page components
│   │   ├── context/      # React context (Cart)
│   │   ├── services/     # API service layer
│   │   └── hooks/        # Custom hooks
│   └── public/           # Static assets
├── backend/           # Django settings
├── portfolio/         # Portfolio app (projects, categories, contact)
├── shop/             # Shop app (products, orders)
├── static/           # Django static files
├── media/            # User uploaded files
└── manage.py         # Django management script
```

## Key Features
- Animated intro sequence (QR code dissolving into clapperboard with heartbeat logo)
- 3D film reel element using Three.js with WebGL fallback
- Video portfolio with category filters and lightbox
- Shop with cart functionality and checkout API
- Contact form with booking inquiry (submits to Django API)
- Fully responsive design
- VR-ready with WebXR detection and support
- Dynamic content from Django REST API with fallback data

## Running the Application
The application runs both servers:
- Frontend (React): Port 5000 - Webview accessible
- Backend (Django): Port 8000 - API server

## Admin Access
- URL: /admin/
- Username: admin
- Password: admin123

## API Endpoints
- `/api/portfolio/projects/` - Portfolio projects (GET)
- `/api/portfolio/projects/featured/` - Featured projects (GET)
- `/api/portfolio/categories/` - Project categories (GET)
- `/api/portfolio/contact/` - Contact form submissions (POST)
- `/api/shop/products/` - Shop products (GET)
- `/api/shop/products/featured/` - Featured products (GET)
- `/api/shop/categories/` - Product categories (GET)
- `/api/shop/orders/` - Order management (POST)

## Design Choices
- All-white background for clean, minimalist aesthetic that makes videos pop
- Grayscale to color transitions on hover for visual interest
- Custom heartbeat logo serves as loading animation
- Smooth page transitions with Framer Motion

## User Preferences
- All-white background for maximum visual impact
- Cross-browser and VR compatible
- Mobile-first responsive design
- Skip intro animation with `?skip=true` URL parameter

## Recent Changes (November 30, 2025)
- Added API service layer for frontend-backend integration
- Updated Portfolio, Shop, Home, and Contact pages to use Django API
- Added fallback data for offline/demo mode
- Enhanced 3D component with WebXR/VR detection
- Added Cart checkout functionality with API integration
- Added TypeScript Vite environment types
- Improved WebGL context loss handling
