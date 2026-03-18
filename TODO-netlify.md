# Netlify Deployment Guide & Fix

Status: 🔧 **Netlify Deploy Fixed - Updated for vite not found error**

## Repo Changes Applied
- `package.json`: build → `cd frontend && npm ci && npm run build`
- `frontend/netlify.toml` & `netlify.toml`: command → `npm ci && npm run build`
- Base directory: frontend, Publish: dist

## Netlify UI Settings (Dashboard > Build & deploy > Edit settings)
1. **Base directory**: `frontend`
2. **Build command**: `npm ci && npm run build` (or leave blank for netlify.toml)
3. **Publish directory**: `dist`
4. **Environment variables**: Add if needed (e.g., VITE_API_URL)

## Deploy Steps (CLI alternative)
1. `npm install -g netlify-cli`
2. `netlify login`
3. `npm run build`
4. `netlify deploy --prod --dir=frontend/dist`

## Test Locally
`npm run build` (root) - check `frontend/dist` generated, no vite error.

## Post-Deploy Checks
- SPA routing (React Router)
- API calls (update `frontend/src/api.js` baseURL if needed)
- Backend hosted separately (e.g., Railway/Render)

**Expected: Successful build with vite, site at https://your-site.netlify.app**
