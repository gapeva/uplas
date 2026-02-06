# Uplas - AI Learning Platform

Uplas is an AI-powered learning platform that empowers professionals and students to upskill or reskill with personalized AI learning.

## Project Structure

```
Uplas/
├── frontend/     # Modern React/Vite frontend
├── uplasbackend/       # Django REST API backend

## Quick Start

### Prerequisites

- Python 3.11+
- Node.js 18+
- MySQL 8.0+ (optional, SQLite for dev)

### Backend Setup

```bash
cd uplasbackend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Copy environment file
cp .env.example .env

# Run migrations
python manage.py migrate

# Create superuser (optional)
python manage.py createsuperuser

# Start server
python manage.py runserver
```

Backend runs at: `http://localhost:8000`

### Frontend Setup

```bash
cd frontend-react

# Install dependencies
npm install

# Copy environment file
cp .env.example .env.local

# Start development server
npm run dev
```

Frontend runs at: `http://localhost:5173`

## Docker Deployment

```bash
cd uplasbackend

# Build and run with Docker Compose
docker-compose up -d

# View logs
docker-compose logs -f
```

## API Endpoints

### Authentication
- `POST /api/v1/auth/register/` - User registration
- `POST /api/v1/auth/login/` - User login
- `POST /api/v1/auth/token/refresh/` - Refresh JWT token
- `GET /api/v1/auth/profile/` - Get user profile

### AI Services
- `GET /api/v1/ai/health/` - AI service health check
- `POST /api/v1/ai/nlp-tutor/` - NLP Tutor interaction
- `POST /api/v1/ai/project-generator/` - Generate project ideas
- `POST /api/v1/ai/project-assessment/` - Assess project submissions
- `POST /api/v1/ai/tts/` - Text-to-Speech
- `POST /api/v1/ai/ttv/` - Text-to-Video

### Core Resources
- `/api/v1/courses/` - Course management
- `/api/v1/projects/` - Project management
- `/api/v1/community/` - Community features
- `/api/v1/blog/` - Blog posts
- `/api/v1/payments/` - Payment & subscriptions

### Health Check
- `GET /api/v1/health/` - System health check

## Environment Variables

### Backend (.env)

```env
DJANGO_SECRET_KEY=your-secret-key
DEBUG=True
DB_ENGINE=sqlite  # or mysql
MYSQL_DATABASE=uplas_db
MYSQL_USER=uplas_user
MYSQL_PASSWORD=password
CORS_ALLOWED_ORIGINS=http://localhost:5173
STRIPE_KEY=sk_test_...
```

### Frontend (.env.local)

```env
VITE_API_URL=http://localhost:8000/api
```

## Tech Stack

### Backend
- Django 4.2
- Django REST Framework
- SimpleJWT Authentication
- MySQL / SQLite
- Gunicorn
- Docker

### Frontend
- React 18
- Vite
- TailwindCSS
- Zustand
- React Router
- i18next

## Deployment

### Frontend (Vercel)
1. Connect repository to Vercel
2. Set `VITE_API_URL` environment variable
3. Deploy

### Backend (Sevalla/Digital Ocean)
1. Build Docker image
2. Deploy with docker-compose
3. Configure environment variables
4. Set up MySQL database

## Contributing

1. Create a feature branch
2. Make changes
3. Submit a pull request

## License

Proprietary - Uplas EdTech Solutions Ltd.
