@echo off
echo ========================================
echo   Deploy Website to GitHub Pages
echo ========================================

echo Step 1: Building frontend for production...
cd frontend
call npm install
call npm run build
cd ..

echo Step 2: Creating gh-pages branch...
git checkout -b gh-pages 2>nul || git checkout gh-pages

echo Step 3: Copying build files...
xcopy /E /I /Y frontend\dist\* .\ 

echo Step 4: Committing build files...
git add .
git commit -m "Deploy website to GitHub Pages"

echo Step 5: Pushing to gh-pages branch...
git push origin gh-pages --force

echo Step 6: Switching back to main branch...
git checkout main

echo.
echo ========================================
echo SUCCESS! Website deployed!
echo Your website will be available at:
echo https://kaushal187-patel.github.io/energy_prediction/
echo ========================================
echo Note: It may take 5-10 minutes to go live
pause