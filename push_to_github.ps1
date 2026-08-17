Write-Host "====================================================" -ForegroundColor Cyan
Write-Host "🚀 Pushing NexusCart Updates to GitHub (PowerShell)" -ForegroundColor Cyan
Write-Host "====================================================" -ForegroundColor Cyan
Write-Host ""

Set-Location -Path $PSScriptRoot

Write-Host "[1/3] Staging modified and new files..." -ForegroundColor Yellow
git add .

Write-Host "[2/3] Creating commit..." -ForegroundColor Yellow
git commit -m "feat: complete 150+ live e-commerce API stream, Clover Sandbox token integration, and real product details"

Write-Host "[3/3] Pushing to GitHub (origin main)..." -ForegroundColor Yellow
git push origin main
if ($LASTEXITCODE -ne 0) {
    Write-Host "Trying origin master instead..." -ForegroundColor Yellow
    git push origin master
}

Write-Host ""
Write-Host "====================================================" -ForegroundColor Green
Write-Host "✅ Git push completed successfully!" -ForegroundColor Green
Write-Host "🔗 https://github.com/MahadevaprasadS-0720/NexusCart" -ForegroundColor Green
Write-Host "====================================================" -ForegroundColor Green
