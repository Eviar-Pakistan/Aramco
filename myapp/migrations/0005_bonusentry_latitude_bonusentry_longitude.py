# Generated by Django 5.1.3 on 2025-02-06 16:32

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('myapp', '0004_rename_fuel_bonusentry_entries'),
    ]

    operations = [
        migrations.AddField(
            model_name='bonusentry',
            name='latitude',
            field=models.FloatField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='bonusentry',
            name='longitude',
            field=models.FloatField(blank=True, null=True),
        ),
    ]
