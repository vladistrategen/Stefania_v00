from django.db import models

# Create your models here.

class Appointment_Procedure(models.Model):
    appointmentID = models.ForeignKey('appointment.Appointment', on_delete=models.CASCADE)
    # procedureID field has only the procedures that are associated with the doctor of the appointment
    procedureID = models.ForeignKey('procedure.Procedure', on_delete=models.CASCADE)
    