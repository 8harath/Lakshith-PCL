#!/bin/bash

# Crop Marketplace MVP - Run Script
# This script starts both backend and frontend servers

echo "=================================="
echo "🌾 Starting Crop Marketplace MVP"
echo "=================================="
echo ""

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "Shutting down servers..."
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    wait $BACKEND_PID $FRONTEND_PID 2>/dev/null
    echo "✓ Servers stopped"
    exit 0
}

# Set up trap to catch Ctrl+C
trap cleanup SIGINT SIGTERM

# Start backend
echo "Starting Backend Server..."
cd backend
source venv/bin/activate
python app.py &
BACKEND_PID=$!
cd ..

# Wait a bit for backend to start
sleep 3

# Start frontend
echo "Starting Frontend Server..."
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..

echo ""
echo "=================================="
echo "✅ Application Running!"
echo "=================================="
echo ""
echo "🌐 Access the application at:"
echo "   Frontend: http://localhost:5173"
echo "   Backend:  http://localhost:5000"
echo ""
echo "📝 Demo Login Credentials:"
echo "   Farmer: farmer1 / password123"
echo "   Client: client1 / password123"
echo ""
echo "Press Ctrl+C to stop both servers"
echo "=================================="
echo ""

# Wait for both processes
wait $BACKEND_PID $FRONTEND_PID
