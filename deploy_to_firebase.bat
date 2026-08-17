@echo off
title Deploy NexusCart to Firebase
color 0A
echo ====================================================
echo 🔥 Deploying NexusCart to Firebase Hosting & Firestore
echo ====================================================
echo.

cd /d "%~dp0"

echo [1/3] Building Frontend Production Bundle (Vite)...
cd frontend
call npm run build
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ❌ Build failed! Please resolve build errors before deploying.
    pause
    exit /b %ERRORLEVEL%
)
cd ..

echo.
echo [2/3] Verifying Firebase Build Artifacts...
if not exist "frontend\dist\index.html" (
    echo ❌ Error: frontend\dist\index.html was not found.
    pause
    exit /b 1
)

echo.
echo [3/3] Deploying to Firebase (Project: nexuscart-fc3a2)...
call npx firebase-tools deploy --project nexuscart-fc3a2
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ⚠️ Standard deploy command failed. Trying global firebase CLI...
    call firebase deploy
)

echo.
echo ====================================================
echo 🌐 Live Production URL: https://nexuscart-fc3a2.web.app
echo 🌐 Custom Domain URL:   https://nexuscart-fc3a2.firebaseapp.com
echo ====================================================
echo.
pause
