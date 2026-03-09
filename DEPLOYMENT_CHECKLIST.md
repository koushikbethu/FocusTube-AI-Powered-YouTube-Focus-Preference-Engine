# ✅ Deployment Checklist

## Pre-Deployment (Completed ✅)
- [x] YouTube API key updated (110,000 units/day quota)
- [x] All API keys configured in backend/.env
- [x] Deployment configuration files created
- [x] .gitignore updated

## Step 1: Push to GitHub

```bash
# Check current status
git status

# Add all files
git add .

# Commit changes
git commit -m "Ready for production deployment"

# Push to GitHub
git push origin main
```

## Step 2: Deploy Backend on Railway

1. Go to https://railway.app
2. Sign in with GitHub
3. Click "New Project"
4. Select "Deploy from GitHub repo"
5. Choose: `koushikbethu/FocusTube-AI-Powered-YouTube-Focus-Preference-Engine`
6. Railway will auto-detect and deploy

### Add PostgreSQL Database

1. In Railway project, click "+ New"
2. Select "Database" → "PostgreSQL"
3. Wait for provisioning (1-2 minutes)
4. `DATABASE_URL` is automatically added to your service

### Configure Environment Variables

Click on your service → "Variables" tab → Add:

```
YOUTUBE_API_KEY=REDACTED_YOUTUBE_API_KEY
GEMINI_API_KEY=AIzaSyBSEF5__TRSPJI3bftW1-MmN-c2s0Wom0A
GOOGLE_CLIENT_ID=REDACTED_GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET=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
JWT_SECRET_KEY=youtube-focus-engine-super-secret-key-2024
JWT_ALGORITHM=HS256
JWT_EXPIRE_MINUTES=10080
FRONTEND_URL=https://focustube.vercel.app
DEBUG=false
```

Note: Update `FRONTEND_URL` after deploying frontend (Step 3)

### Get Your Backend URL

- Click "Settings" → Copy the domain (e.g., `focustube-production.up.railway.app`)
- Your backend URL: `https://focustube-production.up.railway.app`

## Step 3: Update Google OAuth

1. Go to https://console.cloud.google.com
2. Navigate to: APIs & Services → Credentials
3. Click on your OAuth 2.0 Client ID
4. Under "Authorized redirect URIs", add:
   ```
   https://your-backend-url.railway.app/api/auth/callback
   ```
5. Click "Save"

## Step 4: Deploy Frontend on Vercel

1. Go to https://vercel.com
2. Sign in with GitHub
3. Click "New Project"
4. Import: `koushikbethu/FocusTube-AI-Powered-YouTube-Focus-Preference-Engine`
5. Configure:
   - Framework Preset: Vite
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`

### Add Environment Variable

In Vercel project settings → Environment Variables:

```
VITE_API_URL=https://your-backend-url.railway.app
```

Replace with your actual Railway backend URL from Step 2.

6. Click "Deploy"

### Get Your Frontend URL

- After deployment, copy the URL (e.g., `focustube.vercel.app`)

## Step 5: Update Backend CORS

1. Go back to Railway
2. Update `FRONTEND_URL` variable with your Vercel URL:
   ```
   FRONTEND_URL=https://focustube.vercel.app
   ```
3. Railway will auto-redeploy

## Step 6: Test Your Deployment

1. Visit your Vercel URL
2. Test the following:
   - [ ] Homepage loads
   - [ ] Google OAuth login works
   - [ ] Video feed displays
   - [ ] Focus modes work
   - [ ] Video filtering works
   - [ ] Analytics page loads

## Step 7: Monitor API Quota

- Check usage: https://console.cloud.google.com/apis/api/youtube.googleapis.com/quotas
- Your limit: 110,000 units/day
- Resets daily at midnight Pacific Time

## 🎉 Deployment Complete!

Your app is now live:
- Frontend: https://focustube.vercel.app
- Backend: https://your-backend-url.railway.app
- API Docs: https://your-backend-url.railway.app/docs

---

## Troubleshooting

### Backend won't start
- Check Railway logs: Click service → "Deployments" → View logs
- Verify all environment variables are set
- Check DATABASE_URL is present

### Frontend shows connection error
- Verify VITE_API_URL is correct
- Check backend is running (visit /health endpoint)
- Check browser console for CORS errors

### OAuth not working
- Verify redirect URI in Google Console matches exactly
- Check GOOGLE_CLIENT_ID and SECRET are correct
- Ensure using HTTPS (not HTTP)

### Database errors
- Railway PostgreSQL should auto-connect
- Check DATABASE_URL format: `postgresql+asyncpg://...`
- View database logs in Railway

---

## Alternative: Deploy on Render

If Railway doesn't work, use Render:

1. Go to https://render.com
2. Click "New +" → "Web Service"
3. Connect GitHub repository
4. Use `render.yaml` configuration (already created)
5. Add environment variables
6. Deploy

---

## Need Help?

- Railway Discord: https://discord.gg/railway
- Vercel Support: https://vercel.com/support
- GitHub Issues: https://github.com/koushikbethu/FocusTube/issues
