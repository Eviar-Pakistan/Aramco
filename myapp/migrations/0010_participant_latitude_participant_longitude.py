# Generated by Django 5.1.3 on 2025-02-07 16:15

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('myapp', '0009_userprofile_delete_userloginstatus'),
    ]

    operations = [
        migrations.AddField(
            model_name='participant',
            name='latitude',
            field=models.FloatField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='participant',
            name='longitude',
            field=models.FloatField(blank=True, null=True),
        ),
    ]
