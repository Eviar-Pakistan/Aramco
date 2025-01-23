from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import Participant
import json
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
