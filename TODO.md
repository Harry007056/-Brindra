# Brindra Render Deployment Fix - TODO List

**Status:** In progress

## Remaining Steps from Approved Plan:
- [ ] 1. User: cd Backend && npm install (refresh node_modules/package-lock.json)
- [ ] 2. git add . && git commit -m 'fix(render): update Procfile and scripts for correct path resolution' && git push
- [ ] 3. Render Dashboard: 
  - Settings tab → Root Directory: `Backend` (primary fix)
  - Node version: 20 (LTS)
  - Environment Variables: `MONGO_URI=mongodb+srv://...` (Atlas), `NODE_ENV=production`
  - Trigger Manual Deploy or auto from git
- [ ] 4. Check logs for: '✅ Backend running on port ...'
- [ ] 5. Test endpoint: https://your-app.onrender.com/api/health → should return status: 'ok'
- [ ] 6. If fails, share new Render logs

**Next:** Complete step 1 locally, then 2-3 on Render dashboard.

**Completed after this:** Backend/server.js MODULE_NOT_FOUND resolved, app deploys successfully.
