# Backend Deploy to Render (Persistent Server + Socket.io)

Status: 🚀 **Ready to Deploy** (Socket.io ✅, Atlas ✅)

## Prerequisites ✅
- MongoDB Atlas URI (set as env var)
- GitHub repo pushed
- Render.com account (free tier)

## Step-by-Step Deploy
### 1. Prepare Backend (Done by BLACKBOXAI)
```
cd Backend
npm install
npm run dev  # Test locally
```

**package.json scripts:**
- `dev`: nodemon server.js
- `start`: node server.js

### 2. Environment Variables (Render Dashboard)
```
MONGO_URI=your_atlas_connection_string
JWT_SECRET=your_secret
PORT=10000  # Render assigns
NODE_ENV=production
```

### 3. Deploy to Render
1. Login: render.com → New → Web Service
2. Connect GitHub repo
3. Settings:
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Root Directory**: `Backend`
4. Add env vars (above)
5. Deploy → URL: https://your-app.onrender.com

### 4. Post-Deploy
- Test: `curl https://your-app.onrender.com/api/health`
- Update frontend `src/api.js`: `baseURL = 'https://your-app.onrender.com/api'`
- Redeploy frontend (Netlify/Vercel)

### 5. Socket.io
- Works out-of-box (persistent server)
- Frontend connects: `io('https://your-app.onrender.com')`

## Troubleshooting
- Logs: Render dashboard
- Free tier sleeps after 15min inactivity
- Upgrade for always-on: $7/mo

**Next: Get Render URL → Update frontend → Full stack live!**

✅ Backend files prepared (render.yaml, .env.example created)
[ ] Local test passed
[ ] Render deployed
[ ] Frontend API URL updated
[ ] End-to-end test
