@echo off
title Launch Firebase E-Commerce Marketplace
color 0A
echo ====================================================
echo 🚀 Launching Firebase E-Commerce Marketplace
echo ====================================================
echo.

echo [1/2] Checking & Installing Frontend Firebase Dependencies...
cd /d "%~dp0frontend"
call npm install --silent

echo.
echo [2/2] Starting Serverless React Marketplace (Port 3000)...
start "Firebase E-Commerce App (Port 3000)" cmd /k "cd /d "%~dp0frontend" && npm run dev"

echo.
echo ====================================================
echo ✅ SUCCESS! Firebase E-Commerce App starting up.
echo 🌐 Open Marketplace in Browser: http://localhost:3000
echo ====================================================
echo.
pause
