Write-Host "====================================================================" -ForegroundColor Green
Write-Host "🚀 NEXUSCART COMPLETE AUTOMATION: BUILD + DEPLOY + GITHUB PUSH" -ForegroundColor Green
Write-Host "====================================================================" -ForegroundColor Green
Write-Host ""

Set-Location -Path $PSScriptRoot

Write-Host "[STEP 1/3] Building Production Frontend..." -ForegroundColor Yellow
Set-Location -Path "$PSScriptRoot\frontend"
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed!" -ForegroundColor Red
    exit $LASTEXITCODE
}
Set-Location -Path $PSScriptRoot
Write-Host "✅ Build completed!" -ForegroundColor Green
Write-Host ""

Write-Host "[STEP 2/3] Deploying to Firebase..." -ForegroundColor Yellow
npx firebase-tools deploy --project nexuscart-fc3a2
Write-Host "✅ Firebase deployment finished!" -ForegroundColor Green
Write-Host "🌐 Live URL: https://nexuscart-fc3a2.web.app" -ForegroundColor Cyan
Write-Host ""

Write-Host "[STEP 3/3] Committing and Pushing to GitHub..." -ForegroundColor Yellow
git add .
git commit -m "feat: complete 150+ live e-commerce API stream, Clover Sandbox token integration, and real product details"
git push origin main
if ($LASTEXITCODE -ne 0) {
    git push origin master
}

Write-Host ""
Write-Host "====================================================================" -ForegroundColor Green
Write-Host "🌟 ALL TASKS COMPLETED SUCCESSFULLY!" -ForegroundColor Green
Write-Host "🌐 Live Website: https://nexuscart-fc3a2.web.app" -ForegroundColor Cyan
Write-Host "🔗 GitHub Repo:  https://github.com/MahadevaprasadS-0720/NexusCart" -ForegroundColor Cyan
Write-Host "====================================================================" -ForegroundColor Green
