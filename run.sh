#!/bin/bash

echo "Starting Circle-to-Analyze AI Agent..."
echo ""
echo "Make sure Tesseract OCR is installed!"
echo ""

# Start Node.js backend in background
echo "Starting Node.js backend..."
npm run backend &
NODE_PID=$!

# Wait a bit
sleep 2

# Start Python backend in background
echo "Starting Python AI backend..."
npm run python &
PYTHON_PID=$!

# Wait for backends to be ready
sleep 3

# Start Electron app
echo "Starting Electron app..."
npm start

# Cleanup on exit
trap "kill $NODE_PID $PYTHON_PID 2>/dev/null" EXIT

