# TODO: Make All Static Data Dynamic - Progress Tracker

## Plan Overview
Replace hardcoded static data with API fetches across backend/frontend. Prioritize plans/pricing, then filters/palettes.

## Steps (Mark [x] when complete)

### Backend Updates
- [x] Update Backend/models/Plans.js schema to match frontend data (add features, limitations, popular, etc.)
- [x] Create Backend/controllers/PlansController.js (GET /api/plans)
- [x] Create Backend/Services/PlanService.js (if needed for logic)
- [x] Create Backend/routes/plansRoutes.js
- [x] Mount routes in Backend/app.js
- [x] Create Backend/scripts/seedPlans.js with initial data
- [x] Run seed script
- [ ] Optional: Update other models (e.g., add roles/statuses for dynamic filters)

### Frontend Updates
- [x] Remove/replace frontend/src/data/plans.js
- [x] Update frontend/src/pages/Pricing.jsx: Fetch dynamic plans, derive comparison/addons
- [ ] Update frontend/src/pages/Projects.jsx: Dynamic filters/avatar if possible
- [ ] Update frontend/src/pages/Teams.jsx: Dynamic role filters
- [ ] Update frontend/src/pages/Settings.jsx: Dynamic options/palettes
- [ ] Other pages (Tasks, Analytics, etc.): Scan/update if static found

### Seeding & Testing
- [ ] Test: Backend `npm start`, seed data, check /api/plans
- [ ] Frontend `npm run dev`, verify fetches/loading/error states
- [ ] Full project test: Pricing, Projects, Teams, Settings

## Current Progress
Backend Plans API ready (model, controller, routes, app.js mounted). Schema updated. Seed script ready.

**Next Step: Seed data and test backend, then frontend Pricing.jsx**

To seed: cd Backend && node scripts/seedPlans.js

