@echo off
echo 🔄 RESTARTING DEVELOPMENT SERVERS
echo.

echo [1/4] This will restart both backend and frontend servers
echo.

echo [2/4] Instructions:
echo.
echo After this script runs, you'll need to:
echo 1. Start Backend: Open a terminal and run "cd backend && node server.js"
echo 2. Start Frontend: Open another terminal and run "cd frontend && pnpm run dev"
echo.

echo [3/4] Checking if servers are running...
echo.

tasklist /FI "IMAGENAME eq node.exe" 2>NUL | find /I /N "node.exe">NUL
if "%ERRORLEVEL%"=="0" (
    echo Node processes found. Stopping...
    taskkill /F /IM node.exe >NUL 2>&1
    echo ✅ Node processes stopped
) else (
    echo No Node processes running
)

echo.
echo [4/4] Ready to start fresh!
echo.

echo ========================================
echo TO START SERVERS:
echo ========================================
echo.
echo Terminal 1 (Backend):
echo   cd backend
echo   node server.js
echo.
echo Terminal 2 (Frontend):
echo   cd frontend
echo   pnpm run dev
echo.
echo ========================================
echo.
echo After starting, open: http://localhost:5173
echo.
pause
