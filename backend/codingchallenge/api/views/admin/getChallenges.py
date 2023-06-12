from django.core import serializers
import json

from rest_framework.permissions import IsAdminUser, IsAuthenticated
from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from ...models import Challenge, Application
from ...serializers import GetChallengeSerializer
from ...include import jsonMessages

def get():
    
    challenges = Challenge.objects.all()
    serializer = GetChallengeSerializer(challenges, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)