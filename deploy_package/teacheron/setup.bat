@echo off
echo =========================================
echo TeacherOn Application Setup
echo =========================================
echo This script will help you set up the TeacherOn application locally.
echo.

REM Check Node.js installation
WHERE node >nul 2>nul
IF %ERRORLEVEL% NEQ 0 (
    echo X Node.js is not installed. Please install Node.js version 18 or newer.
    echo   Download from: https://nodejs.org/
    exit /b
)

FOR /F "tokens=1,2,3 delims=v." %%a IN ('node -v') DO (
    SET NODE_VERSION=%%b
)

IF %NODE_VERSION% LSS 18 (
    echo X Node.js version %NODE_VERSION% detected. Version 18 or newer is required.
    echo   Please upgrade your Node.js installation.
    exit /b
)

echo ✓ Node.js %NODE_VERSION% detected

REM Install dependencies
echo.
echo Installing dependencies... (this may take a few minutes)
call npm install

REM Check if .env file exists, if not create from example
IF NOT EXIST .env (
    echo.
    echo Creating .env file from example...
    copy .env.example .env
    echo ⚠ Please update the .env file with your database credentials before proceeding.
    echo   Edit the .env file in your favorite text editor.
    echo.
    echo Press Enter when you've updated the .env file or Ctrl+C to exit...
    pause >nul
)

REM Start the application
echo.
echo =========================================
echo Setup complete! You can now start the application with:
echo npm run dev
echo.
echo The application will be available at http://localhost:5000
echo Admin credentials:
echo   Username: admin
echo   Password: admin123
echo =========================================

pause