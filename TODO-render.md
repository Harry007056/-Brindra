# Render Backend Deployment Fix

Status: 🔄 **In Progress**

## Steps (from approved plan):

- [x] 1. Update Backend/package.json: Stabilize deps (express ^4.21.1, mongoose ^8.6.4, mongodb ^6.8.0, move nodemon to devDeps)
- [x] 2. Update root package.json: Match Backend deps
- [x] 3. Edit Backend/app.js: Improve CORS for prod origins
- [x] 4. Edit Backend/server.js: Add debug logs
- [x] 5. Create Backend/Procfile: web: npm start
- [x] 6. Create README-render.md: Deploy guide
- [x] 7. cd Backend && npm install (refresh lockfile) – Run manually on Windows: cd Backend && npm install in Git Bash/pwsh
- [ ] 8. Commit/push to Git → Redeploy Render
- [ ] 9. Render dashboard: Add MONGO_URI env var (Atlas)
- [ ] 10. Test /api/health endpoint

**Notes:**
- Primary fix: MONGO_URI required (no local Mongo on Render)
- Test locally: cp .env.example .env, npm run start

