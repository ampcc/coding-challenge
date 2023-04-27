import json
import random
import secrets
import string
import time
import os

from cryptography.fernet import Fernet
from dotenv import load_dotenv

# Authentication imports
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from django.contrib.auth.models import User

# RESTapi imports
from django.core import serializers
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from . import jsonMessages, expirySettings

from ..models import Application, Challenge

from ..serializers import GetApplicationSerializer, GetApplicationStatus, GetChallengeSerializer, PostApplicationSerializer




# endpoint: /api/admin/applications
class AdminApplicationsView(APIView):
    # grant permission only for admin user
    permission_classes = [IsAdminUser]

    name = "Admin Application View"
    description = "handling all requests for applications as a admin"

    # Implementation of GET Application and GET Applications
    def get(self, request, *args, **kwargs):
        
        # if kwargs has keys, then there is a specific call for an exact Application 
        # -> call is GET Application
        if kwargs.keys():
            applicationId = self.kwargs["applicationId"]
            application = Application.objects.filter(applicationId = applicationId).first()
            try:
                serializer = GetApplicationSerializer(application, many = False)
                return Response(serializer.data, status = status.HTTP_200_OK)
            except:
                return Response(jsonMessages.errorJsonResponse("Application ID not found!"), status = status.HTTP_404_NOT_FOUND)
       
        # if kwargs is empty, all Applications get returned
        # -> call is GET Applications
        else:
            applications = Application.objects
            serializer = GetApplicationSerializer(applications, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
    
    # default expiry timestamp
    expiryTimestamp = time.time() + expirySettings.daysUntilChallengeStart * 24 * 60 * 60

    # 4. Create Application
    # https://github.com/ampcc/coding-challenge/wiki/API-Documentation-for-admin-functions#4-create-application
    def post(self, request, *args, **kwargs):
        """
        create Application with
            required arguments:
                applicationId

            optional arguments:
                challengeId
                expiry
        """

        try:
            # random challenge
            challengeId = random.choice(Challenge.objects.all()).id

        except IndexError:
            return Response(jsonMessages.errorJsonResponse('there are no challenges in database'),
                            status=status.HTTP_422_UNPROCESSABLE_ENTITY)

        if not request.data:
            return Response(jsonMessages.errorJsonResponse('Body is empty'), status=status.HTTP_204_NO_CONTENT)

        try:

            if not len(request.data.get('applicationId')) == 8:
                return Response(jsonMessages.errorJsonResponse('applicationId has the wrong length'),
                                status=status.HTTP_400_BAD_REQUEST)

            if Application.objects.all().filter(
                    applicationId=request.data.get('applicationId')):
                return Response(jsonMessages.errorJsonResponse('ApplicationId already in use'),
                                status=status.HTTP_409_CONFLICT)

            if 'challengeId' in request.data:
                challengeId = request.data.get('challengeId')

            if 'expiry' in request.data:
                try:
                    self.expiryTimestamp = float(request.data.get('expiry'))
                except ValueError:
                    return Response(jsonMessages.errorJsonResponse('Wrong json attributes. Please check expiryTimestamp value!'), status=status.HTTP_400_BAD_REQUEST)
            else:
                self.expiryTimestamp = time.time() + expirySettings.daysUntilChallengeStart * 24 * 60 * 60

        except (AttributeError, TypeError):
            return Response(jsonMessages.errorJsonResponse('Wrong json attributes'), status=status.HTTP_400_BAD_REQUEST)

        alphabet = string.ascii_letters + string.digits
        password = ''.join(secrets.choice(alphabet) for i in range(16))    
        user = User.objects.create_user(username=request.data.get('applicationId'),
                                 password=password)
        user.save()

        # the key is build as follows: "applicationId+password". Note: The applicationId does always have 8 digits.
        keyPlain = request.data.get('applicationId') + "+" + password
        load_dotenv()
        fernet_key = os.getenv('ENCRYPTION_KEY')
        fernet = Fernet(fernet_key.encode())
        encKey = fernet.encrypt(keyPlain.encode()).decode("utf-8")

        # expiry note: The last possible start of the challenge is days + 3. So the applicant has three days to start the challenge
        data = {
            'applicationId': request.data.get('applicationId'),
            'challengeId': challengeId,
            'expiry': self.expiryTimestamp,
            'user': user.id
        }

        serializer = GetApplicationSerializer(data=data)
        if serializer.is_valid():
            serializer.save()

            applications = Application.objects.get(applicationId=request.data.get('applicationId'))
            postSerializer = PostApplicationSerializer(applications, many=False, context={'key': encKey, "applicationId": request.data.get('applicationId')})
            return Response(postSerializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # 5. Edit Application
    # https://github.com/ampcc/coding-challenge/wiki/API-Documentation-for-admin-functions#editApplication
    # /api/admin/applications/{applicationId}
    def put(self, request, *args, **kwargs):
        """
        create Application with
            query:
                applicationId
            optional arguments:
                applicationStatus
                challengeId
                expiry
        """
        allowedFields = ['applicationStatus', 'challengeId', 'expiry']

        try:
            application = Application.objects.filter(applicationId=self.kwargs["applicationId"]).first()

            if not application:
                raise TypeError

        except (KeyError, TypeError):
            return Response(jsonMessages.errorJsonResponse('applicationId not found'), status=status.HTTP_404_NOT_FOUND)

        serialized_application = json.loads(serializers.serialize("json", [application]))[0]

        statusCode = status.HTTP_200_OK

        if request.data:
            for key in request.data.keys():
                if key in allowedFields:
                    if key == allowedFields[0]:
                        if request.data.get(key) in Application.Status.values:
                            serialized_application['fields']['status'] = request.data.get(key)
                        else:
                            return Response(jsonMessages.errorJsonResponse("Invalid status!"), status=status.HTTP_400_BAD_REQUEST)
                    if key == allowedFields[1]:
                        if Challenge.objects.filter(id=request.data.get(key)):
                            serialized_application['fields'][key] = request.data.get(key)
                        else:
                            return Response(jsonMessages.errorJsonResponse("Invalid challengeId!"), status=status.HTTP_400_BAD_REQUEST)
                    if key == allowedFields[2]:
                        if request.data.get(key) > time.time():
                            serialized_application['fields']['expiry'] = request.data.get(key)
                        else:
                            return Response(jsonMessages.errorJsonResponse("Invalid expiry date!"), status=status.HTTP_400_BAD_REQUEST)
                else:
                    return Response(jsonMessages.errorJsonResponse("Field: " + key + " not valid!"), status=status.HTTP_400_BAD_REQUEST)

        else:
            return Response(jsonMessages.errorJsonResponse("No data provided!"), status=status.HTTP_204_NO_CONTENT)


        serializer = GetApplicationSerializer(application, data=serialized_application["fields"])

        if serializer.is_valid() and statusCode == status.HTTP_200_OK:
            serializer.save()
            return Response(serializer.data, status=statusCode)

        return Response(jsonMessages.errorJsonResponse("Please check input!"), status=status.HTTP_400_BAD_REQUEST)

    # 6. Delete Application
    # https://github.com/ampcc/coding-challenge/wiki/API-Documentation-for-admin-functions#6-delete-application
    # /api/admin/applications/{applicationId}
    def delete(self, request, *args, **kwargs):
        """
        delete Application with
            query:
                applicationId
        """
        try:
            application = Application.objects.filter(applicationId=self.kwargs["applicationId"]).first()

            if not application:
                raise TypeError

        except(KeyError, TypeError):
            return Response(status=status.HTTP_404_NOT_FOUND)

        application.delete()
        return Response(jsonMessages.successJsonResponse(), status=status.HTTP_200_OK)

### endpoint: /api/submitApplication
class SubmitApplicationView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request, *args, **kwargs):
        user = User.objects.get(username=request.user.username)
        if user.application.status < Application.Status.IN_REVIEW:
            user.application.submission = time.time()
            user.application.status = Application.Status.IN_REVIEW
            user.application.save()
            return Response({"success": "true"})
        else:
            return Response(jsonMessages.errorJsonResponse("Can not submit challenge! The challenge has already been submitted!"), status=status.HTTP_400_BAD_REQUEST)

# Implementation of GET Application Status
### endpoint: /api/getApplicationStatus
class StatusApplicationView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request, *args, **kwargs):
            user = User.objects.get(username = request.user.username)
            application = Application.objects.filter(applicationId = user.username).first()
            serializer = GetApplicationStatus(application, many = False)
            return Response(serializer.data, status = status.HTTP_200_OK)


class StartChallengeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        user = User.objects.get(username=request.user.username)

        if user.application.status >= Application.Status.CHALLENGE_STARTED:
            return Response(jsonMessages.errorJsonResponse("Can not start challenge! The challenge has already been started!"), status=status.HTTP_400_BAD_REQUEST)

        expiryTimestamp = user.application.expiry
        currentTimestamp = time.time()

        if expiryTimestamp - currentTimestamp < 0:
        # application is expired
            user.application.status = Application.Status.EXPIRED
            user.application.save()
            return Response(jsonMessages.errorJsonResponse("Can not start challenge! The application is expired since " + str(expiryTimestamp - currentTimestamp) + " seconds!"), status=status.HTTP_410_GONE)
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

