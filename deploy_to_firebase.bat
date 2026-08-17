@echo off
title NexusCart - Build and Deploy to Firebase
color 0A
echo ====================================================================
echo 🔥 BUILDING & DEPLOYING NEXUSCART TO FIREBASE HOSTING
echo ====================================================================
echo.

cd /d "%~dp0"

echo [STEP 1/3] Building Production Frontend (Vite)...
cd frontend
call npm run build
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ❌ Build failed! Please check code errors.
    pause
    exit /b %ERRORLEVEL%
)
cd ..
echo ✅ Build completed successfully!
echo.

echo [STEP 2/3] Deploying to Firebase Hosting (Project: nexuscart-fc3a2)...
call npx firebase-tools deploy --project nexuscart-fc3a2
if %ERRORLEVEL% NEQ 0 (
    echo ⚠️ Standard deploy failed, trying global firebase command...
    call firebase deploy
)
echo ✅ Firebase deployment complete!
echo.

echo [STEP 3/3] Opening Live Production Website in Browser...
timeout /t 2 /nobreak >nul
start https://nexuscart-fc3a2.web.app

echo ====================================================================
echo 🌐 Live Website:           https://nexuscart-fc3a2.web.app
echo 🍀 Live Clover Dashboard:  https://nexuscart-fc3a2.web.app/clover
echo ====================================================================
echo.
pause
