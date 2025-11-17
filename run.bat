@echo off
REM Crop Marketplace MVP - Windows Run Script

echo ==================================
echo 🌾 Starting Crop Marketplace MVP
echo ==================================
echo.

echo Starting Backend Server...
start "Backend Server" cmd /k "cd backend && venv\Scripts\activate.bat && python app.py"

REM Wait for backend to start
timeout /t 5 /nobreak >nul

echo Starting Frontend Server...
start "Frontend Server" cmd /k "cd frontend && npm run dev"

echo.
echo ==================================
echo ✅ Application Running!
echo ==================================
echo.
echo 🌐 Access the application at:
echo    Frontend: http://localhost:5173
echo    Backend:  http://localhost:5000
echo.
echo 📝 Demo Login Credentials:
echo    Farmer: farmer1 / password123
echo    Client: client1 / password123
echo.
echo Close the terminal windows to stop the servers
echo ==================================
echo.
pause
