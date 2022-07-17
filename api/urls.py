from atexit import register
from datetime import datetime
from django.urls import URLPattern, register_converter

#from .converters import DateConverter
from django.urls import path, include
from . import views

#create a dateconverter class that will be used to convert the date from the url to a datetime object
class DateConverter:
    regex = r'\d{4}-\d{2}-\d{2}'
    def to_python(self, value):
        return datetime.strptime(value, '%Y-%m-%d').date()
    def to_url(self, value):
        return value.strftime('%Y-%m-%d')

register_converter(DateConverter, 'yyyy')

urlpatterns=[
    path("appointments/", views.AppointmentView.as_view(), name="appointment"),
    path("appointments/<int:pk>/", views.AppointmentDetail.as_view(), name="appointment-detail"),
    path("appointments/filter_by_doctor/<int:doctor_id>/", views.AppointmentFilterByDoctor.as_view(), name="filter_by_doctor"),
    #path("appointments/filter_by_date/<str:date>/", views.AppointmentFilterByDate.as_view(), name="filter_by_date"),
    #make a path that will be used to filter by date
    path("appointments/filter_by_date/<yyyy:date>/", views.AppointmentFilterByDate.as_view(), name="filter_by_date"),
    path("doctors/", views.DoctorView.as_view(), name="doctor"),
    path("doctors/<int:pk>/", views.DoctorDetail.as_view(), name="doctor-detail"),
    path("patients/", views.PatientView.as_view(), name="patient"),
    path("patients/<int:pk>/", views.PatientDetail.as_view(), name="patient-detail"),
]