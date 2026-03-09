# 🚀 FocusTube Deployment Guide

Your YouTube API quota has been approved! **110,000 units/day** for 6 months.

## ✅ API Key Already Updated
Your YouTube API key is already configured in `backend/.env`:
```
YOUTUBE_API_KEY=REDACTED_YOUTUBE_API_KEY
```

---

## 🌐 Deployment Options

### Option 1: Railway (Recommended - Easiest)

**Why Railway?**
- Free tier available
- Automatic deployments from GitHub
- Built-in PostgreSQL database
- Zero configuration needed

**Steps:**

1. **Push to GitHub** (if not already done):
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

2. **Deploy Backend:**
   - Go to [railway.app](https://railway.app)
   - Click "Start a New Project"
   - Select "Deploy from GitHub repo"
   - Choose your `FocusTube` repository
   - Railway will auto-detect Python and deploy

3. **Add PostgreSQL Database:**
   - In Railway dashboard, click "+ New"
   - Select "Database" → "PostgreSQL"
   - Railway will auto-create `DATABASE_URL` variable

4. **Set Environment Variables:**
   - Click on your backend service
   - Go to "Variables" tab
   - Add these variables:
   ```
   YOUTUBE_API_KEY=REDACTED_YOUTUBE_API_KEY
   GEMINI_API_KEY=AIzaSyBSEF5__TRSPJI3bftW1-MmN-c2s0Wom0A
   GOOGLE_CLIENT_ID=REDACTED_GOOGLE_CLIENT_ID
   GOOGLE_CLIENT_SECRET=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
   JWT_SECRET_KEY=youtube-focus-engine-super-secret-key-2024
   FRONTEND_URL=https://your-frontend-url.vercel.app
   DEBUG=false
   ```
   - `DATABASE_URL` is auto-created by Railway

5. **Update Google OAuth Redirect URI:**
   - Get your Railway backend URL (e.g., `https://focustube-backend.railway.app`)
   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - Navigate to APIs & Services → Credentials
   - Edit your OAuth 2.0 Client
   - Add authorized redirect URI: `https://your-backend-url.railway.app/api/auth/callback`

6. **Deploy Frontend:**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Set Root Directory: `frontend`
   - Add Environment Variable:
     ```
     VITE_API_URL=https://your-backend-url.railway.app
     ```
   - Click "Deploy"

7. **Update CORS:**
   - Update `FRONTEND_URL` in Railway with your Vercel URL
   - Redeploy backend

---

### Option 2: Render

**Steps:**

1. **Deploy Backend:**
   - Go to [render.com](https://render.com)
   - Click "New +" → "Web Service"
   - Connect GitHub repository
   - Settings:
     - Name: `focustube-backend`
     - Root Directory: `backend`
     - Build Command: `pip install -r requirements.txt`
     - Start Command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
   - Add environment variables (same as Railway)

2. **Add PostgreSQL:**
   - Click "New +" → "PostgreSQL"
   - Copy the Internal Database URL
   - Add as `DATABASE_URL` in backend service

3. **Deploy Frontend:**
   - Use Vercel (same as Option 1)

---

### Option 3: AWS (Production-Grade)

**For advanced users who need scalability:**

1. **Backend on AWS Elastic Beanstalk:**
   - Create `Procfile` in backend folder
   - Deploy using EB CLI
   - Use RDS for PostgreSQL

2. **Frontend on AWS Amplify:**
   - Connect GitHub repository
   - Auto-deploy on push

3. **Use AWS Secrets Manager** for API keys

---

## 📝 Pre-Deployment Checklist

- [x] YouTube API key updated (110,000 quota/day)
- [ ] Push code to GitHub
- [ ] Choose deployment platform
- [ ] Set up PostgreSQL database
- [ ] Configure environment variables
- [ ] Update Google OAuth redirect URIs
- [ ] Update CORS settings
- [ ] Test authentication flow
- [ ] Test video filtering

---

## 🔧 Required Files for Deployment

I'll create these files for you:

1. `railway.json` - Railway configuration
2. `render.yaml` - Render configuration
3. `Procfile` - Process configuration
4. `runtime.txt` - Python version
5. Frontend environment configuration

---

## 🌍 Update Frontend API URL

After backend deployment, update frontend to use production API:

**Create `frontend/.env.production`:**
```
VITE_API_URL=https://your-backend-url.railway.app
```

---

## 🔐 Security Notes

1. **Never commit `.env` files** - Already in `.gitignore` ✅
2. **Use environment variables** on deployment platforms
3. **Enable HTTPS** - Automatic on Railway/Vercel/Render
4. **Rotate JWT secret** in production
5. **Set `DEBUG=false`** in production

---

## 📊 Monitor Your Quota

Your YouTube API quota: **110,000 units/day**

Typical costs:
- Search: 100 units
- Video details: 1 unit
- Channel info: 1 unit

With 110K quota, you can handle:
- ~1,100 searches/day
- Or ~110,000 video detail requests/day
- Or a mix of both

Monitor usage at: [Google Cloud Console](https://console.cloud.google.com/apis/api/youtube.googleapis.com/quotas)

---

## 🆘 Troubleshooting

**Backend won't start:**
- Check environment variables are set
- Verify DATABASE_URL is correct
- Check logs for errors

**Frontend can't connect:**
- Verify VITE_API_URL is correct
- Check CORS settings in backend
- Ensure backend is running

**OAuth not working:**
- Verify redirect URI in Google Console
- Check GOOGLE_CLIENT_ID and SECRET
- Ensure HTTPS is enabled

---

## 📞 Need Help?

- Railway Docs: https://docs.railway.app
- Render Docs: https://render.com/docs
- Vercel Docs: https://vercel.com/docs

---

**Ready to deploy? Start with Railway - it's the easiest! 🚀**
