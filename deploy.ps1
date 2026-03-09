# 🚀 Quick Deployment Script

Write-Host "==================================" -ForegroundColor Cyan
Write-Host "FocusTube Deployment Setup" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

# Check if git is initialized
if (-not (Test-Path ".git")) {
    Write-Host "❌ Git not initialized. Initializing..." -ForegroundColor Yellow
    git init
    Write-Host "✅ Git initialized" -ForegroundColor Green
}

# Check if remote exists
$remote = git remote -v 2>$null
if (-not $remote) {
    Write-Host "❌ No GitHub remote found" -ForegroundColor Red
    Write-Host "Please add your GitHub repository:" -ForegroundColor Yellow
    Write-Host "git remote add origin https://github.com/koushikbethu/FocusTube-AI-Powered-YouTube-Focus-Preference-Engine.git" -ForegroundColor Yellow
    exit
}

Write-Host "✅ GitHub remote configured" -ForegroundColor Green
Write-Host ""

# Check for uncommitted changes
$status = git status --porcelain
if ($status) {
    Write-Host "📝 Uncommitted changes found. Committing..." -ForegroundColor Yellow
    git add .
    git commit -m "Prepare for deployment with updated API keys"
    Write-Host "✅ Changes committed" -ForegroundColor Green
}

Write-Host ""
Write-Host "==================================" -ForegroundColor Cyan
Write-Host "Ready to Deploy!" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Push to GitHub:" -ForegroundColor White
Write-Host "   git push origin main" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Deploy Backend (Choose one):" -ForegroundColor White
Write-Host "   • Railway: https://railway.app (Recommended)" -ForegroundColor Gray
Write-Host "   • Render: https://render.com" -ForegroundColor Gray
Write-Host ""
Write-Host "3. Deploy Frontend:" -ForegroundColor White
Write-Host "   • Vercel: https://vercel.com" -ForegroundColor Gray
Write-Host ""
Write-Host "4. Update OAuth Redirect URI:" -ForegroundColor White
Write-Host "   • Google Cloud Console: https://console.cloud.google.com" -ForegroundColor Gray
Write-Host "   • Add: https://your-backend-url/api/auth/callback" -ForegroundColor Gray
Write-Host ""
Write-Host "📖 Full guide: See DEPLOYMENT.md" -ForegroundColor Cyan
Write-Host ""
Write-Host "Your YouTube API Quota: 110,000 units/day ✅" -ForegroundColor Green
Write-Host ""
