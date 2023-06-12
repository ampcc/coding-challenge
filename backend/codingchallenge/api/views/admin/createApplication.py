import json
import random
import secrets
import string
import sys
import time
from io import BytesIO
from threading import Thread
from textwrap import dedent
from zipfile import ZipFile
from cryptography.fernet import Fernet
from django.conf import settings
from django.contrib.auth.models import User

# RESTapi imports
from django.core import serializers
from django.core.exceptions import ObjectDoesNotExist
from github import GithubException
from rest_framework import status
from rest_framework.parsers import FileUploadParser

# Authentication imports
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from ...include import jsonMessages, expirySettings
from ...include.githubApi import GithubApi
from ...models import Application, Challenge
from ...serializers import (
    GetApplicationSerializer, GetApplicationStatus, GetChallengeSerializer,
    PostApplicationSerializer
)
    
def create(request):
    
    expiryTimestamp = time.time() + expirySettings.daysUntilChallengeStart * 24 * 60 * 60
    try:
        # random challenge selection of active challenges
        challengeId = random.choice(Challenge.objects.filter(active=True)).id

    except IndexError:
        return Response(
            jsonMessages.errorJsonResponse('there are no challenges in database'),
            status=status.HTTP_422_UNPROCESSABLE_ENTITY
        )

    if not request.data:
        return Response(jsonMessages.errorJsonResponse('Body is empty'), status=status.HTTP_204_NO_CONTENT)

    try:

        if not len(request.data.get('applicationId')) == 8:
            return Response(
                jsonMessages.errorJsonResponse('applicationId has the wrong length'),
                status=status.HTTP_400_BAD_REQUEST
            )

        if Application.objects.filter(
                applicationId=request.data.get('applicationId')
        ).exists():
            return Response(
                jsonMessages.errorJsonResponse('ApplicationId already in use'),
                status=status.HTTP_409_CONFLICT
            )

        if 'challengeId' in request.data:
            if Challenge.objects.filter(id=request.data.get('challengeId')).exists():
                challengeId = request.data.get('challengeId')
            else:
                return Response(
                    jsonMessages.errorJsonResponse("Passed Challenge ID does not exist!"),
                    status=status.HTTP_404_NOT_FOUND
                )

        if 'expiry' in request.data:
            try:
                expiryTimestamp = float(request.data.get('expiry'))
            except ValueError:
                return Response(
                    jsonMessages.errorJsonResponse('Wrong json attributes. Please check expiryTimestamp value!'),
                    status=status.HTTP_400_BAD_REQUEST
                )
        else:
            expiryTimestamp = time.time() + expirySettings.daysUntilChallengeStart * 24 * 60 * 60

    except (AttributeError, TypeError):
        return Response(jsonMessages.errorJsonResponse('Wrong json attributes'), status=status.HTTP_400_BAD_REQUEST)

    alphabet = string.ascii_letters + string.digits
    password = ''.join(secrets.choice(alphabet) for i in range(16))
    user = User.objects.create_user(
        username=request.data.get('applicationId'),
        password=password
    )
    user.save()

    # the key is build as follows: "applicationId+password".
    # Note: The applicationId does always have 8 digits.
    keyPlain = request.data.get('applicationId') + "+" + password
    fernet_key = settings.ENCRYPTION_KEY
    fernet = Fernet(fernet_key.encode())
    encKey = fernet.encrypt(keyPlain.encode()).decode("utf-8")

    data = {
        'applicationId': request.data.get('applicationId'),
        'challengeId': challengeId,
        'expiry': expiryTimestamp,
        'user': user.id
    }

    serializer = GetApplicationSerializer(data=data)
    if serializer.is_valid():
        serializer.save()
        try:
            applications = Application.objects.get(applicationId=request.data.get('applicationId'))
        except (KeyError, ObjectDoesNotExist):
            return Response(
                jsonMessages.errorJsonResponse("Application not found!"),
                status=status.HTTP_404_NOT_FOUND
            )
        postSerializer = PostApplicationSerializer(
            applications, many=False, context={
                'key': encKey,
                "applicationId": request.data.get(
                    'applicationId'
                )
            }
        )
        return Response(postSerializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)