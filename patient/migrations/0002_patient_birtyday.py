# Generated by Django 4.0.6 on 2022-08-12 17:35

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('patient', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='patient',
            name='birtyday',
            field=models.DateField(default=datetime.datetime.now),
        ),
    ]
