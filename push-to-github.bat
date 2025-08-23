@echo off
echo ========================================
echo   Energy Prediction - GitHub Push
echo ========================================

echo Step 1: Adding all files to git...
git add .

echo Step 2: Committing changes...
git commit -m "Energy Prediction Project - Complete Implementation"

echo Step 3: Adding remote repository...
git remote remove origin 2>nul
git remote add origin https://github.com/Kaushal187-Patel/energy_prediction.git

echo Step 4: Pushing to GitHub...
git branch -M main
git push -u origin main --force

echo.
echo ========================================
echo SUCCESS! Code pushed to GitHub
echo Repository: https://github.com/Kaushal187-Patel/energy_prediction
echo ========================================
pause