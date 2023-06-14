import time
import urllib.parse

from cryptography.fernet import Fernet
from django.conf import settings
from django.contrib.auth import authenticate
from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.response import Response

from ...include import jsonMessages
from ...models import Application


def login(request, **kwargs):
    if kwargs.keys():
        error_message_key_does_not_exist = "No application matches the given key! Please try again!"
        key = urllib.parse.unquote(kwargs["key"])

        fernet_key = settings.ENCRYPTION_KEY
        fernet = Fernet(fernet_key.encode())
        try:
            decrypted_message = fernet.decrypt(key).decode()
        except:
            return Response(
                jsonMessages.error_json_response(error_message_key_does_not_exist),
                status=status.HTTP_401_UNAUTHORIZED
            )

        if len(fernet_key) != 44:
            return Response(
                jsonMessages.error_json_response(error_message_key_does_not_exist),
                status=status.HTTP_401_UNAUTHORIZED
            )

        username = decrypted_message[0:8]
        password = decrypted_message[9:]

        user = authenticate(request, username=username, password=password)

        if user:
            if user.application.expiry < time.time():
                if user.application.status < Application.Status.ARCHIVED:
                    user.application.status = Application.Status.EXPIRED
                    user.save()
                return Response(
                    jsonMessages.error_json_response("The application is expired!"),
                    status=status.HTTP_410_GONE
                )
            token, created = Token.objects.get_or_create(user=user)
            return Response(
                {
                    "token": token.key
                }
            )
        else:
            return Response(
                jsonMessages.error_json_response(error_message_key_does_not_exist),
                status=status.HTTP_401_UNAUTHORIZED
            )

    return Response(jsonMessages.error_json_response("No key given!"), status=status.HTTP_422_UNPROCESSABLE_ENTITY)
