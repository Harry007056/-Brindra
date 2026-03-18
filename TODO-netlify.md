# Netlify Deployment Guide

Status: ✅ **Ready**

## Config Files Created
- `frontend/netlify.toml`: Build command `npm run build`, publish `dist`, SPA redirects `/*` → `/index.html`

## Deploy Steps
1. Install CLI: `npm install -g netlify-cli`
2. Login: `netlify login`
3. From project root:
   ```
   cd frontend
   netlify deploy --prod --dir=dist
   ```
   Or build first: `npm run build` then deploy.

## Settings (Netlify Dashboard)
- Build command: `npm run build`
- Publish directory: `dist`
- Framework: Vite

## Post-Deploy
- Update `frontend/src/api.js` backend URL (e.g., env REACT_APP_API_URL).
- Backend host separately.
- Test: SPA routes (React Router), API calls.

**Netlify URL:** After deploy (e.g., https://brindra.netlify.app)

