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

def delete(**kwargs):

    gApi = GithubApi()
    try:
        user = User.objects.get(username=kwargs["applicationId"])

    except(KeyError, TypeError, User.DoesNotExist):
        return Response(
            jsonMessages.errorJsonResponse("Application ID not found!"),
            status=status.HTTP_404_NOT_FOUND
        )

    # if the repository has not been created yet, there shouldnt be a GitHub API-Call
    if user.application.githubRepo:
        try:
            gApi.delete_repo(user.application.githubRepo)
        except GithubException:
            response, statusCode = jsonMessages.errorGithubJsonResponse(sys.exception())
            return Response(response, status=statusCode)

    try:
        user.delete()
    except:
        return Response(
            jsonMessages.errorJsonResponse("Can't delete user due to an unknown error!"),
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

    return Response(jsonMessages.successJsonResponse(), status=status.HTTP_200_OK)