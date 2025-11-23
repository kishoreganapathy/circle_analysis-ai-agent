@echo off
echo Installing Circle-to-Analyze AI Agent...
echo.

echo [1/3] Installing Node.js dependencies...
call npm install
if errorlevel 1 (
    echo Failed to install Node.js dependencies
    pause
    exit /b 1
)

echo.
echo [2/3] Installing Python dependencies...
cd backend\python
python -m pip install -r requirements.txt
if errorlevel 1 (
    echo Failed to install Python dependencies
    echo Try using: pip install -r requirements.txt
    cd ..\..
    pause
    exit /b 1
)
cd ..\..

echo.
echo [3/3] Creating directories...
if not exist "backend\temp" mkdir backend\temp

echo.
echo Installation complete!
echo.
echo To run the application:
echo   npm run dev
echo.
pause

