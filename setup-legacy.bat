@echo off
echo ======================================
echo JD Emirates Auction Bot - Setup with Legacy Peer Deps
echo ======================================
echo.

REM Check if node is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed. Please install Node.js 16+ first.
    pause
    exit /b 1
)

echo Node.js version:
node -v
echo.

echo npm version:
npm -v
echo.

REM Install dependencies with legacy peer deps
echo Installing dependencies with legacy peer deps flag...
call npm install --legacy-peer-deps
echo.

REM Copy environment file
if not exist .env (
    echo Creating .env file from .env.example...
    copy .env.example .env
    echo WARNING: Please update .env with your WordPress API URL
)
echo.

echo ======================================
echo Setup complete!
echo.
echo You can now run:
echo   npm run dev
echo ======================================
pause
