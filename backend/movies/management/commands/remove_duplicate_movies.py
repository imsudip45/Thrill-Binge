from django.core.management.base import BaseCommand
from django.db.models import Count, Q
from movies.models import Movie
from django.db import transaction

class Command(BaseCommand):
    help = 'Remove duplicate movies while keeping the most complete entries'

    def add_arguments(self, parser):
        parser.add_argument(
            '--dry-run',
            action='store_true',
            help='Show what would be deleted without actually deleting'
        )

    def get_completeness_score(self, movie):
        """Calculate a completeness score for the movie based on related data."""
        score = 0
        
        # Add weighted points for non-empty fields
        if movie.overview and len(movie.overview.strip()) > 10:
            score += 2  # Higher weight for good overview
        if movie.poster_path:
            score += 2
        if movie.backdrop_path:
            score += 1
        if movie.release_date:
            score += 2
        if movie.industry:
            score += 2
        if movie.rating > 0:
            score += 1
        if movie.popularity > 0:
            score += 1
        
        # Add weighted points for related data
        score += movie.genres.count() * 2
        score += movie.cast.count() * 2
        score += movie.crew.count() * 2
        score += movie.videos.count() * 3  # Higher weight for videos
        
        return score

    @transaction.atomic
    def handle(self, *args, **options):
        dry_run = options['dry_run']
        
        # Find movies with duplicate TMDB IDs
        duplicate_groups = (
            Movie.objects.values('tmdb_id')
            .annotate(count=Count('id'))
            .filter(count__gt=1)
            .exclude(tmdb_id__isnull=True)  # Exclude movies without TMDB IDs
        )

        total_duplicates = 0
        total_removed = 0

        for group in duplicate_groups:
            tmdb_id = group['tmdb_id']
            duplicates = Movie.objects.filter(tmdb_id=tmdb_id).order_by('id')
            
            self.stdout.write(f"\nFound {duplicates.count()} duplicates for TMDB ID: {tmdb_id}")
            total_duplicates += duplicates.count() - 1

            # Score each duplicate
            scored_duplicates = [
                (movie, self.get_completeness_score(movie))
                for movie in duplicates
            ]
            
            # Sort by completeness score (highest first)
            scored_duplicates.sort(key=lambda x: x[1], reverse=True)
            
            # Keep the most complete entry
            keeper = scored_duplicates[0][0]
            to_delete = [movie for movie, _ in scored_duplicates[1:]]
            
            self.stdout.write(
                f"Keeping: {keeper.title} (ID: {keeper.id}, TMDB ID: {keeper.tmdb_id}, "
                f"Score: {scored_duplicates[0][1]})"
            )
            
            for movie in to_delete:
                if dry_run:
                    self.stdout.write(
                        f"Would delete: {movie.title} (ID: {movie.id}, TMDB ID: {movie.tmdb_id}, "
                        f"Score: {self.get_completeness_score(movie)})"
                    )
                else:
                    self.stdout.write(
                        f"Deleting: {movie.title} (ID: {movie.id}, TMDB ID: {movie.tmdb_id}, "
                        f"Score: {self.get_completeness_score(movie)})"
                    )
                    movie.delete()
                    total_removed += 1

        # Also check for movies with same title and release date but different TMDB IDs
        title_date_duplicates = (
            Movie.objects.values('title', 'release_date')
            .annotate(count=Count('id'))
            .filter(count__gt=1)
            .exclude(release_date__isnull=True)
        )

        for group in title_date_duplicates:
            title = group['title']
            release_date = group['release_date']
            duplicates = Movie.objects.filter(
                title=title,
                release_date=release_date
            ).order_by('id')
            
            if duplicates.count() > 1:
                self.stdout.write(
                    f"\nFound {duplicates.count()} potential duplicates "
                    f"for title: {title} ({release_date})"
                )
                total_duplicates += duplicates.count() - 1

                scored_duplicates = [
                    (movie, self.get_completeness_score(movie))
                    for movie in duplicates
                ]
                scored_duplicates.sort(key=lambda x: x[1], reverse=True)
                
                keeper = scored_duplicates[0][0]
                to_delete = [movie for movie, _ in scored_duplicates[1:]]
                
                self.stdout.write(
                    f"Keeping: {keeper.title} (ID: {keeper.id}, TMDB ID: {keeper.tmdb_id}, "
                    f"Score: {scored_duplicates[0][1]})"
                )
                
                for movie in to_delete:
                    if dry_run:
                        self.stdout.write(
                            f"Would delete: {movie.title} (ID: {movie.id}, "
                            f"TMDB ID: {movie.tmdb_id}, Score: {self.get_completeness_score(movie)})"
                        )
                    else:
                        self.stdout.write(
                            f"Deleting: {movie.title} (ID: {movie.id}, "
                            f"TMDB ID: {movie.tmdb_id}, Score: {self.get_completeness_score(movie)})"
                        )
                        movie.delete()
                        total_removed += 1

        if dry_run:
            self.stdout.write(
                self.style.SUCCESS(
                    f"\nDRY RUN - Found {total_duplicates} duplicates that would be removed"
                )
            )
        else:
            self.stdout.write(
                self.style.SUCCESS(
                    f"\nSuccessfully removed {total_removed} duplicate movies"
                )
            ) 