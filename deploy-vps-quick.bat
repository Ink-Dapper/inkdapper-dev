@echo off
REM =============================================================================
REM InkDapper -- Quick VPS Deploy (Windows)
REM Pulls latest git code, rebuilds frontend + admin, restarts backend via PM2.
REM
REM Usage: double-click or run from CMD in the project root.
REM =============================================================================

set VPS_HOST=srv693737
set VPS_USER=root
set PROJECT_PATH=/var/www/inkdapper-dev
set PM2_APP=inkdapper-api

echo.
echo ==== InkDapper Quick Deploy ====
echo   VPS : %VPS_USER%@%VPS_HOST%
echo   Dir : %PROJECT_PATH%
echo.

REM Check SSH
echo [1/6] Checking SSH connection...
ssh -o ConnectTimeout=10 -o BatchMode=yes %VPS_USER%@%VPS_HOST% "echo SSH OK"
if errorlevel 1 (
    echo ERROR: Cannot connect via SSH. Check your key / VPS host.
    pause
    exit /b 1
)

REM Pull latest code from git (no more manual SCP of individual files)
echo.
echo [2/6] Pulling latest code from git...
ssh %VPS_USER%@%VPS_HOST% "cd %PROJECT_PATH% && git fetch --all && git pull origin main && echo GIT OK"
if errorlevel 1 (
    echo ERROR: git pull failed on VPS.
    pause
    exit /b 1
)

REM Install backend dependencies
echo.
echo [3/6] Installing backend dependencies...
ssh %VPS_USER%@%VPS_HOST% "cd %PROJECT_PATH%/backend && npm install --omit=dev && echo BACKEND DEPS OK"

REM Build admin panel
echo.
echo [4/6] Building admin panel...
ssh %VPS_USER%@%VPS_HOST% "cd %PROJECT_PATH%/admin && npm install && npm run build && echo ADMIN BUILD OK"
if errorlevel 1 (
    echo ERROR: Admin build failed.
    pause
    exit /b 1
)

REM Build frontend
echo.
echo [5/6] Building frontend...
ssh %VPS_USER%@%VPS_HOST% "cd %PROJECT_PATH%/frontend && npm install && npm run build && echo FRONTEND BUILD OK"
if errorlevel 1 (
    echo ERROR: Frontend build failed.
    pause
    exit /b 1
)

REM Restart backend with PM2
echo.
echo [6/6] Restarting backend (PM2)...
ssh %VPS_USER%@%VPS_HOST% "cd %PROJECT_PATH% && (pm2 describe %PM2_APP% > /dev/null 2>&1 && pm2 reload %PM2_APP% --update-env || (pm2 start ecosystem.config.cjs --env production && pm2 save)) && echo PM2 OK"

REM Health check
echo.
echo Checking API health...
timeout /t 4 /nobreak > nul
curl -s -o nul -w "API HTTP status: %%{http_code}" https://api.inkdapper.com/api/test
echo.

echo.
echo ==== Deployment complete! ====
echo   Site  : https://www.inkdapper.com
echo   Admin : https://admin.inkdapper.com
echo   API   : https://api.inkdapper.com
echo.
echo   Logs  : ssh %VPS_USER%@%VPS_HOST% "pm2 logs %PM2_APP% --lines 50"
echo.
pause
