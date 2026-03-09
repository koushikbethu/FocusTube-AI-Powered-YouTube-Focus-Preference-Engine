# 🚀 Quick Start - Deploy in 10 Minutes

## Your Setup Status

✅ YouTube API Key: Configured (110,000 units/day)
✅ Gemini AI Key: Configured
✅ Google OAuth: Configured
✅ Deployment Files: Created

## Deploy Now (3 Simple Steps)

### 1️⃣ Push to GitHub (1 minute)

```bash
git add .
git commit -m "Production ready"
git push origin main
```

### 2️⃣ Deploy Backend on Railway (3 minutes)

1. Visit: https://railway.app
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Click "+ New" → "PostgreSQL" (adds database)
5. Click your service → "Variables" → Paste this:

```
YOUTUBE_API_KEY=REDACTED_YOUTUBE_API_KEY
GEMINI_API_KEY=AIzaSyBSEF5__TRSPJI3bftW1-MmN-c2s0Wom0A
GOOGLE_CLIENT_ID=REDACTED_GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET=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
JWT_SECRET_KEY=youtube-focus-engine-super-secret-key-2024
FRONTEND_URL=https://focustube.vercel.app
DEBUG=false
```

6. Copy your Railway URL (e.g., `https://xxx.railway.app`)

### 3️⃣ Deploy Frontend on Vercel (3 minutes)

1. Visit: https://vercel.com
2. Click "New Project" → Import your GitHub repo
3. Settings:
   - Root Directory: `frontend`
   - Framework: Vite
4. Environment Variables → Add:
   ```
   VITE_API_URL=https://your-railway-url.railway.app
   ```
5. Click "Deploy"

### 4️⃣ Update OAuth (2 minutes)

1. Visit: https://console.cloud.google.com/apis/credentials
2. Edit your OAuth Client
3. Add redirect URI: `https://your-railway-url.railway.app/api/auth/callback`
4. Save

### 5️⃣ Update CORS (1 minute)

1. Go back to Railway
2. Update `FRONTEND_URL` with your Vercel URL
3. Done! 🎉

---

## Test Your App

Visit your Vercel URL and test:
- ✅ Login with Google
- ✅ Browse video feed
- ✅ Switch focus modes
- ✅ Filter videos

---

## URLs to Save

- **Frontend**: https://your-app.vercel.app
- **Backend**: https://your-app.railway.app
- **API Docs**: https://your-app.railway.app/docs
- **Quota Monitor**: https://console.cloud.google.com/apis/api/youtube.googleapis.com/quotas

---

## Need More Details?

- Full Guide: `DEPLOYMENT.md`
- Checklist: `DEPLOYMENT_CHECKLIST.md`
- Troubleshooting: See DEPLOYMENT.md

---

## Cost

- Railway: Free tier (500 hours/month)
- Vercel: Free tier (unlimited)
- PostgreSQL: Free on Railway
- **Total: $0/month** 🎉

---

**Ready? Start with Step 1! 🚀**
