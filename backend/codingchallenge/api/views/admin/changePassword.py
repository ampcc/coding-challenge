import urllib.parse
import os
import time

from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView

from django.contrib.auth import authenticate, login
from django.conf import settings
from cryptography.fernet import Fernet

from rest_framework.permissions import IsAdminUser, IsAuthenticated
from django.contrib.auth.models import User

from ...include import jsonMessages
from ...models import Application


def change(request):
        old_password = request.data.get('oldPassword')
        new_password = request.data.get('newPassword')
        
        if old_password == None or new_password == None:
            return Response(jsonMessages.errorJsonResponse("Wrong keys sent! Can not process request!"), status=status.HTTP_400_BAD_REQUEST)
        
        if len(old_password) == 0 or len(new_password) == 0:
            return Response(jsonMessages.errorJsonResponse("Password(s) must not be empty!"), status=status.HTTP_400_BAD_REQUEST)
        user = authenticate(request, username=request.user.username, password=old_password)
        
        if not user:
            return Response(jsonMessages.errorJsonResponse("The old password does not match the currently logged in admin user account!"), status=status.HTTP_403_FORBIDDEN)
        try:        
            user.set_password(new_password)
            user.save()
            return Response(jsonMessages.successJsonResponse(), status=status.HTTP_202_ACCEPTED)
        except:
            return Response(jsonMessages.errorJsonResponse("Could not set password!"), status=status.HTTP_500_INTERNAL_SERVER_ERROR)