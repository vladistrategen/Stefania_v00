from django.db import models

# Create your models here.

class Doctor_Procedure(models.Model):
    doctorID = models.ForeignKey('doctors.Doctor', on_delete=models.CASCADE)
    procedureID = models.ForeignKey('procedure.Procedure', on_delete=models.CASCADE)