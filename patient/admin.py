from django.contrib import admin

# Register your models here.
#register the patient model
from patient.models import Patient
admin.site.register(Patient)
    