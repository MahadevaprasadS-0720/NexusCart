@echo off
title Push NexusCart to GitHub
color 0B
echo ====================================================
echo 🚀 Pushing NexusCart Updates to GitHub
echo ====================================================
echo.

cd /d "%~dp0"

echo [1/4] Checking Git Status...
git status
echo.

echo [2/4] Staging all modified and new files...
git add .
echo.

echo [3/4] Creating Git Commit...
git commit -m "feat: complete 150+ live e-commerce API stream, Clover Sandbox token integration, and real product details"
echo.

echo [4/4] Pushing to GitHub (origin main)...
git push origin main
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo Pushing to origin master instead...
    git push origin master
)

echo.
echo ====================================================
echo ✅ Done! Check your repository on GitHub:
echo 🔗 https://github.com/MahadevaprasadS-0720/NexusCart
echo ====================================================
echo.
pause
