from django.core.management.base import BaseCommand
from movies.models import Industry

class Command(BaseCommand):
    help = 'Set up initial movie industries'

    def handle(self, *args, **options):
        industries = [
            {
                'name': 'Hollywood',
                'description': 'American film industry based in Hollywood, Los Angeles',
            },
            {
                'name': 'Bollywood',
                'description': 'Hindi-language film industry based in Mumbai, India',
            },
            {
                'name': 'South Indian',
                'description': 'Film industries of South India including Tamil, Telugu, Malayalam, and Kannada cinema',
            }
        ]

        for industry_data in industries:
            industry, created = Industry.objects.get_or_create(
                name=industry_data['name'],
                defaults={'description': industry_data['description']}
            )
            if created:
                self.stdout.write(
                    self.style.SUCCESS(f'Successfully created industry: {industry.name}')
                )
            else:
                self.stdout.write(
                    self.style.WARNING(f'Industry already exists: {industry.name}')
                ) 