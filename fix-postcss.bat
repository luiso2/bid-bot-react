@echo off
echo Fixing PostCSS configuration...

REM Rename postcss.config.js if it exists
if exist postcss.config.js (
    echo Renaming postcss.config.js to postcss.config.js.old
    rename postcss.config.js postcss.config.js.old
)

REM Ensure postcss.config.cjs exists
if not exist postcss.config.cjs (
    echo Creating postcss.config.cjs...
    echo module.exports = { > postcss.config.cjs
    echo   plugins: { >> postcss.config.cjs
    echo     tailwindcss: {}, >> postcss.config.cjs
    echo     autoprefixer: {}, >> postcss.config.cjs
    echo   }, >> postcss.config.cjs
    echo } >> postcss.config.cjs
)

echo PostCSS configuration fixed!
echo.
echo You can now run: npm run dev
pause
