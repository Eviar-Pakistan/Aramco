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
            data = json.loads(request.body)  # Parse JSON data from the request
            participant = Participant.objects.create(
                name=data.get("name"),
                contact=data.get("contact"),
                email=data.get("email"),
                fuel_type=data.get("fuel_type"),
                vehicle_number=data.get("vehicle_number"),
                receipt_number=data.get("receipt_number"),
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

