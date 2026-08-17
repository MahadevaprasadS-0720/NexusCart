@echo off
title NexusCart - Launch Website Locally
color 0A
echo ====================================================================
echo 🚀 LAUNCHING NEXUSCART LIVE MARKETPLACE ON LOCAL SERVER
echo ====================================================================
echo.

cd /d "%~dp0frontend"

echo [1/2] Checking Dependencies...
if not exist "node_modules" (
    echo Installing node modules...
    call npm install
)

echo.
echo [2/2] Launching Local Dev Server on Port 3000...
start "NexusCart Dev Server" cmd /k "npm run dev"

echo.
echo Opening website in your default browser...
timeout /t 3 /nobreak >nul
start http://localhost:3000

echo ====================================================================
echo ✅ NexusCart is now open in your browser at http://localhost:3000
echo 🍀 Live Clover Diagnostics available at http://localhost:3000/clover
echo ====================================================================
echo.
pause
