@echo off
REM Crop Marketplace MVP - Windows Setup Script

echo ==================================
echo 🌾 Crop Marketplace MVP Setup
echo ==================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python 3 is not installed. Please install Python 3.8 or higher.
    pause
    exit /b 1
)

echo ✓ Python found
python --version

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js is not installed. Please install Node.js 16 or higher.
    pause
    exit /b 1
)

echo ✓ Node.js found
node --version
echo ✓ npm found
call npm --version
echo.

REM Backend Setup
echo ==================================
echo 📦 Setting up Backend...
echo ==================================

cd backend

REM Create virtual environment if it doesn't exist
if not exist "venv" (
    echo Creating Python virtual environment...
    python -m venv venv
    echo ✓ Virtual environment created
) else (
    echo ✓ Virtual environment already exists
)

REM Activate virtual environment and install dependencies
echo Installing Python dependencies...
call venv\Scripts\activate.bat
pip install -r requirements.txt
echo ✓ Backend dependencies installed

REM Create .env file if it doesn't exist
if not exist ".env" (
    echo Creating .env file...
    copy .env.example .env
    echo ✓ .env file created
    echo.
    echo ⚠️  IMPORTANT: Please edit backend\.env and add your GEMINI_API_KEY
    echo    You can get the API key from: https://aistudio.google.com/app/apikey
    echo.
) else (
    echo ✓ .env file already exists
)

REM Initialize database
echo Initializing database...
python seed_data.py
echo ✓ Database initialized with demo data

cd ..

REM Frontend Setup
echo.
echo ==================================
echo 🎨 Setting up Frontend...
echo ==================================

cd frontend

REM Install dependencies
echo Installing Node.js dependencies...
call npm install
echo ✓ Frontend dependencies installed

REM Create .env file if it doesn't exist
if not exist ".env" (
    echo Creating .env file...
    echo VITE_API_URL=http://localhost:5000/api > .env
    echo ✓ .env file created
) else (
    echo ✓ .env file already exists
)

cd ..

echo.
echo ==================================
echo ✅ Setup Complete!
echo ==================================
echo.
echo 📝 Next Steps:
echo.
echo 1. Configure Gemini API Key (optional but recommended for AI features):
echo    - Open backend\.env
echo    - Add your GEMINI_API_KEY from https://aistudio.google.com/app/apikey
echo.
echo 2. Start the application:
echo    - Run: run.bat
echo    OR manually:
echo    - Terminal 1: cd backend ^&^& venv\Scripts\activate.bat ^&^& python app.py
echo    - Terminal 2: cd frontend ^&^& npm run dev
echo.
echo 3. Access the application:
echo    - Frontend: http://localhost:5173
echo    - Backend API: http://localhost:5000
echo.
echo 4. Demo Login Credentials:
echo    - Farmer: farmer1 / password123
echo    - Client: client1 / password123
echo.
echo 📚 For detailed documentation, see README.md
echo.
pause
