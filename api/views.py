from datetime import datetime
from django.http import Http404
from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.decorators import api_view
from appointment.models import Appointment
from doctors.models import Doctor
from patient.models import Patient
import logging
# Create your views here.

from .serializers import AppointmentSerializer, DoctorSerializer, PatientSerializer
# api for getting all appointments
class AppointmentView(APIView):
    def get(self, request):
        appointments = Appointment.objects.all()
        serializer = AppointmentSerializer(appointments, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = AppointmentSerializer(data=request.data)
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
class AppointmentDetail(APIView):
    def get_object(self, pk):
        try:
            return Appointment.objects.get(id=pk)
        except Appointment.DoesNotExist:
            return Http404
    
    def get(self, request, pk):
        appointment = self.get_object(pk)
        serializer = AppointmentSerializer(appointment)
        return Response(serializer.data)
    
    def put(self, request, pk):
        appointment = self.get_object(pk)
        serializer = AppointmentSerializer(appointment, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)
# api for getting filtered appointments by doctor
class AppointmentFilterByDoctor(APIView):
    def get_object(self, pk):
        try:
            return Doctor.objects.get(id=pk)
        except Doctor.DoesNotExist:
            return Http404
    
    def get(self, request, doctor_id):
        desired_doctor = self.get_object(doctor_id)
        appointments = Appointment.objects.filter(doctor=desired_doctor)
        serializer = AppointmentSerializer(appointments, many=True)
        return Response(serializer.data)
    
    def post(self, request, doctor_id):
        doctor = self.get_object(doctor_id)
        serializer = AppointmentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)
    
    def put(self, request, doctor_id):
        doctor = self.get_object(doctor_id)
        appointments = Appointment.objects.filter(doctor=doctor)
        serializer = AppointmentSerializer(appointments, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)
# api for getting filtered appointments by date
class AppointmentFilterByDate(APIView):
    def get_object(self, pk):
        try:
            return Appointment.objects.get(id=pk)
        except Appointment.DoesNotExist:
            return Http404
    
    def get(self, request, date):
        to_str=date.strftime('%Y-%m-%d')
        desired_date = datetime.strptime(to_str, '%Y-%m-%d').date()
        #  variable storing all appointments sooner or equal to the desired date
        appointments = Appointment.objects.filter(date__lte=desired_date)
        serializer = AppointmentSerializer(appointments, many=True)
        return Response(serializer.data)
    
    def post(self, request, date):
        desired_date = datetime.strptime(date, '%Y-%m-%d').date()
        serializer = AppointmentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)
    
    def put(self, request, date):
        desired_date = datetime.strptime(date, '%Y-%m-%d').date()
        appointments = Appointment.objects.filter(date=desired_date)
        serializer = AppointmentSerializer(appointments, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

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
            return Http404
    
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
            return Http404
    
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

