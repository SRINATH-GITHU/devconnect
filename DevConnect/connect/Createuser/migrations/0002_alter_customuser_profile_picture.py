# Generated by Django 5.1.4 on 2025-01-29 11:30

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Createuser', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='customuser',
            name='profile_picture',
            field=models.ImageField(blank=True, null=True, upload_to='profile_pics/'),
        ),
    ]
