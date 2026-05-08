# Push All Changes to GitHub
Write-Host "Pushing FocusTube to GitHub..." -ForegroundColor Green

# Check if we're in a git repository
if (-not (Test-Path ".git")) {
    Write-Host "Not a git repository. Initializing..." -ForegroundColor Red
    git init
    Write-Host "Git repository initialized" -ForegroundColor Green
}

# Get GitHub username and repo name
$githubUser = Read-Host "Enter your GitHub username"
$repoName = Read-Host "Enter repository name (e.g., focustube)"

if ([string]::IsNullOrEmpty($githubUser) -or [string]::IsNullOrEmpty($repoName)) {
    Write-Host "GitHub username and repository name are required" -ForegroundColor Red
    exit 1
}

# Update render.yaml with correct GitHub Pages URL
Write-Host "Updating configuration files..." -ForegroundColor Yellow
$renderConfig = Get-Content "render.yaml" -Raw
$renderConfig = $renderConfig -replace "yourusername", $githubUser
$renderConfig = $renderConfig -replace "focustube", $repoName
Set-Content "render.yaml" $renderConfig

# Update vite.config.ts base path
$viteConfig = Get-Content "frontend/vite.config.ts" -Raw
$viteConfig = $viteConfig -replace "/FocusTube/", "/$repoName/"
Set-Content "frontend/vite.config.ts" $viteConfig

Write-Host "Configuration files updated" -ForegroundColor Green

# Add remote origin if it doesn't exist
$remoteUrl = "https://github.com/$githubUser/$repoName.git"
try {
    $existingRemote = git remote get-url origin 2>$null
    Write-Host "Remote already exists: $existingRemote" -ForegroundColor Cyan
} catch {
    Write-Host "Adding GitHub remote..." -ForegroundColor Yellow
    git remote add origin $remoteUrl
    Write-Host "Remote added: $remoteUrl" -ForegroundColor Green
}

# Stage all files
Write-Host "Staging all files..." -ForegroundColor Yellow
git add .

# Check if there are changes to commit
$status = git status --porcelain
if ([string]::IsNullOrEmpty($status)) {
    Write-Host "No changes to commit" -ForegroundColor Cyan
} else {
    # Commit changes
    Write-Host "Committing changes..." -ForegroundColor Yellow
    git commit -m "Complete FocusTube application with all fixes

Features:
- AI-powered YouTube content filtering
- Focus modes (Study, Deep Work, Music, Relax)
- Real-time video classification with Gemini AI
- Session management and analytics
- Responsive React frontend
- FastAPI Python backend

Fixes Applied:
- Backend deployment configuration for Render
- Thumbnail loading with proper fallbacks
- Mode-based video filtering system
- Persistent login (no auto-logout on network errors)
- Video player embed improvements
- Auto-block opposite categories in settings
- Login page UI improvements
- Fresh content on refresh
- GitHub Pages deployment setup

Architecture:
- Frontend: React 18 + TypeScript + Vite
- Backend: FastAPI + SQLAlchemy + PostgreSQL
- AI: Google Gemini API for content classification
- Deployment: GitHub Pages + Render
- Authentication: Google OAuth 2.0"

    Write-Host "Changes committed" -ForegroundColor Green
}

# Push to GitHub
Write-Host "Pushing to GitHub..." -ForegroundColor Yellow
git branch -M main
git push -u origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host "Successfully pushed to GitHub!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next Steps:" -ForegroundColor Yellow
    Write-Host "1. Go to: https://github.com/$githubUser/$repoName" -ForegroundColor Cyan
    Write-Host "2. Navigate to Settings > Pages" -ForegroundColor Cyan
    Write-Host "3. Set Source to GitHub Actions" -ForegroundColor Cyan
    Write-Host "4. Wait for deployment to complete" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Your URLs will be:" -ForegroundColor Yellow
    Write-Host "   Frontend: https://$githubUser.github.io/$repoName/" -ForegroundColor Green
    Write-Host "   Backend:  https://focustube-backend.onrender.com/" -ForegroundColor Green
    Write-Host ""
    Write-Host "Documentation:" -ForegroundColor Yellow
    Write-Host "   Setup: GITHUB_PAGES.md" -ForegroundColor Cyan
    Write-Host "   API:   README.md" -ForegroundColor Cyan
} else {
    Write-Host "Failed to push to GitHub" -ForegroundColor Red
    Write-Host "Make sure the repository exists at: https://github.com/$githubUser/$repoName" -ForegroundColor Yellow
    Write-Host "Create it first, then run this script again." -ForegroundColor Yellow
}