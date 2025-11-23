@echo off
echo Starting Circle-to-Analyze AI Agent...
echo.
echo Make sure Tesseract OCR is installed and in your PATH!
echo.
echo Starting all services...
start "Node.js Backend" cmd /k "npm run backend"
timeout /t 2 /nobreak >nul
start "Python AI Backend" cmd /k "npm run python"
timeout /t 3 /nobreak >nul
echo.
echo Starting Electron app...
npm start

