@echo off
echo Starting cleanup of unused files...

REM Remove node_modules directories (can be reinstalled)
if exist "frontend\node_modules" (
    echo Removing frontend node_modules...
    rmdir /s /q "frontend\node_modules"
)

if exist "backend\node_modules" (
    echo Removing backend node_modules...
    rmdir /s /q "backend\node_modules"
)

if exist "mobile-app\node_modules" (
    echo Removing mobile-app node_modules...
    rmdir /s /q "mobile-app\node_modules"
)

if exist "node_modules" (
    echo Removing root node_modules...
    rmdir /s /q "node_modules"
)

REM Remove build/dist directories
if exist "frontend\dist" rmdir /s /q "frontend\dist"
if exist "frontend\build" rmdir /s /q "frontend\build"
if exist "backend\dist" rmdir /s /q "backend\dist"
if exist "backend\build" rmdir /s /q "backend\build"

REM Remove cache directories
if exist "frontend\.vite" rmdir /s /q "frontend\.vite"
if exist "frontend\.next" rmdir /s /q "frontend\.next"
if exist ".nyc_output" rmdir /s /q ".nyc_output"
if exist "coverage" rmdir /s /q "coverage"

REM Remove lock files (auto-generated)
if exist "frontend\package-lock.json" del "frontend\package-lock.json"
if exist "frontend\yarn.lock" del "frontend\yarn.lock"
if exist "frontend\bun.lockb" del "frontend\bun.lockb"
if exist "backend\package-lock.json" del "backend\package-lock.json"
if exist "mobile-app\package-lock.json" del "mobile-app\package-lock.json"
if exist "yarn.lock" del "yarn.lock"

REM Remove temporary files
del /s /q "*.tmp" 2>nul
del /s /q "*.log" 2>nul
del /s /q "Thumbs.db" 2>nul
del /s /q ".DS_Store" 2>nul

REM Remove unused mobile app screens (keeping only DashboardScreen.tsx)
if exist "mobile-app\src\screens\MonitoringScreen.tsx" del "mobile-app\src\screens\MonitoringScreen.tsx"
if exist "mobile-app\src\screens\PredictScreen.tsx" del "mobile-app\src\screens\PredictScreen.tsx"
if exist "mobile-app\src\screens\SettingsScreen.tsx" del "mobile-app\src\screens\SettingsScreen.tsx"

REM Remove duplicate documentation files
if exist "DEPLOYMENT_INSTRUCTIONS.md" del "DEPLOYMENT_INSTRUCTIONS.md"
if exist "FEATURES_IMPLEMENTED.md" del "FEATURES_IMPLEMENTED.md"

echo Cleanup completed!
echo.
echo To reinstall dependencies, run:
echo   cd frontend ^&^& npm install
echo   cd backend ^&^& npm install  
echo   cd mobile-app ^&^& npm install
echo   cd ml-model ^&^& pip install -r requirements.txt
pause