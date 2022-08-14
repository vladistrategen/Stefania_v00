
from datetime import datetime
from django.db import models

# Create your models here.

#create a patient model storing first name, last name, email and phone number

class Patient(models.Model):
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30)
    birtyday = models.DateField(default=datetime.now)
    
    phone_number = models.CharField(max_length=15)

    def __str__(self):
        return self.first_name + " " + self.last_name
