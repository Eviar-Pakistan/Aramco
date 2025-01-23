from django.db import models


class Participant(models.Model):
    name=models.CharField(max_length=100)
    contact=models.CharField(max_length=15)
    email=models.EmailField()
    fuel_type=models.CharField(max_length=20)
    vehicle_number=models.CharField(max_length=50)
    receipt_number=models.CharField(max_length=50)
    
    def __str__(self):
        return self.name