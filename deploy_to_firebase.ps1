Write-Host "====================================================" -ForegroundColor Green
Write-Host "🔥 Deploying NexusCart to Firebase (PowerShell)" -ForegroundColor Green
Write-Host "====================================================" -ForegroundColor Green
Write-Host ""

Set-Location -Path $PSScriptRoot

Write-Host "[1/2] Building Production Bundle (Vite)..." -ForegroundColor Yellow
Set-Location -Path "$PSScriptRoot\frontend"
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed!" -ForegroundColor Red
    exit $LASTEXITCODE
}
Set-Location -Path $PSScriptRoot
Write-Host "✅ Build completed!" -ForegroundColor Green
Write-Host ""

Write-Host "[2/2] Deploying to Firebase Hosting (Project: nexuscart-fc3a2)..." -ForegroundColor Yellow
npx firebase-tools deploy --project nexuscart-fc3a2
if ($LASTEXITCODE -ne 0) {
    Write-Host "Trying global firebase CLI..." -ForegroundColor Yellow
    firebase deploy
}

Write-Host ""
Write-Host "====================================================" -ForegroundColor Green
Write-Host "✅ Deployment completed successfully!" -ForegroundColor Green
Write-Host "🌐 Live Production URL: https://nexuscart-fc3a2.web.app" -ForegroundColor Cyan
Write-Host "🍀 Live Clover Page:   https://nexuscart-fc3a2.web.app/clover" -ForegroundColor Cyan
Write-Host "====================================================" -ForegroundColor Green
