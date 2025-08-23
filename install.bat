@echo off
echo Installing Energy AI - Enhanced Version
echo =====================================

echo.
echo [1/4] Installing Backend Dependencies...
cd backend
call npm install
cd ..

echo.
echo [2/4] Installing Frontend Dependencies...
cd frontend
call npm install
cd ..

echo.
echo [3/4] Installing ML Model Dependencies...
cd ml-model
pip install -r requirements.txt
cd ..

echo.
echo [4/4] Setting up Mobile App (Optional)...
cd mobile-app
call npm install
cd ..

echo.
echo =====================================
echo Installation Complete!
echo.
echo To start all services, run: start-all.bat
echo.
echo Individual services:
echo - Backend: cd backend && npm start
echo - Frontend: cd frontend && npm run dev
echo - ML Model: cd ml-model && python predict_api.py
echo - Mobile: cd mobile-app && npm start
echo.
pause