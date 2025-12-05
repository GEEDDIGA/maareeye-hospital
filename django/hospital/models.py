from django.db import models

class Hospital(models.Model):
    name = models.CharField(max_length=255)
    location = models.CharField(max_length=255)
    phone = models.CharField(max_length=20)
    email = models.EmailField()
    
    def __str__(self):
        return self.name

class Doctor(models.Model):
    hospital = models.ForeignKey(Hospital, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    specialty = models.CharField(max_length=255)
    phone = models.CharField(max_length=20)
    email = models.EmailField()
    
    def __str__(self):
        return self.name

class Patient(models.Model):
    hospital = models.ForeignKey(Hospital, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    age = models.IntegerField()
    phone = models.CharField(max_length=20)
    email = models.EmailField()
    address = models.TextField()
    
    def __str__(self):
        return self.name

class Appointment(models.Model):
    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE)
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE)
    hospital = models.ForeignKey(Hospital, on_delete=models.CASCADE)
    date = models.DateTimeField()
    reason = models.TextField()
    status = models.CharField(max_length=50, default='Scheduled')
    
    def __str__(self):
        return f'{self.patient.name} - {self.doctor.name}' 
