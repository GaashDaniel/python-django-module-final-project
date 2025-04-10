from django.core.management.base import BaseCommand
from django.contrib.auth.models import User, Group, Permission
from blog.models import Article, Comment

class Command(BaseCommand):
    help = 'Seed the database with initial data'

    def handle(self, *args, **kwargs):
        self.stdout.write('Seeding the database...')

        user1, created = User.objects.get_or_create(username='admin',is_staff=True, is_superuser=True)
        if created:
            user1.set_password('admin123456')
            user1.save()

        user2, created = User.objects.get_or_create(username='bob', is_staff=True)
        if created:
            user2.set_password('password123')
            user2.save()

        user3, created = User.objects.get_or_create(username='john')

        if created:
            user3.set_password('password123')
            user3.save()

        article1 = Article.objects.create(
            title='Welcome to ArticleHub',
            content='This is the first article on the platform.',
            author=user1,
        )
        article1.tags.set(['intro', 'news'])
        article1.save()

        article2 = Article.objects.create(
            title='Django Tips & Tricks',
            content='Learn some cool things about Django.',
            author=user2,
        )
        article2.tags.set(['django,development'])
        article2.save()

        Comment.objects.create(content='Great article!', user=user2, article=article1)
        Comment.objects.create(content='Thanks for sharing!', user=user1, article=article1)
        Comment.objects.create(content='Wow!', user=user3, article=article1)

        Comment.objects.create(content='Very helpful tips.', user=user1, article=article2)
        Comment.objects.create(content='Love Django!', user=user2, article=article2)
        Comment.objects.create(content='Thank you!!!', user=user3, article=article2)

        print("Seed completed successfully.")