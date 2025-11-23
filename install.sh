#!/bin/bash

echo "Installing Circle-to-Analyze AI Agent..."
echo ""

echo "[1/3] Installing Node.js dependencies..."
npm install
if [ $? -ne 0 ]; then
    echo "Failed to install Node.js dependencies"
    exit 1
fi

echo ""
echo "[2/3] Installing Python dependencies..."
cd backend/python
pip3 install -r requirements.txt
if [ $? -ne 0 ]; then
    echo "Failed to install Python dependencies"
    echo "Try using: pip install -r requirements.txt"
    cd ../..
    exit 1
fi
cd ../..

echo ""
echo "[3/3] Creating directories..."
mkdir -p backend/temp

echo ""
echo "Installation complete!"
echo ""
echo "To run the application:"
echo "  npm run dev"
echo ""

