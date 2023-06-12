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

def get(**kwargs):

    applicationId = kwargs["applicationId"]
    application = Application.objects.get(applicationId=applicationId)
    try:
        serializer = GetApplicationSerializer(application, many=False)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except:
        return Response(
            jsonMessages.errorJsonResponse("Application ID not found!"),
            status=status.HTTP_404_NOT_FOUND
        )