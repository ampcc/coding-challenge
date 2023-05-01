import urllib.parse
import os

from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from rest_framework import status

from django.contrib.auth import authenticate, login
from django.conf import settings
from cryptography.fernet import Fernet

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