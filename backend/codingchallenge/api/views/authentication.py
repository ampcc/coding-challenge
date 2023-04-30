import urllib.parse
import os

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

from . import jsonMessages


class KeyAuthentication(ObtainAuthToken):

    def post(self, request, *args, **kwargs):
        if kwargs.keys():
            key = urllib.parse.unquote(self.kwargs["key"])

            fernet_key = settings.ENCRYPTION_KEY
            fernet = Fernet(fernet_key.encode())
            decryptedMessage = fernet.decrypt(key).decode()
            username = decryptedMessage[0:8]
            password = decryptedMessage[9:]
            
            user = authenticate(request, username=username, password=password)

            if user:
                token, created = Token.objects.get_or_create(user=user)
                return Response({
                    "token": token.key
                })
            else:
                return Response(jsonMessages.errorJsonResponse("No application matches the given key! Please try again!"), status=status.HTTP_401_UNAUTHORIZED)
        
        return Response(jsonMessages.errorJsonResponse("No key given!"), status=status.HTTP_422_UNPROCESSABLE_ENTITY)


class AdminChangePassword(APIView):
    permission_classes = [IsAdminUser]
    
    def put(self, request, *args, **kwargs):
        try:
            oldPassword = request.data.get('oldPassword')
            newPassword = request.data.get('newPassword')
        except KeyError:
            return Response(jsonMessages.errorJsonResponse("Could not get new Password. Please check HTTP Request!"), status=status.HTTP_400_BAD_REQUEST)
        if newPassword == "":
            return Response(jsonMessages.errorJsonResponse("The new password must not be empty!"), status=status.HTTP_400_BAD_REQUEST)            
        user = authenticate(request, username=request.user.username, password=oldPassword)
        if not user:
            return Response(jsonMessages.errorJsonResponse("The old password does not match the currently logged in admin user account!"), status=status.HTTP_403_FORBIDDEN)
        try:        
            user.set_password(newPassword)
            user.save()
            return Response(jsonMessages.successJsonResponse(), status=status.HTTP_202_ACCEPTED)
        except:
            return Response(jsonMessages.errorJsonResponse("Could not set password!"), status=status.HTTP_500_INTERNAL_SERVER_ERROR)
