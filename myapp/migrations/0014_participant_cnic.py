# Generated by Django 5.1.3 on 2025-02-07 18:30

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('myapp', '0013_participant_city'),
    ]

    operations = [
        migrations.AddField(
            model_name='participant',
            name='cnic',
            field=models.CharField(blank=True, max_length=50, null=True),
        ),
    ]
