import imp
from django.db import models
from django.utils import timezone
# Create your models here.
# appointment model for storing the date, time and doctor and patient and confirmation status and status
class Appointment(models.Model):
    date = models.DateField()
    time = models.TimeField()
    doctor = models.ForeignKey('doctors.Doctor', on_delete=models.CASCADE)
    patient = models.ForeignKey('patient.Patient', on_delete=models.CASCADE)
    #confirmation_status = models.CharField(max_length=20, choices=)
    completed = models.BooleanField(default=False)
    description = models.TextField(default="")
    duration_in_minutes = models.IntegerField(default=0)
    price=models.IntegerField(default=0)
    

    STATUS_PENDING_SENT = "pending_sent"
    STATUS_PENDING_NOT_SENT = "pending_not_sent"
    STATUS_CONFIRMED = "confirmed"
    STATUS_CANCELED = "canceled"
    STATUS_CHOICES = (
        (STATUS_PENDING_SENT, "Pending Sent"),
        (STATUS_PENDING_NOT_SENT, "Pending Not Sent"),
        (STATUS_CONFIRMED, "Confirmed"),
        (STATUS_CANCELED, "Canceled"),
    )

    confirmation_status=models.CharField(max_length=20, choices=STATUS_CHOICES, default=STATUS_PENDING_NOT_SENT)
  

    def __str__(self):
        return self.date.strftime("%Y-%m-%d") + " " + self.time.strftime("%H:%M") + " " + self.doctor.first_name + " " + self.doctor.last_name + " " + self.patient.first_name + " " + self.patient.last_name
    
    #create a method that makes an api call and sends a text message to the patient asking to confirm the appointment one day prior 
    # to the appointment date and store the response in the confirmation_status field
    def send_confirmation_text(self):
        pass
        '''
        #import the Twilio module
        from twilio.rest import Client
        #create a Twilio client
        client = Client(account_sid, auth_token)
        #create a message object
        message = client.messages.create(
            body="Please confirm your appointment with " + self.doctor.first_name + " " + self.doctor.last_name + " on " + self.date.strftime("%Y-%m-%d") + " at " + self.time.strftime("%H:%M") + ".",
            from_=twilio_number,
            to=self.patient.phone_number
        )
        #store the message id in the confirmation_status field
        self.confirmation_status = message.sid
        self.save()
        #return the message id
        return message.sid
        '''
    
    