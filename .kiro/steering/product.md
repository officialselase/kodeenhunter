# Product Overview

Kodeen Hunter Portfolio - A world-class minimalist portfolio website for a professional videographer.

## Core Features

- Animated intro sequence with QR code dissolving into clapperboard with heartbeat logo
- 3D film reel element using Three.js with WebGL fallback and VR support
- Video portfolio with category filters and lightbox viewing
- Integrated shop for digital products (presets, LUTs, templates)
- Contact form with booking inquiry system
- Fully responsive, mobile-first design

## Design Philosophy

- All-white background for clean, minimalist aesthetic that makes videos pop
- Grayscale to color transitions on hover for visual interest
- Smooth page transitions with Framer Motion
- Cross-browser and VR compatible (WebXR detection)

## User Experience

- Skip intro animation with `?skip=true` URL parameter
- Session-based intro tracking (shows once per session)
- Dynamic content from Django REST API with fallback data for offline/demo mode
- Cart functionality with checkout API integration
