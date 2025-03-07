#!/usr/bin/env python
"""
Setup script for Rival Radar AI backend.
This script will:
1. Create necessary app directories if they don't exist
2. Create necessary __init__.py files
3. Create a SQLite database for development (if PostgreSQL is not available)
4. Run migrations
5. Create a superuser
"""
import os
import sys
import subprocess
import django
from pathlib import Path

# Ensure we're in the correct directory
BASE_DIR = Path(__file__).resolve().parent

def create_sqlite_env():
    """Create a .env file for SQLite if it doesn't exist"""
    env_path = BASE_DIR / '.env'
    
    if not env_path.exists():
        with open(env_path, 'w') as f:
            f.write("DEBUG=True\n")
            f.write("SECRET_KEY=django-insecure-key-for-development-only\n")
            f.write("DATABASE_URL=sqlite:///db.sqlite3\n")
            f.write("GEMINI_API_KEY=your-gemini-api-key\n")
        print("Created .env file with SQLite configuration")
    else:
        # Update the DATABASE_URL to use SQLite
        with open(env_path, 'r') as f:
            lines = f.readlines()
        
        with open(env_path, 'w') as f:
            for line in lines:
                if line.startswith('DATABASE_URL='):
                    f.write("DATABASE_URL=sqlite:///db.sqlite3\n")
                else:
                    f.write(line)
        print("Updated .env file to use SQLite")

def run_migrations():
    """Run Django migrations"""
    print("Running migrations...")
    subprocess.run([sys.executable, 'manage.py', 'makemigrations', 'users'])
    subprocess.run([sys.executable, 'manage.py', 'makemigrations', 'competitors'])
    subprocess.run([sys.executable, 'manage.py', 'makemigrations', 'analysis'])
    subprocess.run([sys.executable, 'manage.py', 'migrate'])

def create_superuser():
    """Create a superuser for the admin interface"""
    print("\nCreating superuser...")
    subprocess.run([sys.executable, 'manage.py', 'createsuperuser'])

def main():
    # Check if we should use SQLite instead of PostgreSQL
    use_sqlite = input("Do you want to use SQLite instead of PostgreSQL? (y/n): ").lower() == 'y'
    
    if use_sqlite:
        create_sqlite_env()
    
    # Run migrations
    run_migrations()
    
    # Create superuser
    create_superuser_choice = input("\nDo you want to create a superuser? (y/n): ").lower() == 'y'
    if create_superuser_choice:
        create_superuser()
    
    print("\nSetup complete! You can now run the server with:")
    print("python manage.py runserver")

if __name__ == "__main__":
    main() 