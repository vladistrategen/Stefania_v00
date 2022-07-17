from rest_framework.serializers import ModelSerializer
from appointment.models import Appointment
from doctors.models import Doctor
from patient.models import Patient
class AppointmentSerializer(ModelSerializer):
    class Meta:
        model = Appointment
        fields = '__all__'

class DoctorSerializer(ModelSerializer):
    class Meta:
        model = Doctor
        fields = '__all__'

class PatientSerializer(ModelSerializer):
    class Meta:
        model = Patient
        fields = '__all__'