from django.shortcuts import render
from django.views.generic import ListView, DetailView
from appointment.models import Appointment
from doctors.models import Doctor

from patient.models import Patient

# Create your views here.

class filter_by_date_view(ListView):
    def get(self, request):
        pass
        #TODO: implement
        """desired_date=request.GET.get('date')
        patient_list=Patient.objects.filter(date=desired_date)
        return render(request, 'patient/all_patients.html', {'patient_list': patient_list})"""

class filter_by_doctor_view(ListView):
    def get(self, request, doctor_id):
        """# get all patients that have an appointment with the doctor with the id doctor_id
        patient_list=Patient.objects.filter(appointment__doctor_id=doctor_id)"""

        desired_doc=Doctor.objects.get(id=doctor_id)
        appointment_list=Appointment.objects.filter(doctor=desired_doc)
        return render(request, 'all_appointments.html', {'appointment_list': appointment_list,"doctor":desired_doc})
        