# Kodeen Hunter Portfolio - Frontend

React + TypeScript + Vite frontend for the portfolio website.

## Deployment on Vercel

### Quick Deploy

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New" → "Project"
3. Import your Git repository
4. Configure the project:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

### Environment Variables

Add this environment variable in Vercel:

- `VITE_API_URL` - Your backend API URL (e.g., `https://your-backend.railway.app`)

### Local Development

```bash
cd frontend
npm install
npm run dev
```

Create a `.env` file based on `.env.example` for local development.
