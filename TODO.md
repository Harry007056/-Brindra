# Netlify Fix Progress

## Steps:
1. [x] Update root package.json "build" script to `cd frontend && npm ci && npm run build`
2. [x] Update frontend/netlify.toml command to `npm ci && npm run build`
3. [x] Create root netlify.toml with base=frontend, publish=dist
4. [x] Update TODO-netlify.md with UI instructions
5. [ ] Test local `npm run build`
6. [ ] Netlify UI: Set Base directory `frontend`, Publish `dist`
7. [ ] Deploy and verify
