from django.urls import path
from rest_framework import routers
from hospital import views

router = routers.DefaultRouter()
router.register(r'doctors', views.DoctorViewSet)
router.register(r'patients', views.PatientViewSet)
router.register(r'appointments', views.AppointmentViewSet)
router.register(r'hospital', views.HospitalViewSet)

urlpatterns = [
    path('api/health/', views.health_check, name='health'),
    path('api/db-test/', views.db_test, name='db_test'),
    path('', views.root, name='root'),
] + router.urls
