@echo off
echo ========================================
echo   Complete Deployment Process
echo ========================================

echo This will:
echo 1. Push your code to GitHub
echo 2. Deploy website to GitHub Pages
echo 3. Make it publicly accessible
echo.
echo Press any key to continue...
pause >nul

echo.
echo ========================================
echo   STEP 1: Pushing to GitHub
echo ========================================
call push-to-github.bat

echo.
echo ========================================
echo   STEP 2: Deploying Website
echo ========================================
call deploy-website.bat

echo.
echo ========================================
echo   DEPLOYMENT COMPLETE!
echo ========================================
echo Your project is now live at:
echo https://kaushal187-patel.github.io/energy_prediction/
echo.
echo Repository: https://github.com/Kaushal187-Patel/energy_prediction
echo ========================================
pause