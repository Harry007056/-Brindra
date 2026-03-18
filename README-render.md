# Render Backend Deployment Guide

## Prerequisites
1. MongoDB Atlas free cluster:
   - Create at [cloud.mongodb.com](https://cloud.mongodb.com)
   - Whitelist IP: 0.0.0.0/0
   - DB: `brindra`, User/Pass with readWrite
   - URI: `mongodb+srv://USER:PASS@cluster0.xxxxx.mongodb.net/brindra`

## Render Setup (render.com)
1. **Connect GitHub repo** → New → Web Service
2. **Settings:**
   - **Root Directory:** `Backend` (or root if detected)
   - **Build Command:** (blank/auto: `npm install`)
   - **Start Command:** `npm start`
   - **Node Version:** 20 (LTS)
3. **Environment Variables:**
   ```
   MONGO_URI=mongodb+srv://... (from Atlas)
   NODE_ENV=production
   ```
4. **Deploy** → View logs

## Expected Logs
```
Booting Brindra backend...
MongoDB URI configured (length: 123)
✅ MongoDB connected successfully
✅ Backend running on port 10000 | Environment: production
```

## Test
- Health: `https://your-app.onrender.com/`
- API: `/api/health`

## Troubleshooting
- **Exit 1:** Check logs for "MONGO_URI missing!" → Add env var
- **CORS:** Update Backend/app.js allowed domains
- Local test: `cd Backend && npm start` (set .env MONGO_URI)

