from datetime import datetime
from django.http import Http404
from django.shortcuts import redirect, render
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.decorators import api_view
from appointment.models import Appointment
from doctors.models import Doctor
from patient.models import Patient

from users.views import login_view
import logging
# Create your views here.

from .serializers import AppointmentSerializer, DoctorSerializer, PatientSerializer

class AppointmentList(APIView):
    # check if the user is authenticated
    
    def is_authenticated(self, request):
        if not request.user.is_authenticated:
            return False
        return True








# api for getting all appointments
class AppointmentView(AppointmentList):
    def get(self, request):
        appointments = Appointment.objects.all()
        serializer = AppointmentSerializer(appointments, many=True)
        if not self.is_authenticated(request):
            return redirect('login')
        return Response(serializer.data)


    def post(self, request):
        serializer = AppointmentSerializer(data=request.data)
        if not self.is_authenticated(request):
            return redirect('login')
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)
    
    def put(self, request, pk):
        appointment = Appointment.objects.get(id=pk)
        serializer = AppointmentSerializer(appointment, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)
    
    
# api for getting detailed appointment
class AppointmentDetail(AppointmentList):
    def get_object(self, pk):
        try:
            return Appointment.objects.get(id=pk)
        except Appointment.DoesNotExist:
            raise Http404
    
    def get(self, request, pk):
        appointment = self.get_object(pk)
        serializer = AppointmentSerializer(appointment)
        if not self.is_authenticated(request):
            return render(request, 'login.html')
        return Response(serializer.data)
    
    def post(self, request, pk):
        appointment = self.get_object(pk)
        serializer = AppointmentSerializer(appointment, data=request.data)
        if serializer.is_valid():
            serializer.save()
            if not self.is_authenticated(request):
                return render(request, 'login.html')
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

    def put(self, request, pk):
        appointment = self.get_object(pk)
        serializer = AppointmentSerializer(appointment, data=request.data)
        if serializer.is_valid():
            serializer.save()
            if not self.is_authenticated(request):
                return render(request, 'login.html')
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

    def delete(self, request, pk):
        if not self.is_authenticated(request):
            return render(request, 'login.html')
        appointment = self.get_object(pk)
        appointment.delete()
        return Response(status=204)

# api for getting filtered appointments by doctor
class AppointmentFilterByDoctor(AppointmentList):
    def get_object(self, pk):
        try:
            return Doctor.objects.get(id=pk)
        except Doctor.DoesNotExist:
            raise Http404
    
    def get(self, request, doctor_id):
        desired_doctor = self.get_object(doctor_id)
        appointments = Appointment.objects.filter(doctor=desired_doctor)
        serializer = AppointmentSerializer(appointments, many=True)
        if not self.is_authenticated(request):
            return render(request, 'login.html')
        return Response(serializer.data)
    
    
# api for getting filtered appointments by date
class AppointmentFilterByDate(AppointmentList):
    def get_object(self, pk):
        try:
            return Appointment.objects.get(id=pk)
        except Appointment.DoesNotExist:
            raise Http404
    
    def get(self, request, date):
        to_str=date.strftime('%Y-%m-%d')
        desired_date = datetime.strptime(to_str, '%Y-%m-%d').date()
        #  variable storing all appointments sooner or equal to the desired date
        appointments = Appointment.objects.filter(date__lte=desired_date)
        serializer = AppointmentSerializer(appointments, many=True)
        if not self.is_authenticated(request):
            return render(request, 'login.html')
        return Response(serializer.data)
    
    

class AppointmentFilterByDateAndDoctor(AppointmentList):
    def get_object(self, pk):
        try:
            return Appointment.objects.get(id=pk)
        except Appointment.DoesNotExist:
            raise Http404
    
    def get(self, request, date, doctor_id):
        to_str=date.strftime('%Y-%m-%d')
        desired_date = datetime.strptime(to_str, '%Y-%m-%d').date()
        desired_doctor = Doctor.objects.get(id=doctor_id)
        appointments = Appointment.objects.filter(date__lte=desired_date, doctor=desired_doctor)
        serializer = AppointmentSerializer(appointments, many=True)
        if not self.is_authenticated(request):
            return render(request, 'login.html')
        return Response(serializer.data)
    
    

# api for getting all doctors
class DoctorView(APIView):
    def get(self, request):
        doctors = Doctor.objects.all()
        serializer = DoctorSerializer(doctors, many=True)
        return Response(serializer.data)
    
    def post(self, request):
        serializer = DoctorSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)
    
    def put(self, request, pk):
        doctor = Doctor.objects.get(id=pk)
        serializer = DoctorSerializer(doctor, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)
# api for getting detailed doctor
class DoctorDetail(APIView):
    def get_object(self, pk):
        try:
            return Doctor.objects.get(id=pk)
        except Doctor.DoesNotExist:
            raise Http404
    
    def get(self, request, pk):
        doctor = self.get_object(pk)
        serializer = DoctorSerializer(doctor)
        return Response(serializer.data)
    
    def put(self, request, pk):
        doctor = self.get_object(pk)
        serializer = DoctorSerializer(doctor, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)




# api for getting all patients
class PatientView(APIView):
    def get(self, request):
        patients = Patient.objects.all()
        serializer = PatientSerializer(patients, many=True)
        return Response(serializer.data)
    
    def post(self, request):
        serializer = PatientSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)
    
    def put(self, request, pk):
        patient = Patient.objects.get(id=pk)
        serializer = PatientSerializer(patient, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)
# api for getting detailed patient
class PatientDetail(APIView):
    def get_object(self, pk):
        try:
            return Patient.objects.get(id=pk)
        except Patient.DoesNotExist:
            raise Http404
    
    def get(self, request, pk):
        patient = self.get_object(pk)
        serializer = PatientSerializer(patient)
        return Response(serializer.data)
    
    def put(self, request, pk):
        patient = self.get_object(pk)
        serializer = PatientSerializer(patient, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

