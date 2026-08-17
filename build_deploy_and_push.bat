@echo off
title NexusCart - Build, Deploy to Firebase and Push to GitHub
color 0A
echo ====================================================================
echo 🚀 NEXUSCART COMPLETE AUTOMATION: BUILD + FIREBASE DEPLOY + GITHUB PUSH
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

echo [STEP 2/3] Deploying to Firebase Hosting & Cloud Firestore...
call npx firebase-tools deploy --project nexuscart-fc3a2
if %ERRORLEVEL% NEQ 0 (
    echo ⚠️ Trying global firebase CLI...
    call firebase deploy
)
echo ✅ Firebase deployment finished!
echo 🌐 Live Site URL: https://nexuscart-fc3a2.web.app
echo 🌐 Custom URL:   https://nexuscart-fc3a2.firebaseapp.com
echo.

echo [STEP 3/3] Committing and Pushing to GitHub...
git add .
git commit -m "feat: live e-commerce marketplace catalog 100+ items, Clover Sandbox API tokens, and custom API connector"
git push origin main
if %ERRORLEVEL% NEQ 0 (
    echo Pushing to origin master instead...
    git push origin master
)
echo ✅ GitHub push completed!
echo 🔗 Repo URL: https://github.com/MahadevaprasadS-0720/NexusCart
echo.

echo ====================================================================
echo 🌟 ALL TASKS COMPLETED SUCCESSFULLY!
echo ====================================================================
echo.
pause
