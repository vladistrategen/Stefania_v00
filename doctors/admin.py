from django.contrib import admin

# Register your models here.

#register doctor model
from doctors.models import Doctor
admin.site.register(Doctor)
