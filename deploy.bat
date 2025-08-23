@echo off
echo Starting deployment process...

echo.
echo Step 1: Initialize Git repository
git init
git add .
git commit -m "Initial commit: Energy Prediction Project"

echo.
echo Step 2: Add remote repository
git remote add origin https://github.com/Kaushal187-Patel/energy_prediction.git

echo.
echo Step 3: Push to GitHub
git branch -M main
git push -u origin main

echo.
echo Deployment script completed!
echo Your code is now on GitHub: https://github.com/Kaushal187-Patel/energy_prediction
pause