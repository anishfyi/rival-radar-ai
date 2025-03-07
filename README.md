# Rival Radar AI

An AI-powered competitor analysis platform that leverages Google's Gemini AI to provide strategic insights and competitive intelligence.

## Features

- 🔍 Intelligent competitor data collection and analysis
- 🤖 Gemini AI-powered insights generation
- 📊 Interactive visualization dashboard
- 📈 Competitive positioning and market analysis
- 🔒 Secure data handling and user authentication

## Tech Stack

### Frontend
- Next.js 14 (React)
- Tailwind CSS
- Recharts for data visualization
- Redux Toolkit for state management

### Backend
- Django REST framework
- PostgreSQL
- Celery for async tasks
- Google Gemini AI API

## Getting Started

### Prerequisites
- Node.js 18+
- Python 3.9+
- PostgreSQL
- Google Gemini API key

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/rival-radar-ai.git
cd rival-radar-ai
```

2. Set up the frontend:
```bash
cd frontend
npm install
npm run dev
```

3. Set up the backend:
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: .\venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

4. Set up environment variables:
Create `.env` files in both frontend and backend directories with the necessary configuration.

## Environment Variables

### Backend (.env)
```
DEBUG=True
SECRET_KEY=your-secret-key
DATABASE_URL=postgresql://user:password@localhost:5432/rivalradar
GEMINI_API_KEY=your-gemini-api-key
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 