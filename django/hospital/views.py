from rest_framework import status, viewsets
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.db import connection
from .models import Hospital, Doctor, Patient, Appointment
from .serializers import (
    HospitalSerializer, DoctorSerializer, PatientSerializer, AppointmentSerializer
)

@api_view(['GET'])
def root(request):
    return Response({
        'status': 'OK',
        'message': 'Maareeye Hospital System is running'
    })

@api_view(['GET'])
def health_check(request):
    return Response({
        'status': 'OK',
        'message': 'Maareeye Hospital System is running'
    })

@api_view(['GET'])
def db_test(request):
    try:
        with connection.cursor() as cursor:
            cursor.execute('SELECT 1')
        return Response({
            'status': 'OK',
            'database': 'Connected'
        })
    except Exception as e:
        return Response({
            'status': 'Error',
            'error': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class HospitalViewSet(viewsets.ModelViewSet):
    queryset = Hospital.objects.all()
    serializer_class = HospitalSerializer

class DoctorViewSet(viewsets.ModelViewSet):
    queryset = Doctor.objects.all()
    serializer_class = DoctorSerializer

class PatientViewSet(viewsets.ModelViewSet):
    queryset = Patient.objects.all()
    serializer_class = PatientSerializer

class AppointmentViewSet(viewsets.ModelViewSet):
    queryset = Appointment.objects.all()
    serializer_class = AppointmentSerializer
