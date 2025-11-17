#!/bin/bash

# Crop Marketplace MVP - Local Setup Script
# This script sets up the complete development environment

echo "=================================="
echo "🌾 Crop Marketplace MVP Setup"
echo "=================================="
echo ""

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3.8 or higher."
    exit 1
fi

echo "✓ Python 3 found: $(python3 --version)"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16 or higher."
    exit 1
fi

echo "✓ Node.js found: $(node --version)"
echo "✓ npm found: $(npm --version)"
echo ""

# Backend Setup
echo "=================================="
echo "📦 Setting up Backend..."
echo "=================================="

cd backend

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "Creating Python virtual environment..."
    python3 -m venv venv
    echo "✓ Virtual environment created"
else
    echo "✓ Virtual environment already exists"
fi

# Activate virtual environment
echo "Activating virtual environment..."
source venv/bin/activate

# Install dependencies
echo "Installing Python dependencies..."
pip install -r requirements.txt
echo "✓ Backend dependencies installed"

# Create .env file if it doesn't exist
if [ ! -f ".env" ]; then
    echo "Creating .env file..."
    cp .env.example .env
    echo "✓ .env file created"
    echo ""
    echo "⚠️  IMPORTANT: Please edit backend/.env and add your GEMINI_API_KEY"
    echo "   You can get the API key from: https://aistudio.google.com/app/apikey"
    echo ""
else
    echo "✓ .env file already exists"
fi

# Initialize database
echo "Initializing database..."
python seed_data.py
echo "✓ Database initialized with demo data"

cd ..

# Frontend Setup
echo ""
echo "=================================="
echo "🎨 Setting up Frontend..."
echo "=================================="

cd frontend

# Install dependencies
echo "Installing Node.js dependencies..."
npm install
echo "✓ Frontend dependencies installed"

# Create .env file if it doesn't exist
if [ ! -f ".env" ]; then
    echo "Creating .env file..."
    echo "VITE_API_URL=http://localhost:5000/api" > .env
    echo "✓ .env file created"
else
    echo "✓ .env file already exists"
fi

cd ..

echo ""
echo "=================================="
echo "✅ Setup Complete!"
echo "=================================="
echo ""
echo "📝 Next Steps:"
echo ""
echo "1. Configure Gemini API Key (optional but recommended for AI features):"
echo "   - Open backend/.env"
echo "   - Add your GEMINI_API_KEY from https://aistudio.google.com/app/apikey"
echo ""
echo "2. Start the application:"
echo "   - Run: ./run.sh"
echo "   OR manually:"
echo "   - Terminal 1: cd backend && source venv/bin/activate && python app.py"
echo "   - Terminal 2: cd frontend && npm run dev"
echo ""
echo "3. Access the application:"
echo "   - Frontend: http://localhost:5173"
echo "   - Backend API: http://localhost:5000"
echo ""
echo "4. Demo Login Credentials:"
echo "   - Farmer: farmer1 / password123"
echo "   - Client: client1 / password123"
echo ""
echo "📚 For detailed documentation, see README.md"
echo ""
