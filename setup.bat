@echo off
echo ======================================
echo JD Emirates Auction Bot - React WebApp Setup
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

REM Check if npm is installed
where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo ERROR: npm is not installed. Please install npm first.
    pause
    exit /b 1
)

echo npm version:
npm -v
echo.

REM Install dependencies
echo Installing dependencies...
call npm install
echo.

REM Copy environment file
if not exist .env (
    echo Creating .env file from .env.example...
    copy .env.example .env
    echo WARNING: Please update .env with your WordPress API URL
)
echo.

REM Build the project
echo Building the project...
call npm run build
echo.

echo ======================================
echo Setup complete!
echo.
echo Next steps:
echo 1. Update .env with your WordPress API URL
echo 2. Run 'npm run dev' to start the development server
echo 3. Open http://localhost:3000 in your browser
echo.
echo For production deployment, use the files in the 'dist' folder
echo ======================================
pause
