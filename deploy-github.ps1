# Deploy to GitHub - Simple Script

Write-Host "Deploying FocusTube to GitHub..." -ForegroundColor Cyan
Write-Host ""

# Add all files
git add .

# Commit
git commit -m "Deploy FocusTube with GitHub Actions"

# Push
git push origin main

Write-Host ""
Write-Host "Pushed to GitHub!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Enable GitHub Pages: https://github.com/koushikbethu/FocusTube-AI-Powered-YouTube-Focus-Preference-Engine/settings/pages" -ForegroundColor White
Write-Host "   - Source: Deploy from a branch" -ForegroundColor Gray
Write-Host "   - Branch: gh-pages" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Deploy backend on Railway: https://railway.app" -ForegroundColor White
Write-Host ""
Write-Host "3. See GITHUB_DEPLOY.md for full instructions" -ForegroundColor White
Write-Host ""
