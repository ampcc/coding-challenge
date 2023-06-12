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

class KeyAuthentication(ObtainAuthToken):

    def post(self, request, *args, **kwargs):
        if kwargs.keys():
            error_message_key_does_not_exist = "No application matches the given key! Please try again!"
            key = urllib.parse.unquote(self.kwargs["key"])

            fernet_key = settings.ENCRYPTION_KEY
            fernet = Fernet(fernet_key.encode())
            try:
                decryptedMessage = fernet.decrypt(key).decode()
            except:
                return Response(jsonMessages.errorJsonResponse(error_message_key_does_not_exist), status=status.HTTP_401_UNAUTHORIZED)

            if len(fernet_key) != 44:
                return Response(jsonMessages.errorJsonResponse(error_message_key_does_not_exist), status=status.HTTP_401_UNAUTHORIZED)
            
            username = decryptedMessage[0:8]
            password = decryptedMessage[9:]

            user = authenticate(request, username=username, password=password)

            if user:
                if user.application.expiry < time.time():
                    if user.application.status < Application.Status.ARCHIVED:
                        user.application.status = Application.Status.EXPIRED
                        user.save()
                    return Response(jsonMessages.errorJsonResponse("The application is expired!"), status=status.HTTP_410_GONE)
                token, created = Token.objects.get_or_create(user=user)
                return Response({
                    "token": token.key
                })
            else:
                return Response(jsonMessages.errorJsonResponse(error_message_key_does_not_exist), status=status.HTTP_401_UNAUTHORIZED)
        
        return Response(jsonMessages.errorJsonResponse("No key given!"), status=status.HTTP_422_UNPROCESSABLE_ENTITY)


class AdminChangePassword(APIView):
    permission_classes = [IsAdminUser]
    
    def put(self, request, *args, **kwargs):
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
