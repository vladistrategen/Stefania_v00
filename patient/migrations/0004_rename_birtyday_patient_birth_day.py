# Generated by Django 4.0.6 on 2022-08-22 13:09

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('patient', '0003_remove_patient_email'),
    ]

    operations = [
        migrations.RenameField(
            model_name='patient',
            old_name='birtyday',
            new_name='birth_day',
        ),
    ]
