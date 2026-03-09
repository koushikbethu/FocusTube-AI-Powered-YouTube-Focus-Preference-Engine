# 🔍 Deployment Readiness Check

Write-Host "==================================" -ForegroundColor Cyan
Write-Host "FocusTube Deployment Readiness" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

$allGood = $true

# Check 1: Git repository
Write-Host "Checking Git repository..." -ForegroundColor Yellow
if (Test-Path ".git") {
    Write-Host "✅ Git repository initialized" -ForegroundColor Green
} else {
    Write-Host "❌ Git not initialized. Run: git init" -ForegroundColor Red
    $allGood = $false
}

# Check 2: GitHub remote
Write-Host "Checking GitHub remote..." -ForegroundColor Yellow
$remote = git remote -v 2>$null
if ($remote -match "github.com") {
    Write-Host "✅ GitHub remote configured" -ForegroundColor Green
} else {
    Write-Host "❌ GitHub remote not found" -ForegroundColor Red
    $allGood = $false
}

# Check 3: Backend .env file
Write-Host "Checking backend configuration..." -ForegroundColor Yellow
if (Test-Path "backend\.env") {
    $envContent = Get-Content "backend\.env" -Raw
    
    if ($envContent -match "YOUTUBE_API_KEY=REDACTED_YOUTUBE_API_KEY") {
        Write-Host "✅ YouTube API key configured" -ForegroundColor Green
    } else {
        Write-Host "⚠️  YouTube API key not found" -ForegroundColor Yellow
    }
    
    if ($envContent -match "GEMINI_API_KEY=") {
        Write-Host "✅ Gemini API key configured" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Gemini API key not found" -ForegroundColor Yellow
    }
    
    if ($envContent -match "GOOGLE_CLIENT_ID=") {
        Write-Host "✅ Google OAuth configured" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Google OAuth not configured" -ForegroundColor Yellow
    }
} else {
    Write-Host "❌ backend/.env file not found" -ForegroundColor Red
    $allGood = $false
}

# Check 4: Deployment files
Write-Host "Checking deployment files..." -ForegroundColor Yellow
$deployFiles = @("railway.json", "render.yaml", "Procfile", "vercel.json")
$missingFiles = @()
foreach ($file in $deployFiles) {
    if (Test-Path $file) {
        Write-Host "  ✅ $file" -ForegroundColor Green
    } else {
        Write-Host "  ❌ $file missing" -ForegroundColor Red
        $missingFiles += $file
    }
}

if ($missingFiles.Count -eq 0) {
    Write-Host "✅ All deployment files present" -ForegroundColor Green
} else {
    Write-Host "⚠️  Some deployment files missing" -ForegroundColor Yellow
}

# Check 5: Dependencies
Write-Host "Checking dependencies..." -ForegroundColor Yellow
if (Test-Path "backend\requirements.txt") {
    Write-Host "✅ Backend requirements.txt found" -ForegroundColor Green
} else {
    Write-Host "❌ Backend requirements.txt missing" -ForegroundColor Red
    $allGood = $false
}

if (Test-Path "frontend\package.json") {
    Write-Host "✅ Frontend package.json found" -ForegroundColor Green
} else {
    Write-Host "❌ Frontend package.json missing" -ForegroundColor Red
    $allGood = $false
}

# Check 6: Documentation
Write-Host "Checking documentation..." -ForegroundColor Yellow
$docs = @("DEPLOYMENT.md", "QUICKSTART.md", "DEPLOYMENT_CHECKLIST.md")
foreach ($doc in $docs) {
    if (Test-Path $doc) {
        Write-Host "  ✅ $doc" -ForegroundColor Green
    }
}

Write-Host ""
Write-Host "==================================" -ForegroundColor Cyan

if ($allGood) {
    Write-Host "🎉 Ready to Deploy!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Yellow
    Write-Host "1. Run: git add . && git commit -m 'Ready for deployment' && git push" -ForegroundColor White
    Write-Host "2. Open QUICKSTART.md for deployment instructions" -ForegroundColor White
    Write-Host ""
    Write-Host "Quick links:" -ForegroundColor Yellow
    Write-Host "  • Railway: https://railway.app" -ForegroundColor Gray
    Write-Host "  • Vercel: https://vercel.com" -ForegroundColor Gray
    Write-Host "  • Google Console: https://console.cloud.google.com" -ForegroundColor Gray
} else {
    Write-Host "⚠️  Some issues found" -ForegroundColor Yellow
    Write-Host "Please fix the issues above before deploying" -ForegroundColor White
}

Write-Host ""
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

# Show API quota info
Write-Host "Your YouTube API Quota:" -ForegroundColor Cyan
Write-Host "  Daily Limit: 110,000 units" -ForegroundColor White
Write-Host "  Valid for: 6 months" -ForegroundColor White
Write-Host "  Project ID: 748015586117" -ForegroundColor White
Write-Host ""
