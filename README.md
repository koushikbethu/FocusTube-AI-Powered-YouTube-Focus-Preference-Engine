# 🎯 FocusTube - AI-Powered YouTube Focus Engine

[![Deploy Status](https://img.shields.io/badge/Deploy-GitHub%20Pages-success)](https://koushikbethu.github.io/FocusTube/)
[![Backend](https://img.shields.io/badge/Backend-Render-blue)](https://focustube-backend.onrender.com)
[![React](https://img.shields.io/badge/Frontend-React%2018-61dafb)](https://reactjs.org/)
[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688)](https://fastapi.tiangolo.com/)
[![AI](https://img.shields.io/badge/AI-Gemini%20API-purple)](https://ai.google.dev/)

A production-grade content-control and AI-based filtering system that helps you consume YouTube in a focused, distraction-free, goal-oriented way.

## 🌟 Live Demo

- **Frontend**: [https://yourusername.github.io/focustube](https://yourusername.github.io/focustube)
- **Backend API**: [https://focustube-backend.onrender.com](https://focustube-backend.onrender.com)
- **API Docs**: [https://focustube-backend.onrender.com/docs](https://focustube-backend.onrender.com/docs)

## ✨ Features

### 🎯 Focus Modes
- **Study Mode** - Only educational content, block distractions
- **Deep Work** - Maximum focus with strict filtering and time limits
- **Music Mode** - Background music only
- **Relax Mode** - Controlled leisure with time limits

### 🤖 AI Classification
- Automatic video categorization using Google Gemini
- Clickbait detection with confidence scores
- Entertainment vs. Educational scoring
- Content depth analysis

### 🚫 Hard Filtering
- Block YouTube Shorts
- Block trending/viral content
- Minimum video duration requirements
- Keyword-based blocking
- Category allow/block lists

### 📊 Session Management
- Lock focus sessions (no mode switching for X minutes)
- Daily time limits per mode
- Watch history tracking
- Analytics dashboard

## 🏗️ Architecture

```
focustube/
├── backend/                    # FastAPI Python backend
│   ├── app/
│   │   ├── main.py            # FastAPI entry point
│   │   ├── config.py          # Configuration
│   │   ├── database.py        # PostgreSQL connection
│   │   ├── models/            # SQLAlchemy models
│   │   ├── schemas/           # Pydantic schemas
│   │   ├── routers/           # API routes
│   │   └── services/          # Business logic
│   │       ├── youtube_service.py    # YouTube API
│   │       ├── ai_classifier.py      # Gemini AI
│   │       ├── filter_engine.py      # Hard filtering
│   │       ├── focus_engine.py       # Mode management
│   │       └── personalization.py    # Learning loop
│   └── requirements.txt
├── frontend/                   # React TypeScript frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── Layout/        # App layout
│   │   │   ├── FocusMode/     # Mode selector
│   │   │   ├── Feed/          # Video cards
│   │   │   └── VideoPlayer/   # Player modal
│   │   ├── pages/
│   │   │   ├── Home.tsx       # Main feed
│   │   │   ├── Login.tsx      # Google OAuth
│   │   │   ├── Settings.tsx   # Mode config
│   │   │   └── Analytics.tsx  # Usage stats
│   │   ├── hooks/             # React hooks
│   │   ├── services/          # API client
│   │   └── types/             # TypeScript types
│   └── package.json
└── .github/workflows/         # GitHub Actions
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Python 3.10+
- PostgreSQL 14+ (for production)
- Google Cloud Project with:
  - OAuth 2.0 credentials
  - YouTube Data API v3 enabled
  - Gemini API key

### Local Development

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/focustube.git
   cd focustube
   ```

2. **Backend Setup**:
   ```bash
   cd backend
   python -m venv venv
   venv\Scripts\activate  # Windows
   # source venv/bin/activate  # Linux/Mac
   
   pip install -r requirements.txt
   
   # Configure environment
   cp .env.example .env
   # Edit .env with your API keys
   
   # Run server
   uvicorn app.main:app --reload
   ```

3. **Frontend Setup**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

### Environment Variables

Copy `backend/.env.example` to `backend/.env` and fill in:

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `GOOGLE_CLIENT_ID` | OAuth 2.0 client ID |
| `GOOGLE_CLIENT_SECRET` | OAuth 2.0 client secret |
| `YOUTUBE_API_KEY` | YouTube Data API v3 key |
| `GEMINI_API_KEY` | Google Gemini API key |
| `JWT_SECRET_KEY` | Random secret for JWT tokens |

## 🌐 Deployment

### Automatic Deployment
This project is configured for automatic deployment:
- **Frontend**: GitHub Pages (via GitHub Actions)
- **Backend**: Render (via git push)

### Deploy Steps
1. **Push to GitHub**:
   ```bash
   .\push-to-github.ps1
   ```

2. **Enable GitHub Pages**:
   - Go to repository Settings > Pages
   - Set Source to "GitHub Actions"

3. **Configure Backend**:
   - Create account on [Render](https://render.com)
   - Connect your GitHub repository
   - Set environment variables in Render dashboard

## 📚 API Documentation

After starting the backend, visit:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

### Key Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/google` | GET | Start OAuth flow |
| `/api/modes` | GET/POST | List/Create focus modes |
| `/api/modes/{id}/activate` | POST | Activate a mode |
| `/api/feed` | GET | Get filtered feed |
| `/api/feed/search` | GET | Search with filters |
| `/api/analytics/*` | GET/POST | Usage analytics |

## 🧠 AI Classification

Videos are classified into categories:

| Category | Description |
|----------|-------------|
| EDUCATION | Courses, tutorials, lectures |
| SCIENCE_TECH | Technology, science content |
| MUSIC | Songs, concerts, playlists |
| GAMING | Game streams, reviews |
| ENTERTAINMENT | Vlogs, comedy, general entertainment |
| NEWS_POLITICS | Current events, news |
| HOWTO_STYLE | How-to guides, lifestyle |

Each video receives AI-generated scores:
- **Confidence** (0-1): Classification confidence
- **Entertainment** (0-1): Entertainment vs educational
- **Depth** (0-1): Content depth/information density
- **Clickbait** (0-1): Clickbait probability

## 🔧 Recent Fixes

- ✅ Backend deployment configuration
- ✅ Thumbnail loading with fallbacks
- ✅ Mode-based video filtering
- ✅ Persistent login (no auto-logout)
- ✅ Video player embed improvements
- ✅ Auto-block opposite categories in settings
- ✅ Login page UI improvements
- ✅ Fresh content on refresh
- ✅ GitHub Pages deployment setup

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for build tooling
- **CSS3** with custom properties
- **Lucide React** for icons

### Backend
- **FastAPI** with Python 3.10+
- **SQLAlchemy** ORM with PostgreSQL
- **Google Gemini AI** for content classification
- **YouTube Data API v3** for video data
- **Google OAuth 2.0** for authentication

### Deployment
- **GitHub Pages** for frontend hosting
- **Render** for backend hosting
- **GitHub Actions** for CI/CD

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

MIT License - See [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/focustube/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/focustube/discussions)
- **Documentation**: [GitHub Pages Setup](GITHUB_PAGES.md)

---

<div align="center">
  <strong>Built with ❤️ for focused learning and productivity</strong>
</div>
