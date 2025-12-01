@echo off
REM Deployment Script for Synnex Invoice Extractor (Windows)
REM This script helps prepare and deploy the application

echo.
echo ================================================
echo   Synnex Invoice Extractor - Deployment Script
echo ================================================
echo.

REM Check if .env exists
if not exist .env (
    echo [ERROR] .env file not found!
    echo Please create a .env file based on env.example
    exit /b 1
)

echo [OK] .env file found

REM Check Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed or not in PATH
    exit /b 1
)

echo [OK] Node.js found

REM Install dependencies
echo.
echo Installing dependencies...
call npm install
if %errorlevel% neq 0 (
    echo [ERROR] Failed to install dependencies
    exit /b 1
)

echo.
echo Installing client dependencies...
cd client
call npm install
if %errorlevel% neq 0 (
    echo [ERROR] Failed to install client dependencies
    exit /b 1
)

echo.
echo Building frontend...
call npm run build
if %errorlevel% neq 0 (
    echo [ERROR] Failed to build frontend
    exit /b 1
)
cd ..

echo.
echo ================================================
echo   Build completed successfully!
echo ================================================
echo.
echo Next steps:
echo 1. Make sure your .env file has all required variables
echo 2. Start the server with: npm start
echo    Or use PM2: pm2 start server/index.js --name synnex-invoice
echo.
echo For production deployment, see DEPLOYMENT_GUIDE.md
echo.

pause

