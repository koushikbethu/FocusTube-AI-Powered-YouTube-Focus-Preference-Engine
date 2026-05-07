# Play Store Deployment Guide

## Overview
This guide explains how to deploy FocusTube to Google Play Store as a Progressive Web App (PWA) or using a WebView wrapper.

## Option 1: PWA with Trusted Web Activity (Recommended)

### Prerequisites
- Android Studio installed
- Google Play Console account ($25 one-time fee)
- Domain name for hosting the web app

### Steps

1. **Deploy Backend**
   - Deploy FastAPI backend to a cloud provider (AWS, Google Cloud, Heroku, Railway, etc.)
   - Update Google OAuth redirect URI in Google Cloud Console
   - Set environment variables on your hosting platform

2. **Deploy Frontend**
   - Build the frontend: `npm run build`
   - Deploy to hosting (Vercel, Netlify, Firebase Hosting, etc.)
   - Update `.env.production` with your backend URL

3. **Update Google OAuth**
   - Go to Google Cloud Console
   - Update OAuth redirect URI to: `https://your-domain.com/auth/callback`
   - Add your production domain to authorized origins

4. **Create Android App with TWA**
   ```bash
   npx @bubblewrap/cli init --manifest https://your-domain.com/manifest.json
   npx @bubblewrap/cli build
   ```

5. **Sign the APK**
   - Generate keystore
   - Sign the APK/AAB file
   - Upload to Google Play Console

## Option 2: React Native WebView

### Steps

1. **Create React Native App**
   ```bash
   npx react-native init FocusTube
   ```

2. **Install WebView**
   ```bash
   npm install react-native-webview
   ```

3. **Configure WebView**
   ```javascript
   import { WebView } from 'react-native-webview';
   
   export default function App() {
     return (
       <WebView 
         source={{ uri: 'https://your-domain.com' }}
         style={{ flex: 1 }}
       />
     );
   }
   ```

4. **Build and Deploy**
   ```bash
   cd android
   ./gradlew assembleRelease
   ```

## Option 3: Capacitor (Easiest)

### Steps

1. **Install Capacitor**
   ```bash
   cd frontend
   npm install @capacitor/core @capacitor/cli
   npm install @capacitor/android
   npx cap init
   ```

2. **Build Web App**
   ```bash
   npm run build
   ```

3. **Add Android Platform**
   ```bash
   npx cap add android
   npx cap sync
   ```

4. **Open in Android Studio**
   ```bash
   npx cap open android
   ```

5. **Build APK/AAB**
   - Build > Generate Signed Bundle/APK
   - Upload to Play Console

## Backend Deployment Options

### 1. Railway (Easiest)
- Connect GitHub repo
- Auto-deploys on push
- Free tier available

### 2. Google Cloud Run
- Containerized deployment
- Pay per use
- Good for FastAPI

### 3. AWS EC2
- Full control
- Requires more setup
- Cost-effective for production

### 4. Heroku
- Simple deployment
- Good for MVP
- Free tier removed

## Frontend Deployment Options

### 1. Vercel (Recommended)
- Free tier
- Auto-deploy from GitHub
- Great for React/Vite

### 2. Netlify
- Free tier
- Easy setup
- Good CDN

### 3. Firebase Hosting
- Free tier
- Google integration
- Fast CDN

## Important Notes

1. **Google OAuth**: You MUST have a public domain for OAuth to work. Localhost won't work in production.

2. **HTTPS Required**: Both frontend and backend must use HTTPS in production.

3. **CORS**: Update CORS settings in backend to only allow your production domain.

4. **API Keys**: Never commit API keys to GitHub. Use environment variables.

5. **Database**: Switch from SQLite to PostgreSQL for production.

## Local Development (Without ngrok)

1. Start backend:
   ```bash
   cd backend
   uvicorn app.main:app --reload
   ```

2. Start frontend:
   ```bash
   cd frontend
   npm run dev
   ```

3. Access at: http://localhost:5173

Note: Google OAuth won't work on localhost. You'll need to deploy to test authentication.

## Quick Deploy Commands

### Backend (Railway)
```bash
cd backend
railway login
railway init
railway up
```

### Frontend (Vercel)
```bash
cd frontend
npm install -g vercel
vercel login
vercel --prod
```

## Cost Estimate

- Google Play Console: $25 (one-time)
- Domain: $10-15/year
- Backend Hosting: $0-20/month (Railway/Cloud Run free tier)
- Frontend Hosting: $0 (Vercel/Netlify free tier)

Total: ~$25-50 first year, ~$10-250/year after
