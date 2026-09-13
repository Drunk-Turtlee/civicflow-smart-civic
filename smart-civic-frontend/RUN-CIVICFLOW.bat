@echo off
setlocal
cd /d "%~dp0"
echo.
echo ============================================
echo       CivicFlow Frontend Launcher
echo ============================================
echo.
if not exist node_modules (
  echo First run: installing dependencies...
  echo This can take a few minutes.
  call npm install
  if errorlevel 1 (
    echo.
    echo npm install failed. Please open PowerShell in this folder and run npm install.
    pause
    exit /b 1
  )
)
echo.
echo Starting CivicFlow...
call npm run dev
pause
