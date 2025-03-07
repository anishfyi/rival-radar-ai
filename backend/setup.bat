@echo off
echo Setting up Rival Radar AI backend...

REM Check if Python is installed
python --version >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo Python is not installed or not in PATH. Please install Python and try again.
    exit /b 1
)

REM Check if virtual environment exists
if not exist venv (
    echo Creating virtual environment...
    python -m venv venv
)

REM Activate virtual environment
echo Activating virtual environment...
call venv\Scripts\activate.bat

REM Install dependencies
echo Installing dependencies...
pip install -r requirements.txt

REM Run setup script
echo Running setup script...
python setup.py

echo.
echo Setup complete! You can now run the server with:
echo call venv\Scripts\activate.bat
echo python manage.py runserver 