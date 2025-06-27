@echo off
echo ======================================
echo Cleaning and reinstalling dependencies
echo ======================================
echo.

REM Remove node_modules and lock files
echo Removing node_modules...
if exist node_modules rmdir /s /q node_modules
echo.

echo Removing package-lock.json...
if exist package-lock.json del package-lock.json
echo.

echo Removing .vite cache...
if exist "node_modules\.vite" rmdir /s /q "node_modules\.vite"
echo.

REM Clear npm cache
echo Clearing npm cache...
call npm cache clean --force
echo.

REM Install dependencies
echo Installing dependencies...
call npm install
echo.

echo ======================================
echo Clean install complete!
echo.
echo You can now run:
echo   npm run dev
echo ======================================
pause
