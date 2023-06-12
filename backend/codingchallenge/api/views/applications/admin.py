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

#This class combines GET Application and GET Applications
class GetApplication(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request, *args, **kwargs):

        if kwargs.keys():
            applicationId = self.kwargs["applicationId"]
            application = Application.objects.get(applicationId=applicationId)
            try:
                serializer = GetApplicationSerializer(application, many=False)
                return Response(serializer.data, status=status.HTTP_200_OK)
            except:
                return Response(
                    jsonMessages.errorJsonResponse("Application ID not found!"),
                    status=status.HTTP_404_NOT_FOUND
                )
        else:
            applications = Application.objects
            serializer = GetApplicationSerializer(applications, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)


class CreateApplication(APIView):
    permission_classes = [IsAdminUser]
    
    def post(self, request, *args, **kwargs):
        
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


class EditApplication(APIView):
    permission_classes = [IsAdminUser]
    
    def put(self, request, *args, **kwargs):
        
        allowedFields = ['applicationStatus', 'challengeId', 'expiry']

        try:
            application = Application.objects.get(applicationId=self.kwargs["applicationId"])

        except (KeyError, ObjectDoesNotExist):
            return Response(jsonMessages.errorJsonResponse('Application not found'), status=status.HTTP_404_NOT_FOUND)

        serialized_application = json.loads(serializers.serialize("json", [application]))[0]

        statusCode = status.HTTP_200_OK

        if request.data:
            for key in request.data.keys():
                if key in allowedFields:
                    if key == allowedFields[0]:
                        if request.data.get(key) in Application.Status.values:
                            serialized_application['fields']['status'] = request.data.get(key)
                        else:
                            return Response(
                                jsonMessages.errorJsonResponse("Invalid status!"),
                                status=status.HTTP_400_BAD_REQUEST
                            )
                    if key == allowedFields[1]:
                        if Challenge.objects.filter(id=request.data.get(key)).exists():
                            serialized_application['fields']['challengeId'] = request.data.get(key)
                        else:
                            return Response(
                                jsonMessages.errorJsonResponse("Passed Challenge ID does not exist!"),
                                status=status.HTTP_404_NOT_FOUND
                            )
                    if key == allowedFields[2]:
                        if request.data.get(key) > time.time():
                            serialized_application['fields']['expiry'] = request.data.get(key)
                        else:
                            return Response(
                                jsonMessages.errorJsonResponse("Invalid expiry date!"),
                                status=status.HTTP_400_BAD_REQUEST
                            )
                else:
                    return Response(
                        jsonMessages.errorJsonResponse("Field: " + key + " not valid!"),
                        status=status.HTTP_400_BAD_REQUEST
                    )

        else:
            return Response(jsonMessages.errorJsonResponse("No data provided!"), status=status.HTTP_204_NO_CONTENT)

        serializer = GetApplicationSerializer(application, data=serialized_application["fields"])

        if serializer.is_valid() and statusCode == status.HTTP_200_OK:
            serializer.save()
            return Response(serializer.data, status=statusCode)

        return Response(jsonMessages.errorJsonResponse("Please check input!"), status=status.HTTP_400_BAD_REQUEST)

class DeleteApplication(APIView):
    permission_classes = [IsAdminUser]
    
    def delete(self, request, *args, **kwargs):

        gApi = GithubApi()

        try:
            user = User.objects.get(username=self.kwargs["applicationId"])

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
    
class GetResult(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request, *args, **kwargs):
        gApi = GithubApi()
        try:
            application = Application.objects.get(applicationId=self.kwargs["applicationId"])

        except(KeyError, ObjectDoesNotExist):
            return Response(
                jsonMessages.errorJsonResponse("Application ID not found!"),
                status=status.HTTP_404_NOT_FOUND
            )

        if not application.githubRepo:
            return Response(
                jsonMessages.errorJsonResponse("Can not find repo"),
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            githubUrl = gApi.get_repo_url(application.githubRepo)
            linterResult = gApi.get_linter_result(application.githubRepo)

        except GithubException:
            response, statusCode = jsonMessages.errorGithubJsonResponse(sys.exception())
            return Response(response, status=statusCode)

        return Response(
            {
                'githubUrl': githubUrl,
                'content': linterResult
            }, status=status.HTTP_200_OK
        )