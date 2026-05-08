# Deploy Fix Script for FocusTube (GitHub Pages)
Write-Host "🚀 Deploying FocusTube fixes..." -ForegroundColor Green

# Get GitHub username
$githubUser = Read-Host "Enter your GitHub username"
if ([string]::IsNullOrEmpty($githubUser)) {
    Write-Host "❌ GitHub username is required" -ForegroundColor Red
    exit 1
}

# Update render.yaml with correct GitHub Pages URL
$renderConfig = Get-Content "render.yaml" -Raw
$renderConfig = $renderConfig -replace "yourusername", $githubUser
Set-Content "render.yaml" $renderConfig

Write-Host "✅ Updated backend config for GitHub Pages URL" -ForegroundColor Green

# 1. Backend deployment
Write-Host "📦 Deploying backend to Render..." -ForegroundColor Yellow
git add .
git commit -m "Fix: Backend deployment, thumbnail loading, mode filtering, persistent login, video player"
git push origin main

Write-Host "✅ Backend deployment triggered on Render" -ForegroundColor Green
Write-Host "✅ Frontend will auto-deploy via GitHub Actions" -ForegroundColor Green

Write-Host "🎉 Deployment complete! Check:" -ForegroundColor Green
Write-Host "   Backend: https://focustube-backend.onrender.com/health" -ForegroundColor Cyan
Write-Host "   Frontend: https://$githubUser.github.io/focustube/" -ForegroundColor Cyan

Write-Host "🔧 Fixes applied:" -ForegroundColor Yellow
Write-Host "   ✓ Backend deployment configuration" -ForegroundColor White
Write-Host "   ✓ Thumbnail loading with fallbacks" -ForegroundColor White  
Write-Host "   ✓ Mode-based video filtering" -ForegroundColor White
Write-Host "   ✓ Persistent login (no auto-logout)" -ForegroundColor White
Write-Host "   ✓ Video player embed fixes" -ForegroundColor White
Write-Host "   ✓ Auto-block opposite categories in settings" -ForegroundColor White
Write-Host "   ✓ Login page padding and 'Get Started' button" -ForegroundColor White
Write-Host "   ✓ Fresh video content on refresh" -ForegroundColor White
Write-Host "   ✓ GitHub Pages deployment setup" -ForegroundColor White

Write-Host "📝 Next: Enable GitHub Pages in your repo settings (Source: GitHub Actions)" -ForegroundColor Yellow