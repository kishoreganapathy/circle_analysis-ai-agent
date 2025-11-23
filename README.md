# 🔶 Circle-to-Analyze AI Agent

A desktop application similar to Google Gemini's Circle-to-Search feature. Draw a circle around any area on your screen, and the AI will analyze it using TensorFlow, OCR, and code detection.

## ✨ Features

- **Global Hotkey**: Press `Ctrl + Shift + O` to activate
- **Transparent Overlay**: Draw circles on any screen area
- **AI Analysis**: 
  - Image classification using TensorFlow MobileNet
  - OCR text extraction using Tesseract
  - Code detection and formatting
  - Object recognition
- **Interactive Popup**: View results with action buttons:
  - "What is this?" - General description
  - "Explain" - Detailed explanation
  - "Convert to Code" - Code detection and formatting
  - "Summarize" - Quick summary
- **Query History**: SQLite database stores all previous queries

## 🛠️ Tech Stack

- **Desktop**: Electron.js
- **Backend**: Node.js + Express.js
- **AI Engine**: Python (Flask) + TensorFlow + Tesseract OCR
- **Database**: SQLite (better-sqlite3)

## 📋 Prerequisites

Before installing, make sure you have:

1. **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
2. **Python** (v3.8 or higher) - [Download](https://www.python.org/)
3. **Tesseract OCR** - Required for text extraction
   - **Windows**: Download from [GitHub](https://github.com/UB-Mannheim/tesseract/wiki) and add to PATH
   - **macOS**: `brew install tesseract`
   - **Linux**: `sudo apt-get install tesseract-ocr`

## 🚀 Installation

### Step 1: Clone or Download the Project

```bash
cd PROJECT1
```

### Step 2: Install Node.js Dependencies

```bash
npm install
```

### Step 3: Install Python Dependencies

```bash
cd backend/python
pip install -r requirements.txt
cd ../..
```

**Note**: On some systems, you may need to use `pip3` instead of `pip`.

### Step 4: Verify Tesseract Installation

```bash
tesseract --version
```

If this command fails, make sure Tesseract is installed and added to your system PATH.

## 🎯 Running the Application

### Option 1: Run Everything Together (Recommended)

```bash
npm run dev
```

This will:
1. Start the Node.js backend server (port 3000)
2. Start the Python AI backend (port 5000)
3. Wait for both to be ready
4. Launch the Electron desktop app

### Option 2: Run Components Separately

**Terminal 1 - Node.js Backend:**
```bash
npm run backend
```

**Terminal 2 - Python AI Backend:**
```bash
npm run python
```

**Terminal 3 - Electron App:**
```bash
npm start
```

## 📖 Usage

1. **Start the application** using one of the methods above
2. **Press `Ctrl + Shift + O`** (or `Cmd + Shift + O` on macOS) to open the overlay
3. **Draw a circle** around the area you want to analyze
   - Click and drag to draw
   - Release to capture
   - Press `ESC` to cancel
4. **View results** in the popup window
5. **Click action buttons** to see different analysis views:
   - **What is this?** - General overview
   - **Explain** - Detailed explanation
   - **Convert to Code** - Code detection and formatting
   - **Summarize** - Quick summary

## 📁 Project Structure

```
project/
├── backend/
│   ├── server.js              # Node.js Express server
│   ├── database.js            # SQLite database module
│   ├── database.sqlite        # SQLite database file (auto-created)
│   ├── temp/                  # Temporary screenshot storage
│   ├── routes/                # API routes (if needed)
│   ├── controllers/           # Controllers (if needed)
│   └── python/
│       ├── app.py             # Flask AI backend
│       ├── call_python.py     # Helper script for Node.js
│       ├── requirements.txt   # Python dependencies
│       ├── model/
│       │   ├── classifier.py  # TensorFlow image classifier
│       │   ├── ocr_engine.py  # Tesseract OCR engine
│       │   └── code_detector.py # Code detection logic
│       └── utils/
│
├── desktop/
│   ├── main.js                # Electron main process
│   ├── overlay/
│   │   ├── overlay.html       # Overlay HTML
│   │   ├── overlay.js        # Circle drawing logic
│   │   └── overlay.css       # Overlay styles
│   └── popup/
│       ├── popup.html        # Results popup HTML
│       ├── popup.js          # Popup logic
│       └── popup.css         # Popup styles
│
├── package.json               # Node.js dependencies
└── README.md                  # This file
```

## 🔧 API Endpoints

### Node.js Backend (Port 3000)

- `GET /health` - Health check
- `POST /capture` - Capture screenshot
- `POST /analyze` - Analyze image (forwards to Python)
- `GET /history` - Get query history

### Python Backend (Port 5000)

- `GET /health` - Health check
- `POST /analyze` - Analyze image with AI

## 🐛 Troubleshooting

### Issue: "Tesseract not found"

**Solution**: 
- Make sure Tesseract is installed
- Add Tesseract to your system PATH
- On Windows, the default path is usually `C:\Program Files\Tesseract-OCR`

### Issue: "Python backend not responding"

**Solution**:
- Check if Python dependencies are installed: `pip install -r backend/python/requirements.txt`
- Make sure port 5000 is not in use
- Check Python version: `python --version` (should be 3.8+)

### Issue: "TensorFlow installation fails"

**Solution**:
- Make sure you have Python 3.8-3.11 (TensorFlow 2.15 supports these versions)
- Try installing TensorFlow separately: `pip install tensorflow==2.15.0`
- On Apple Silicon Macs, you may need TensorFlow for macOS: `pip install tensorflow-macos`

### Issue: "Global hotkey not working"

**Solution**:
- Make sure the Electron app has focus
- Try restarting the application
- On some systems, you may need to grant accessibility permissions

### Issue: "Screenshot capture fails"

**Solution**:
- Make sure you're running on a supported platform (Windows, macOS, Linux)
- Check that the overlay window is visible
- Try drawing a larger circle

## 🎓 Learning Resources

This project demonstrates:

- **Electron.js**: Desktop application development
- **Global Hotkeys**: System-level keyboard shortcuts
- **Screen Capture**: Taking screenshots programmatically
- **Canvas Drawing**: HTML5 canvas for drawing circles
- **REST APIs**: Express.js and Flask backends
- **AI/ML**: TensorFlow for image classification
- **OCR**: Text extraction from images
- **Database**: SQLite for data persistence
- **IPC Communication**: Electron inter-process communication

## 📝 Notes

- The first time you run the app, TensorFlow will download the MobileNet model (~14MB)
- Screenshots are temporarily stored in `backend/temp/` and can be cleaned up manually
- Query history is stored in `backend/database.sqlite`
- The application works best with clear, high-contrast images

## 🔒 Security Notes

- The application captures screenshots of your screen
- All processing is done locally (no data sent to external servers)
- Screenshots are stored temporarily and can be deleted from `backend/temp/`

## 📄 License

ISC

## 🤝 Contributing

This is a student-level project. Feel free to:
- Add more AI models
- Improve code detection
- Add more analysis options
- Enhance the UI/UX

## 🙏 Acknowledgments

- Inspired by Google Gemini's Circle-to-Search feature
- Uses TensorFlow MobileNet for image classification
- Uses Tesseract OCR for text extraction

---

**Happy Analyzing! 🎉**

