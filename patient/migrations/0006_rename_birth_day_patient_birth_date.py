# Generated by Django 4.0.6 on 2022-08-22 13:53

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('patient', '0005_patient_middle_name'),
    ]

    operations = [
        migrations.RenameField(
            model_name='patient',
            old_name='birth_day',
            new_name='birth_date',
        ),
    ]
