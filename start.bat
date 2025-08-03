@echo off
echo Starting Energy AI Application...

start "Frontend" cmd /k "cd frontend && npm run dev"
start "Backend" cmd /k "cd backend && npm start"  
start "ML Model" cmd /k "cd ml-model && python predict_api.py"

echo All services started!
pause