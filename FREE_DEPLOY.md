# 🆓 Free Backend Deployment Alternatives

Railway limit reached? Use these FREE alternatives:

## Option 1: Render.com (Recommended)

### Setup (3 minutes):
1. Go to https://render.com
2. Sign in with GitHub
3. Click **New +** → **Web Service**
4. Connect: `FocusTube-AI-Powered-YouTube-Focus-Preference-Engine`
5. Settings:
   - **Name**: focustube-backend
   - **Root Directory**: `backend`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
6. Add **Environment Variables**:
```
YOUTUBE_API_KEY=REDACTED_YOUTUBE_API_KEY
GEMINI_API_KEY=AIzaSyBSEF5__TRSPJI3bftW1-MmN-c2s0Wom0A
GOOGLE_CLIENT_ID=REDACTED_GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET=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
JWT_SECRET_KEY=youtube-focus-engine-super-secret-key-2024
FRONTEND_URL=https://koushikbethu.github.io/FocusTube-AI-Powered-YouTube-Focus-Preference-Engine
DEBUG=false
DATABASE_URL=sqlite+aiosqlite:///./youtube_focus.db
```
7. Click **Create Web Service**

**Free tier**: 750 hours/month

---

## Option 2: Fly.io

### Setup:
```bash
# Install Fly CLI
powershell -Command "iwr https://fly.io/install.ps1 -useb | iex"

# Login
fly auth login

# Deploy
cd backend
fly launch --name focustube-backend
fly secrets set YOUTUBE_API_KEY=REDACTED_YOUTUBE_API_KEY
fly secrets set GEMINI_API_KEY=AIzaSyBSEF5__TRSPJI3bftW1-MmN-c2s0Wom0A
fly deploy
```

**Free tier**: 3 shared-cpu VMs

---

## Option 3: Koyeb

1. Go to https://koyeb.com
2. Deploy from GitHub
3. Add environment variables
4. Deploy

**Free tier**: 1 web service

---

## Option 4: PythonAnywhere (Easiest)

1. Go to https://www.pythonanywhere.com
2. Create free account
3. Upload code via Git
4. Configure web app
5. Add environment variables

**Free tier**: 1 web app

---

## Recommended: Render.com

**Why?**
- ✅ Easy setup (3 minutes)
- ✅ Auto-deploy from GitHub
- ✅ 750 hours/month free
- ✅ Built-in HTTPS
- ✅ No credit card required

---

## After Backend Deployment

1. **Update frontend/.env.production**:
```
VITE_API_URL=https://your-backend.onrender.com
```

2. **Update Google OAuth**:
   - Add: `https://your-backend.onrender.com/api/auth/callback`

3. **Push to GitHub**:
```bash
git add .
git commit -m "Update backend URL"
git push origin main
```

Frontend will auto-deploy to GitHub Pages!

---

## Your URLs
- **Frontend**: https://koushikbethu.github.io/FocusTube-AI-Powered-YouTube-Focus-Preference-Engine
- **Backend**: https://focustube-backend.onrender.com
- **API Docs**: https://focustube-backend.onrender.com/docs
