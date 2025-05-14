# ThrillBinge

A full-stack web application for discovering, browsing and streaming movies, built with Next.js and Django.

## Features

- Browse popular movies
- Search movies by title
- View detailed movie information
- Watch movie trailers
- Responsive design for all devices
- Movie recommendations

## Tech Stack

### Frontend
- Next.js 13.5
- TypeScript
- Tailwind CSS
- Shadcn UI Components
- React Query for data fetching

### Backend
- Django 4.2
- Django REST Framework
- SQLite Database
- TMDB API Integration with Bearer Token Authentication
- Django CORS Headers for frontend communication

## Getting Started

### Prerequisites
- Python 3.8+
- Node.js 16+
- npm or yarn
- TMDB API Bearer Token

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Create and apply migrations:
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

5. Set up required data:
   ```bash
   python manage.py setup_industries  # Required before importing any movies
   ```

6. Import movies from TMDB:
   There are several ways to import movies into the database:

   a. Import popular movies (recommended for initial setup):
   ```bash
   python manage.py import_tmdb_movies
   ```
   This will import the current popular movies from TMDB along with their:
   - Basic details (title, overview, release date, etc.)
   - Genres
   - Cast members (top 10 cast members)
   - Crew members (director, writer, etc.)
   - Videos (trailers, teasers)
   - Posters and backdrop images

   b. Import specific movies by name:
   ```bash
   python manage.py import_movie_by_name "Movie Title" --industry "Industry Name"
   ```
   Example:
   ```bash
   python manage.py import_movie_by_name "The Dark Knight" --industry "Hollywood"
   ```

   Note: The industry name is required and must match one of the following:
   - Hollywood
   - Bollywood
   - Korean
   - Japanese
   - Chinese
   - British
   - French
   - German
   - Italian
   - Spanish

   c. Import thriller movies (genre-specific):
   ```bash
   python manage.py import_thriller_movies
   ```
   This will import a curated list of thriller movies.

   Note: Make sure you have set up your TMDB API Bearer token in the .env file:
   ```
   TMDB_BEARER_TOKEN=your_bearer_token_here
   ```

7. Start the Django server:
   ```bash
   python manage.py runserver
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file with:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:8000
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## Project Structure

```
thrillbinge/
├── backend/
│   ├── thrillbinge/     # Django project settings
│   ├── movies/          # Movies app
│   ├── api/            # API endpoints
│   ├── users/          # User management app
│   └── requirements.txt
└── frontend/
    ├── app/            # Next.js pages
    ├── components/     # React components
    ├── lib/           # Utilities and API functions
    └── config/        # Configuration files
```

## API Endpoints

- `GET /api/movies/` - List all movies
- `GET /api/movies/{id}/` - Get movie details
- `GET /api/movies/search/` - Search movies
- `GET /api/movies/{id}/videos/` - Get movie trailers and videos
- `GET /api/movies/{id}/cast/` - Get movie cast information
- `GET /api/movies/{id}/crew/` - Get movie crew information

## Environment Variables

### Backend
- `SECRET_KEY` - Django secret key
- `DEBUG` - Debug mode (True/False)
- `TMDB_BEARER_TOKEN` - TMDB API Bearer Token
- `CORS_ALLOWED_ORIGINS` - List of allowed frontend origins

### Frontend
- `NEXT_PUBLIC_API_URL` - Backend API URL (use http://localhost:8000 instead of 127.0.0.1)

## Models

The backend includes the following main models:
- Movie - Store movie information
- Genre - Movie genres
- Person - Cast and crew information
- MovieCast - Linking table for movie cast members
- MovieCrew - Linking table for movie crew members
- Video - Store movie trailers and video links

## CORS Configuration

The backend is configured to accept requests from the frontend using Django CORS Headers. Make sure the frontend origin is properly set in the Django settings:

```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]
```

## Docker Setup

The project includes Docker configuration for both frontend and backend services, making it easy to deploy and run in any environment.

### Docker Files Structure
```
thrillbinge/
├── backend/
│   └── Dockerfile        # Django backend configuration
├── frontend/
│   └── Dockerfile        # Next.js frontend configuration
└── docker-compose.yml    # Services orchestration
```

### Backend Dockerfile
The backend service uses Python 3.8 slim image and includes:
```dockerfile
# Use Python 3.8 slim image as base
FROM python:3.8-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Set work directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy project files
COPY . .

# Run migrations and collect static files
RUN python manage.py collectstatic --noinput

# Expose port
EXPOSE 8000

# Start command
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "thrillbinge.wsgi:application"]
```

### Frontend Dockerfile
The frontend service uses a multi-stage build process with Node.js 16:
```dockerfile
# Build stage
FROM node:16-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy project files
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:16-alpine AS runner

WORKDIR /app

# Copy built assets from builder
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/public ./public

# Expose port
EXPOSE 3000

# Start command
CMD ["npm", "start"]
```

### Docker Compose Configuration
The `docker-compose.yml` file orchestrates both services:
```yaml
version: '3.8'

services:
  backend:
    build: 
      context: ./backend
      dockerfile: Dockerfile
    volumes:
      - ./backend:/app
      - static_volume:/app/staticfiles
      - media_volume:/app/mediafiles
    environment:
      - DEBUG=1
      - DJANGO_SECRET_KEY=your-secret-key-here
      - TMDB_BEARER_TOKEN=${TMDB_BEARER_TOKEN}
      - CORS_ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
    ports:
      - "8000:8000"
    command: >
      sh -c "python manage.py migrate &&
             python manage.py setup_industries &&
             python manage.py runserver 0.0.0.0:8000"

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    volumes:
      - ./frontend:/app
      - /app/node_modules
      - /app/.next
    environment:
      - NEXT_PUBLIC_API_URL=http://backend:8000
    ports:
      - "3000:3000"
    depends_on:
      - backend

volumes:
  static_volume:
  media_volume:
```

### Running with Docker

1. Create a `.env` file in the root directory:
   ```
   TMDB_BEARER_TOKEN=your_token_here
   ```

2. Build and start the services:
   ```bash
   docker-compose up --build
   ```

3. Run in detached mode:
   ```bash
   docker-compose up -d
   ```

4. Stop the services:
   ```bash
   docker-compose down
   ```

### Important Notes

- Backend service automatically runs:
  - Database migrations
  - Industry setup
  - Django development server
- Frontend service is accessible at http://localhost:3000
- Backend API is accessible at http://localhost:8000
- Static and media files are persisted using Docker volumes
- Development mode is enabled by default

### Production Deployment

For production deployment, consider the following modifications:

1. Environment Settings:
   - Set `DEBUG=0` in backend environment
   - Use a secure `DJANGO_SECRET_KEY`
   - Configure proper SSL/TLS
   - Set up proper logging

2. Database:
   - Add a production-ready database service
   - Configure database backups

3. Web Server:
   - Add Nginx as a reverse proxy
   - Configure proper SSL termination
   - Set up proper static file serving

4. Security:
   - Review and secure environment variables
   - Implement rate limiting
   - Set up proper firewall rules

## Contributing

1. Fork the repository
2. Create a new branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 