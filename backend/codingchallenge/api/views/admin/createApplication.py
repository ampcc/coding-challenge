import random
import secrets
import string
import time

from cryptography.fernet import Fernet
from django.conf import settings
from django.contrib.auth.models import User
from django.core.exceptions import ObjectDoesNotExist
from rest_framework import status
from rest_framework.response import Response

from ...include import jsonMessages, expirySettings
from ...models import Application, Challenge
from ...serializers import (
    GetApplicationSerializer, PostApplicationSerializer
)


def create(request):
    expiry_timestamp = time.time() + expirySettings.days_until_challenge_start * 24 * 60 * 60
    try:
        # random challenge selection of active challenges
        challenge_id = random.choice(Challenge.objects.filter(active=True)).id

    except IndexError:
        return Response(
            jsonMessages.error_json_response('there are no challenges in database'),
            status=status.HTTP_422_UNPROCESSABLE_ENTITY
        )

    if not request.data:
        return Response(jsonMessages.error_json_response('Body is empty'), status=status.HTTP_204_NO_CONTENT)

    try:
        if not len(request.data.get('applicationId')) == 8:
            return Response(
                jsonMessages.error_json_response('applicationId has the wrong length'),
                status=status.HTTP_400_BAD_REQUEST
            )

        if Application.objects.filter(
                applicationId=request.data.get('applicationId')
        ).exists():
            return Response(
                jsonMessages.error_json_response('ApplicationId already in use'),
                status=status.HTTP_409_CONFLICT
            )

        if 'challengeId' in request.data:
            if Challenge.objects.filter(id=request.data.get('challengeId')).exists():
                challenge_id = request.data.get('challengeId')
            else:
                return Response(
                    jsonMessages.error_json_response("Passed Challenge ID does not exist!"),
                    status=status.HTTP_404_NOT_FOUND
                )

        if 'expiry' in request.data:
            try:
                expiry_timestamp = float(request.data.get('expiry'))
            except ValueError:
                return Response(
                    jsonMessages.error_json_response('Wrong json attributes. Please check expiry-timestamp value!'),
                    status=status.HTTP_400_BAD_REQUEST
                )
        else:
            expiry_timestamp = time.time() + expirySettings.days_until_challenge_start * 24 * 60 * 60

    except (AttributeError, TypeError):
        return Response(jsonMessages.error_json_response('Wrong json attributes'), status=status.HTTP_400_BAD_REQUEST)

    alphabet = string.ascii_letters + string.digits
    password = ''.join(secrets.choice(alphabet) for i in range(16))
    user = User.objects.create_user(
        username=request.data.get('applicationId'),
        password=password
    )
    user.save()

    # the key is build as follows: "applicationId+password".
    # Note: The applicationId does always have 8 digits.
    key_plain = request.data.get('applicationId') + "+" + password
    fernet_key = settings.ENCRYPTION_KEY
    fernet = Fernet(fernet_key.encode())
    enc_key = fernet.encrypt(key_plain.encode()).decode("utf-8")

    data = {
        'applicationId': request.data.get('applicationId'),
        'challengeId': challenge_id,
        'expiry': expiry_timestamp,
        'user': user.id
    }

    serializer = GetApplicationSerializer(data=data)
    if serializer.is_valid():
        serializer.save()
        try:
            applications = Application.objects.get(applicationId=request.data.get('applicationId'))
        except (KeyError, ObjectDoesNotExist):
            return Response(
                jsonMessages.error_json_response("Application not found!"),
                status=status.HTTP_404_NOT_FOUND
            )
        post_serializer = PostApplicationSerializer(
            applications, many=False, context={
                'key': enc_key,
                "applicationId": request.data.get(
                    'applicationId'
                )
            }
        )
        return Response(post_serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
