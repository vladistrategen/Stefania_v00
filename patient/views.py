from django.http import HttpResponse
from django.shortcuts import render
from .models import Patient
# Create your views here.
# all patients view
def all_patients(request):
    all=Patient.objects.all()
    final=','.join([str(i) for i in all])
    return HttpResponse(final)
    #return render(request, 'patient/all_patients.html')