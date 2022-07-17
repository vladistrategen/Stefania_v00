from django.urls import URLPattern


from django.urls import path, include
from . import views
urlpatterns=[
    path("/appointments/", views.AppointmentView.as_view(), name="appointment"),
    path("/appointments/<int:pk>/", views.AppointmentDetail.as_view(), name="appointment-detail"),
    path("/doctors/", views.DoctorView.as_view(), name="doctor"),
    path("/doctors/<int:pk>/", views.DoctorDetail.as_view(), name="doctor-detail"),
    path("/patients/", views.PatientView.as_view(), name="patient"),
    path("/patients/<int:pk>/", views.PatientDetail.as_view(), name="patient-detail"),
    
]