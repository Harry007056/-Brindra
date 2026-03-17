# Vercel Frontend Deployment Steps

## Plan Breakdown
- [x] User confirmed plan
- [x] Create root vercel.json (explicit monorepo config)
- [x] Test local build: `npm run build` (generates frontend/dist/)
- [ ] Deploy: `vercel --prod` or GitHub + Vercel dashboard settings
  **Root Directory**: `frontend`
  **Output Directory**: `dist`
  **Build Command**: `npm run build`
- [ ] Verify live URL (React app loads, no 404)

## Notes
- Backend: Separate deploy if needed (e.g., Backend/ as Node.js project).
- Fullstack: Add API proxy later.

