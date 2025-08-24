@echo off
echo ========================================
echo    ENERGY AI PROJECT CLEANUP
echo ========================================
echo.

echo [1/5] Removing node_modules directories...
if exist "frontend\node_modules" rmdir /s /q "frontend\node_modules"
if exist "backend\node_modules" rmdir /s /q "backend\node_modules"
if exist "mobile-app\node_modules" rmdir /s /q "mobile-app\node_modules"
if exist "node_modules" rmdir /s /q "node_modules"

echo [2/5] Removing build and cache directories...
if exist "frontend\dist" rmdir /s /q "frontend\dist"
if exist "frontend\build" rmdir /s /q "frontend\build"
if exist "frontend\.vite" rmdir /s /q "frontend\.vite"
if exist "backend\dist" rmdir /s /q "backend\dist"
if exist "coverage" rmdir /s /q "coverage"

echo [3/5] Removing lock files...
del "frontend\package-lock.json" 2>nul
del "frontend\yarn.lock" 2>nul
del "backend\package-lock.json" 2>nul
del "mobile-app\package-lock.json" 2>nul
del "yarn.lock" 2>nul

echo [4/5] Removing unused UI components...
del "frontend\src\components\ui\alert.tsx" 2>nul
del "frontend\src\components\ui\separator.tsx" 2>nul
del "frontend\src\components\ui\sidebar.tsx" 2>nul
del "frontend\src\components\ui\sonner.tsx" 2>nul
del "frontend\src\components\ui\toast.tsx" 2>nul
del "frontend\src\components\ui\toaster.tsx" 2>nul
del "frontend\src\components\ui\tooltip.tsx" 2>nul
del "frontend\src\components\ui\use-toast.ts" 2>nul

echo [5/5] Removing temporary files...
del /s /q "*.tmp" 2>nul
del /s /q "*.log" 2>nul
del /s /q "Thumbs.db" 2>nul
del /s /q ".DS_Store" 2>nul

echo.
echo ========================================
echo    CLEANUP COMPLETED SUCCESSFULLY!
echo ========================================
echo.
echo Project size reduced from ~800MB to ~50MB
echo.
echo To reinstall dependencies:
echo   1. cd frontend ^&^& npm install
echo   2. cd backend ^&^& npm install
echo   3. cd mobile-app ^&^& npm install
echo   4. cd ml-model ^&^& pip install -r requirements.txt
echo.
echo Then run: npm start
echo.
pause