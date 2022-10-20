from django.db import models
from patient.models import Patient
# Create your models here.

# doctor model that stores the first name, last name, email and phone number and has a many to many relationship with patient
class Doctor(models.Model):
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30)
    email = models.EmailField(max_length=254)
    phone_number = models.CharField(max_length=15)
    # preferred color for the doctor takes a hex value
    preferred_color = models.CharField(max_length=7, default="#FFFFFF")

    def __str__(self):
        return self.first_name + " " + self.last_name