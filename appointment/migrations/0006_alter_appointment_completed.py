# Generated by Django 4.1.1 on 2022-10-07 20:57

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('appointment', '0005_alter_appointment_completed'),
    ]

    operations = [
        migrations.AlterField(
            model_name='appointment',
            name='completed',
            field=models.BooleanField(default=False),
        ),
    ]
