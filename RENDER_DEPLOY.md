# Deploy to Render

## In Render Dashboard:

### Environment Variables (Add these):
```
DATABASE_URL=sqlite+aiosqlite:///./youtube_focus.db
YOUTUBE_API_KEY=<your-key-from-backend/.env>
GEMINI_API_KEY=<your-key-from-backend/.env>
GOOGLE_CLIENT_ID=<your-id-from-backend/.env>
GOOGLE_CLIENT_SECRET=<your-secret-from-backend/.env>
JWT_SECRET_KEY=youtube-focus-engine-super-secret-key-2024
JWT_ALGORITHM=HS256
JWT_EXPIRE_MINUTES=10080
FRONTEND_URL=https://koushikbethu.github.io/FocusTube-AI-Powered-YouTube-Focus-Preference-Engine
DEBUG=false
```

Copy values from your `backend/.env` file.

## After Deploy:
1. Copy your Render URL
2. Update `frontend/.env.production` with that URL
3. Update Google OAuth redirect URI
4. Push to GitHub
