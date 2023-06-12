from django.core import serializers
import json

# Authentication imports
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from django.contrib.auth.models import User

# RESTapi imports
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

# import model
from ...models import Challenge, Application

# import serializer
from ...serializers import GetChallengeSerializer

# import errorMessage class
from ...include import jsonMessages

def get(request):
    applicationId = request.user.username

    user = User.objects.get(username = applicationId)

    try:
        application = Application.objects.get(applicationId=applicationId)
        try:
            challengeOfSpecificApplication = Challenge.objects.get(id=application.challengeId)
            serializer = GetChallengeSerializer(challengeOfSpecificApplication, many=False)
            return Response(serializer.data, status=status.HTTP_200_OK)
        
        except Challenge.DoesNotExist:
            return Response(jsonMessages.errorJsonResponse("The applications challenge can not be found!"), status=status.HTTP_404_NOT_FOUND)  
        except Challenge.MultipleObjectsReturned:
            return Response(jsonMessages.errorJsonResponse("Multiple challenges with the same id exist!"), status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
    except Application.DoesNotExist:
        return Response(jsonMessages.errorJsonResponse("The referenced application can not be found!"), status=status.HTTP_404_NOT_FOUND)
    except Application.MultipleObjectsReturned:
        return Response(jsonMessages.errorJsonResponse("Multiple applications with the same id exist!"), status=status.HTTP_500_INTERNAL_SERVER_ERROR)