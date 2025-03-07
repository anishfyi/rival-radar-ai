#!/bin/bash

# Exit on error
set -e

echo "Setting up Rival Radar AI backend..."

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "Python 3 is not installed. Please install Python 3 and try again."
    exit 1
fi

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "Activating virtual environment..."
source venv/bin/activate || source venv/Scripts/activate

# Install dependencies
echo "Installing dependencies..."
pip install -r requirements.txt

# Run setup script
echo "Running setup script..."
python setup.py

echo "Setup complete! You can now run the server with:"
echo "source venv/bin/activate  # or venv\\Scripts\\activate on Windows"
echo "python manage.py runserver" 