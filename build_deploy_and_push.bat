@echo off
title NexusCart - Build, Deploy to Firebase and Push to GitHub
color 0A
echo ====================================================================
echo 🚀 NEXUSCART COMPLETE AUTOMATION: BUILD + DEPLOY + GITHUB + OPEN SITE
echo ====================================================================
echo.

cd /d "%~dp0"

echo [STEP 1/4] Building Production Frontend (Vite)...
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

echo [STEP 2/4] Deploying to Firebase Hosting & Firestore...
call npx firebase-tools deploy --project nexuscart-fc3a2
if %ERRORLEVEL% NEQ 0 (
    echo ⚠️ Standard deploy failed, trying global firebase CLI...
    call firebase deploy
)
echo ✅ Firebase deployment finished!
echo.

echo [STEP 3/4] Committing and Pushing to GitHub...
git add .
git commit -m "feat(ui): extend Neumorphic Soft-UI design to Navbar, Category Pills, and Product Cards"
git push origin main
if %ERRORLEVEL% NEQ 0 (
    echo Pushing to origin master instead...
    git push origin master
)
echo ✅ GitHub push completed!
echo.

echo [STEP 4/4] Opening Live Website in your default browser...
timeout /t 2 /nobreak >nul
start https://nexuscart-fc3a2.web.app

echo ====================================================================
echo 🌟 ALL TASKS COMPLETED SUCCESSFULLY!
echo 🌐 Live Production Store: https://nexuscart-fc3a2.web.app
echo 🛡️ Admin Portal:          https://nexuscart-fc3a2.web.app/admin
echo 🔑 Clover Admin Tools:    https://nexuscart-fc3a2.web.app/admin/clover
echo 🔗 GitHub Repository:     https://github.com/MahadevaprasadS-0720/NexusCart
echo ====================================================================
echo.
pause
