# Movie Database Project

A full-stack web application for browsing and searching movies, built with Next.js and Django.

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
- TMDB API Integration

## Getting Started

### Prerequisites
- Python 3.8+
- Node.js 16+
- npm or yarn

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

4. Run migrations:
   ```bash
   python manage.py migrate
   ```

5. Start the Django server:
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
project_movie/
├── backend/
│   ├── movie_site/      # Django project settings
│   ├── movies/          # Movies app
│   ├── api/            # API endpoints
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

## Environment Variables

### Backend
- `SECRET_KEY` - Django secret key
- `DEBUG` - Debug mode (True/False)
- `TMDB_API_KEY` - TMDB API key

### Frontend
- `NEXT_PUBLIC_API_URL` - Backend API URL

## Contributing

1. Fork the repository
2. Create a new branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 