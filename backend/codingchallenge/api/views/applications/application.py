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

class StartChallengeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):

        user = User.objects.get(username=request.user.username)

        if user.application.status >= Application.Status.CHALLENGE_STARTED:
            return Response(
                jsonMessages.errorJsonResponse("Can not start challenge! The challenge has already been started!"),
                status=status.HTTP_400_BAD_REQUEST
            )

        expiryTimestamp = user.application.expiry
        currentTimestamp = time.time()

        if expiryTimestamp - currentTimestamp < 0:
            # application is expired
            user.application.status = Application.Status.EXPIRED
            user.application.save()
            return Response(
                jsonMessages.errorJsonResponse(
                    "Can not start challenge! The application is expired since " + str(
                        expiryTimestamp - currentTimestamp
                    ) + " seconds!"
                ), status=status.HTTP_410_GONE
            )
        # application is still running
        else:
            user.application.expiry = time.time() + expirySettings.daysToFinishSinceChallengeStart * 24 * 60 * 60
            user.application.status = Application.Status.CHALLENGE_STARTED
        try:
            challenge = Challenge.objects.get(id=request.user.application.challengeId)

            # saves applicationStatus and new expiration date
            user.application.save()
            serializer = GetChallengeSerializer(challenge, many=False)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except:
            return Response(jsonMessages.errorJsonResponse("Challenge ID not found!"), status=status.HTTP_404_NOT_FOUND)
        
class GetApplicationStatusView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        user = User.objects.get(username=request.user.username)
        application = Application.objects.get(applicationId=user.username)
        serializer = GetApplicationStatus(application, many=False)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
class UploadSolutionView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [FileUploadParser]

    def post(self, request, *args, **kwargs):

        gApi = GithubApi()
        try:
            user = User.objects.get(username=request.user.username)
        except ObjectDoesNotExist:
            return Response(
                jsonMessages.errorJsonResponse("unauthorized"),
                status=status.HTTP_401_UNAUTHORIZED
            )

        if user.application.status < Application.Status.IN_REVIEW:

            repoName = f'{user.application.applicationId}_{user.application.challengeId}'

            try:
                raw_file = request.data['file']
            except KeyError:
                return Response(
                    jsonMessages.errorJsonResponse("No file passed. Aborting."),
                    status=status.HTTP_400_BAD_REQUEST
                )
            try:
                file_obj = ZipFile(raw_file)
            except:
                return Response(
                    jsonMessages.errorJsonResponse("Cannot process zipFile. Aborting."),
                    status=status.HTTP_400_BAD_REQUEST
                )

            try:
                operating_system = request.META['HTTP_OPERATINGSYSTEM']
                programming_language = request.META['HTTP_PROGRAMMINGLANGUAGE']

                read_me = dedent(
                    f"""\
                    # Application of {user.application.applicationId}
                    ## Uploaded solution
                    - Operating System: {operating_system}
                    - Programming Language: {programming_language}

                    ## Assigned challenge Nr. {user.application.challengeId}
                    ### {Challenge.objects.get(id=user.application.challengeId).challengeHeading}
                    {Challenge.objects.get(id=user.application.challengeId).challengeText}

                """
                )

                read_me_file = BytesIO(read_me.encode())
                read_me_file.name = "/.github/README.md"

            except KeyError:
                return Response(
                    jsonMessages.errorJsonResponse("No Operating System or Programming Language specified"),
                    status=status.HTTP_400_BAD_REQUEST
                )

            try:
                raw_file = request.data['file']
            except KeyError:
                return Response(
                    jsonMessages.errorJsonResponse("No file passed. Aborting."),
                    status=status.HTTP_400_BAD_REQUEST
                )
            try:
                file_obj = ZipFile(raw_file)
            except:
                return Response(
                    jsonMessages.errorJsonResponse("No Operating System or Programming Language specified"),
                    status=status.HTTP_400_BAD_REQUEST
                )

            try:
                oneFolderAtTopLevel = False
                oneFileAtTopLevel = False
                filteredPathList = []
                for path in file_obj.namelist():
                    path_name = path[path.find('/') + 1:]
                    if '/.' not in path:
                        # file or directory is not hidden -> use it
                        if not '/' in path_name and not path_name == "":
                            # there is at least one file inside the root folder
                            oneFileAtTopLevel = True
                        else:
                            # there is at least one folder inside the root folder -> Project folder
                            oneFolderAtTopLevel = True
                        filteredPathList.append(path)
                if not (oneFileAtTopLevel and oneFolderAtTopLevel):
                    return Response(
                        jsonMessages.errorJsonResponse(
                            "The data does not match the required structure inside of the zipfile!"
                        ),
                        status=status.HTTP_406_NOT_ACCEPTABLE
                    )

                file_list = []
                for path in filteredPathList:
                    if not path.endswith('/'):
                        file_list.append(file_obj.open(path))

                file_list.append(read_me_file)

                gApi.create_repo(repoName, 'to be defined')  # TODO: description auslagern
                gApi.upload_files(repoName, file_list)
                
                # as the zipfile is redundant to the previous upload, the http-response will be sent before its upload is completed.
                thread = Thread(
                     target=gApi.upload_file,
                     args=(repoName, 'zippedFile_' + repoName + '.zip', raw_file)
                 )
                thread.start()

            except GithubException:
                response, statusCode = jsonMessages.errorGithubJsonResponse(sys.exception())
                return Response(response, status=statusCode)

            user.application.submission = time.time()
            user.application.status = Application.Status.IN_REVIEW
            user.application.githubRepo = repoName
            user.application.save()

            return Response(jsonMessages.successJsonResponse(), status=status.HTTP_200_OK)
        else:
            return Response(
                jsonMessages.errorJsonResponse("solution has already been submitted"),
                status=status.HTTP_400_BAD_REQUEST
            )