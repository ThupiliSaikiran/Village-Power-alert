from django.core.management.base import BaseCommand
from core.models import User

class Command(BaseCommand):
    help = 'Create an admin user if not exists'

    def handle(self, *args, **kwargs):
        if not User.objects.filter(mobile='9876543210').exists():
            User.objects.create_superuser(
                mobile='9876543210',
                name='Admin User',
                password='yourpassword'
            )
            self.stdout.write(self.style.SUCCESS('Superuser created!'))
        else:
            self.stdout.write(self.style.WARNING('Superuser already exists.'))
