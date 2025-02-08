from django.utils.timezone import now
from django.db import models


class Participant(models.Model):
    date = models.DateField(now)
    created_at = models.DateTimeField(auto_now_add=True)
    name = models.CharField(max_length=100)
    contact = models.CharField(max_length=15)
    email = models.EmailField()
    vehicle_number = models.CharField(max_length=50)
    fuel_type = models.CharField(max_length=20)
    cnic = models.CharField(max_length=50,null=True, blank=True)
    receipt_number = models.CharField(max_length=50)
    entry_count = models.IntegerField(default=0)
    latitude = models.FloatField(null=True, blank=True)   
    longitude = models.FloatField(null=True, blank=True)  
    vehicle = models.CharField(max_length=50 , null=True , blank=True)  
    city = models.CharField(max_length=50 , null=True , blank=True)  

    def __str__(self):
        return self.name


    

class BonusEntry(models.Model):
    contact = models.CharField(max_length=15)
    entries = models.IntegerField()
    date = models.DateField(now)  # Date when entry is made
    entry_marked = models.BooleanField(default=False)  # True if bonus entry is marked, else False
    latitude = models.FloatField(null=True, blank=True)   # Optional latitude from user location
    longitude = models.FloatField(null=True, blank=True)  # Optional longitude from user location
    created_at = models.DateTimeField(auto_now_add=True)


    def __str__(self):
        return f"BonusEntry for {self.contact} on {self.date}"



from django.db import models
from django.contrib.auth.models import User

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    is_logged_in = models.BooleanField(default=False)

    def __str__(self):
        return self.user.username


