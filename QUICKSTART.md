# 🚀 Quick Start Guide

## Prerequisites Check

Before starting, ensure you have:

- ✅ Node.js installed (`node --version`)
- ✅ Python 3.8+ installed (`python --version`)
- ✅ Tesseract OCR installed (`tesseract --version`)

## Installation (One-Time Setup)

### Windows:
```bash
install.bat
```

### macOS/Linux:
```bash
chmod +x install.sh
./install.sh
```

Or manually:
```bash
npm install
cd backend/python
pip install -r requirements.txt
cd ../..
```

## Running the Application

### Option 1: All-in-One (Recommended)
```bash
npm run dev
```

### Option 2: Manual (3 Terminals)

**Terminal 1:**
```bash
npm run backend
```

**Terminal 2:**
```bash
npm run python
```

**Terminal 3:**
```bash
npm start
```

## Usage

1. Press **`Ctrl + Shift + O`** (or `Cmd + Shift + O` on Mac)
2. Draw a circle around the area to analyze
3. Release to capture and analyze
4. View results in the popup window
5. Click action buttons for different views

## Troubleshooting

### "Tesseract not found"
- Install Tesseract and add to PATH
- Windows: Download from GitHub and add `C:\Program Files\Tesseract-OCR` to PATH

### "Python backend not responding"
- Check if Python server is running on port 5000
- Verify dependencies: `pip list | grep flask`

### "TensorFlow errors"
- TensorFlow is optional - app will work without it (no image classification)
- To install: `pip install tensorflow==2.15.0`

### "Port already in use"
- Change ports in `backend/server.js` (3000) and `backend/python/app.py` (5000)

## Need Help?

Check the full [README.md](README.md) for detailed documentation.

