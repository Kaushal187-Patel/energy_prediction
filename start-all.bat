@echo off
echo Starting Energy AI - All Services
echo =================================

echo Starting Backend Server...
start "Backend" cmd /k "cd backend && npm start"

timeout /t 3 /nobreak >nul

echo Starting ML Model API...
start "ML Model" cmd /k "cd ml-model && python predict_api.py"

timeout /t 3 /nobreak >nul

echo Starting Frontend Development Server...
start "Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo All services are starting...
echo.
echo Services will be available at:
echo - Frontend: http://localhost:5173
echo - Backend API: http://localhost:3001
echo - ML Model API: http://localhost:5000
echo.
echo Press any key to exit this window (services will continue running)
pause >nul