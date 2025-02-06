from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import Participant
import json
import requests

from aramco.settings import api_key,from_number

def home(request):
    return render(request, 'form.html')




@csrf_exempt
def register(request):
    if request.method == "POST":
        try:
            # Parse JSON data from the request
            data = json.loads(request.body)
            contact = data.get("contact")
            
            # Check if the contact already exists in the database
            participant = Participant.objects.filter(contact=contact).first()

            if participant:
                # If the participant exists, check their entry count
                if participant.entry_count >= 4:
                    return JsonResponse({"error": "You have already reached the maximum of 4 entries."}, status=400)
                else:
                    # Increment the entry count
                    participant.entry_count += 1
                    participant.save()
            else:
                # If the participant doesn't exist, create a new one with entry_count = 1
                participant = Participant.objects.create(
                    name=data.get("name"),
                    contact=contact,
                    email=data.get("email"),
                    fuel_type=data.get("fuel_type"),
                    vehicle_number=data.get("vehicle_number"),
                    receipt_number=data.get("receipt_number"),
                    entry_count=1,  # Initial entry count
                )
            
            return JsonResponse({"message": "Registration successful!", "id": participant.id}, status=201)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)
    return JsonResponse({"error": "Invalid request"}, status=400)




def send_sms(request):
    if request.method == "POST":
        try:
            # Parse the request body
            data = json.loads(request.body)
            contact_no = data.get('contactNo')  # Get the contact number from the request
            random_transcation_id = data.get('randomId')  # Get the random transaction ID from the request
        

            # Construct the URL
            url = f'https://api.itelservices.net/send.php?transaction_id={random_transcation_id}&api_key={api_key}&number=92{contact_no}&text=Your entry has been received for Aramco CT25 lucky draw!&from={from_number}&type=sms'

            # Send the request
            response = requests.get(url)
            
            print(response.text)

            # Handle the response
            if response.status_code == 200:
                return JsonResponse({'success': True, 'message': 'SMS sent successfully.'}, status=200)
            else:
                return JsonResponse({'success': False, 'message': f'Failed to send SMS: {response.text}'}, status=500)
        except Exception as e:
            return JsonResponse({'success': False, 'message': f'Error: {str(e)}'}, status=500)
    else:
        return JsonResponse({'success': False, 'message': 'Invalid request method.'}, status=405)



from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from datetime import datetime
import json

from .models import BonusEntry, Participant  

from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from datetime import datetime
import json

from .models import BonusEntry, Participant

@csrf_exempt
def submit_bonus_entry(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON data.'}, status=400)

        contact = data.get('contact')
        entries = data.get('entries')
        location = data.get('location', {})
        latitude = location.get('latitude')
        longitude = location.get('longitude')

        # Check if the contact exists in the Participant table.
        if not Participant.objects.filter(contact=contact).exists():
            return JsonResponse({'error': 'There is not any entry for this contact number.'}, status=400)

        existing_contact = BonusEntry.objects.filter(contact=contact).first()

        if not existing_contact:
            BonusEntry.objects.create(
                contact=contact,
                entries=entries,
                entry_marked=True,
                latitude=latitude,
                longitude=longitude
            )
            return JsonResponse({'success': 'Bonus entry has been marked successfully!'})
        else:
            # Get today's date.
            today = datetime.now().date()
            # Check if there is already a bonus entry for this contact on today's date.
            existing_entry = BonusEntry.objects.filter(contact=contact, date=today).first()
            if not existing_entry:
                # Update the existing contact's record with the new number of entries, location, and mark it.
                existing_contact.entries = entries
                existing_contact.entry_marked = True
                existing_contact.latitude = latitude
                existing_contact.longitude = longitude
                existing_contact.save()
                return JsonResponse({'success': 'Bonus entry has been marked successfully!'})
            else:
                return JsonResponse({'error': 'Bonus entries already marked for this contact.'})
    
    # For non-POST requests, render the form template.
    return render(request, 'bonusform.html')
