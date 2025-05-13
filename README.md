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
   python manage.py import_movie_by_name "Movie Title"
   ```
   Example:
   ```bash
   python manage.py import_movie_by_name "The Dark Knight"
   ```

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

## Contributing

1. Fork the repository
2. Create a new branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 