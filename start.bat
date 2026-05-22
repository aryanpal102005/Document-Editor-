@echo off
echo ========================================
echo   CollabEdit Pro - Starting Servers
echo ========================================
echo.

echo [1/3] Checking MongoDB...
tasklist /FI "IMAGENAME eq mongod.exe" 2>NUL | find /I /N "mongod.exe">NUL
if "%ERRORLEVEL%"=="0" (
    echo MongoDB is already running
) else (
    echo Starting MongoDB...
    start "MongoDB" mongod --dbpath="C:\data\db"
    timeout /t 3 /nobreak >nul
)

echo.
echo [2/3] Starting Backend Server...
start "Backend Server" cmd /k "cd backend && npm start"

echo.
echo [3/3] Starting Frontend...
timeout /t 5 /nobreak >nul
start "Frontend" cmd /k "cd frontend && npm start"

echo.
echo ========================================
echo   All servers started successfully!
echo   Backend:  http://localhost:5000
echo   Frontend: http://localhost:3000
echo ========================================
echo.
pause
