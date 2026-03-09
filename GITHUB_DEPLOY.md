# 🚀 Deploy Both Frontend & Backend on GitHub

## One-Time Setup (5 minutes)

### 1. Deploy Backend on Railway
1. Go to https://railway.app
2. Sign in with GitHub
3. Click **New Project** → **Deploy from GitHub repo**
4. Select: `FocusTube-AI-Powered-YouTube-Focus-Preference-Engine`
5. Click **+ New** → **PostgreSQL**
6. Click your service → **Variables** → Add:
```
YOUTUBE_API_KEY=REDACTED_YOUTUBE_API_KEY
GEMINI_API_KEY=AIzaSyBSEF5__TRSPJI3bftW1-MmN-c2s0Wom0A
GOOGLE_CLIENT_ID=REDACTED_GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET=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
JWT_SECRET_KEY=youtube-focus-engine-super-secret-key-2024
FRONTEND_URL=https://koushikbethu.github.io/FocusTube-AI-Powered-YouTube-Focus-Preference-Engine
DEBUG=false
```
7. Copy your Railway URL (e.g., `https://focustube-production.up.railway.app`)

### 2. Get Railway Token (for auto-deploy)
1. In Railway, click your profile → **Account Settings**
2. Click **Tokens** → **Create Token**
3. Copy the token

### 3. Add GitHub Secrets
1. Go to: https://github.com/koushikbethu/FocusTube-AI-Powered-YouTube-Focus-Preference-Engine/settings/secrets/actions
2. Click **New repository secret**
3. Add:
   - Name: `RAILWAY_TOKEN`
   - Value: (paste your Railway token)
4. Add another:
   - Name: `RAILWAY_PROJECT_ID`
   - Value: (from Railway project settings)

### 4. Update Frontend API URL
Edit `frontend/.env.production`:
```
VITE_API_URL=https://your-backend.railway.app
```

### 5. Enable GitHub Pages
1. Go to: https://github.com/koushikbethu/FocusTube-AI-Powered-YouTube-Focus-Preference-Engine/settings/pages
2. Source: **Deploy from a branch**
3. Branch: **gh-pages**
4. Save

### 6. Update Google OAuth
1. Go to: https://console.cloud.google.com/apis/credentials
2. Edit OAuth Client
3. Add: `https://your-backend.railway.app/api/auth/callback`

## Deploy

```bash
git add .
git commit -m "Deploy both frontend and backend"
git push origin main
```

**GitHub Actions will automatically deploy both!**

## Your URLs
- **Frontend**: https://koushikbethu.github.io/FocusTube-AI-Powered-YouTube-Focus-Preference-Engine
- **Backend**: https://your-backend.railway.app
- **API Docs**: https://your-backend.railway.app/docs

## Auto-Deploy
Every push to `main` branch will:
1. ✅ Deploy backend to Railway
2. ✅ Deploy frontend to GitHub Pages

## Cost: $0/month
