# 🚀 Deploy on GitHub (Free)

## Quick Setup (5 Steps)

### 1. Push to GitHub
```bash
git add .
git commit -m "Deploy to GitHub"
git push origin main
```

### 2. Enable GitHub Pages
1. Go to: https://github.com/koushikbethu/FocusTube-AI-Powered-YouTube-Focus-Preference-Engine/settings/pages
2. Source: **Deploy from a branch**
3. Branch: **gh-pages** / **(root)**
4. Click **Save**

### 3. Deploy Backend on Railway (Free)
1. Go to: https://railway.app
2. Click **New Project** → **Deploy from GitHub repo**
3. Select your repository
4. Click **+ New** → **PostgreSQL**
5. Add environment variables:
```
YOUTUBE_API_KEY=REDACTED_YOUTUBE_API_KEY
GEMINI_API_KEY=AIzaSyBSEF5__TRSPJI3bftW1-MmN-c2s0Wom0A
GOOGLE_CLIENT_ID=REDACTED_GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET=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
JWT_SECRET_KEY=youtube-focus-engine-super-secret-key-2024
FRONTEND_URL=https://koushikbethu.github.io/FocusTube-AI-Powered-YouTube-Focus-Preference-Engine
DEBUG=false
```

### 4. Update Frontend API URL
Edit `frontend/.env.production`:
```
VITE_API_URL=https://your-backend.railway.app
```

Push changes:
```bash
git add frontend/.env.production
git commit -m "Update API URL"
git push origin main
```

### 5. Update Google OAuth
1. Go to: https://console.cloud.google.com/apis/credentials
2. Edit OAuth Client
3. Add redirect URI:
```
https://your-backend.railway.app/api/auth/callback
```

## Your URLs

- **Frontend**: https://koushikbethu.github.io/FocusTube-AI-Powered-YouTube-Focus-Preference-Engine
- **Backend**: https://your-backend.railway.app
- **API Docs**: https://your-backend.railway.app/docs

## Auto-Deploy

GitHub Actions will automatically deploy frontend on every push to `main` branch.

## Cost: $0/month ✅
