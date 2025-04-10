from django.db import migrations
from django.core.management import call_command

def run_seed_command(apps, schema_editor):
    call_command('seed') 

class Migration(migrations.Migration):

    dependencies = [
        ('blog', '0001_initial'),
    ]

    operations = [
        migrations.RunPython(run_seed_command)
    ]
