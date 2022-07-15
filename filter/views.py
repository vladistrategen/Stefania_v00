from django.shortcuts import render
from django.views.generic import ListView, DetailView

from patient.models import Patient

# Create your views here.

class filter_by_date_view(ListView):
    def get(self, request):
        desired_date=request.GET.get('date')
        patient_list=Patient.objects.filter(date=desired_date)
        return render(request, 'patient/all_patients.html', {'patient_list': patient_list})

class filter_by_doctor_view(ListView):
    def get(self, request):
        desired_doctor=request.GET.get('doctor')
        patient_list=Patient.objects.filter(doctor=desired_doctor)
        return render(request, 'patient/all_patients.html', {'patient_list': patient_list})
        