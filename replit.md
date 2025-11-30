# Kodeen Hunter - Videographer Portfolio

## Overview
A world-class minimalist portfolio website for Kodeen Hunter, a professional videographer. Features stunning animations, 3D elements, video showcase, and an integrated shop.

## Tech Stack
- **Frontend**: React 18, TypeScript, Tailwind CSS, Framer Motion, Three.js
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
- Animated intro sequence (QR code → clapperboard → heartbeat logo)
- 3D film reel element using Three.js
- Video portfolio with category filters
- Shop with cart functionality
- Contact form with booking inquiry
- Fully responsive design
- VR-ready with WebXR support

## Running the Application
The application runs both servers:
- Frontend (React): Port 5000
- Backend (Django): Port 8000

## Admin Access
- URL: /admin/
- Username: admin
- Password: admin123

## API Endpoints
- `/api/portfolio/projects/` - Portfolio projects
- `/api/portfolio/categories/` - Project categories
- `/api/portfolio/contact/` - Contact form submissions
- `/api/shop/products/` - Shop products
- `/api/shop/categories/` - Product categories
- `/api/shop/orders/` - Order management

## User Preferences
- All-white background for clean, minimalist aesthetic
- Cross-browser and VR compatible
- Mobile-first responsive design

## Recent Changes
- Initial project setup with full stack implementation
- Created stunning intro animation sequence
- Built 3D camera element with Three.js
- Implemented portfolio, shop, about, and contact pages
- Set up Django admin for content management
