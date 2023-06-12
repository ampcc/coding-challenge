
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
from rest_framework import status
from rest_framework.response import Response
from ...models import Application
from ...serializers import (
    GetApplicationSerializer
)

def get():
    applications = Application.objects
    serializer = GetApplicationSerializer(applications, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)