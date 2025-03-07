# Rival Radar AI Backend

This is the backend for the Rival Radar AI application, built with Django and Django REST Framework.

## Setup Instructions

### Prerequisites
- Python 3.9+
- PostgreSQL (optional, SQLite can be used for development)
- Google Gemini API key

### Option 1: Automated Setup

#### For Linux/macOS:
```bash
# Navigate to the backend directory
cd backend

# Make the setup script executable
chmod +x setup.sh

# Run the setup script
./setup.sh
```

#### For Windows:
```bash
# Navigate to the backend directory
cd backend

# Run the setup script
setup.bat
```

### Option 2: Manual Setup

1. Create and activate a virtual environment:
```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Configure environment variables:
   - Create a `.env` file in the backend directory with the following variables:
   ```
   DEBUG=True
   SECRET_KEY=your-secret-key
   DATABASE_URL=sqlite:///db.sqlite3  # For SQLite
   # Or for PostgreSQL:
   # DATABASE_URL=postgresql://user:password@localhost:5432/rivalradar
   GEMINI_API_KEY=your-gemini-api-key
   ```

4. Run migrations:
```bash
python manage.py makemigrations users
python manage.py makemigrations competitors
python manage.py makemigrations analysis
python manage.py migrate
```

5. Create a superuser:
```bash
python manage.py createsuperuser
```

6. Run the development server:
```bash
python manage.py runserver
```

## API Endpoints

- `/api/auth/` - Authentication endpoints
- `/api/auth/registration/` - User registration
- `/api/competitors/` - Competitor management
- `/api/analysis/` - Analysis and insights
- `/api/users/` - User management

## Troubleshooting

### Database Connection Issues
If you're having trouble connecting to PostgreSQL, you can use SQLite for development:
1. Update the `DATABASE_URL` in your `.env` file to `sqlite:///db.sqlite3`
2. Run migrations again

### Missing Dependencies
If you encounter errors about missing dependencies, try:
```bash
pip install -r requirements.txt --upgrade
```

### Permission Issues
If you encounter permission issues when running the setup scripts, make sure they are executable:
```bash
chmod +x setup.sh
``` 