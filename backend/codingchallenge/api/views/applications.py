import json
import random
import secrets
import string
import time

# Authentication imports
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from django.contrib.auth.models import User

# RESTapi imports
from django.core import serializers
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from . import jsonMessages

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
    
    # default 2 days time for start
    days = 2

    # 4. Create Application
    # https://github.com/ampcc/coding-challenge/wiki/API-Documentation-for-admin-functions#4-create-application
    def post(self, request, *args, **kwargs):
        """
        create Application with
            required arguments:
                applicationId

            optional arguments:
                challengeId
                days
        """

        try:
            # random challenge
            challengeId = random.choice(Challenge.objects.all()).id

        except IndexError:
            return Response(jsonMessages.errorJsonResponse('there are no challenges in database'),
                            status=status.HTTP_422_UNPROCESSABLE_ENTITY)

        if not request.data:
            return Response(jsonMessages.errorJsonResponse('body is empty'), status=status.HTTP_204_NO_CONTENT)

        try:

            if not len(request.data.get('applicationId')) == 8:
                return Response(jsonMessages.errorJsonResponse('applicationId has the wrong length'),
                                status=status.HTTP_400_BAD_REQUEST)

            if Application.objects.all().filter(
                    applicationId=request.data.get('applicationId')):
                return Response(jsonMessages.errorJsonResponse('applicationId already in use'),
                                status=status.HTTP_409_CONFLICT)

            if 'challengeId' in request.data:
                challengeId = request.data.get('challengeId')

            if 'days' in request.data:
                self.days = request.data.get('days')

        except AttributeError:
            return Response(jsonMessages.errorJsonResponse('wrong json attributes'), status=status.HTTP_400_BAD_REQUEST)

        except TypeError:
            return Response(jsonMessages.errorJsonResponse('wrong json attributes'), status=status.HTTP_400_BAD_REQUEST)

        alphabet = string.ascii_letters + string.digits
        key = ''.join(secrets.choice(alphabet) for i in range(16))    
        user = User.objects.create_user(username=request.data.get('applicationId'),
                                 password=key)
        user.save()

        # expiry note: The last possible start of the challenge is days + 3. So the applicant has three days to start the challenge
        data = {
            'applicationId': request.data.get('applicationId'),
            'challengeId': challengeId,
            'expiry': time.time() + (self.days + 3) * 24 * 60 * 60,
            'user': user.id
        }

        serializer = GetApplicationSerializer(data=data)
        if serializer.is_valid():
            serializer.save()

            applications = Application.objects.get(applicationId=request.data.get('applicationId'))
            postSerializer = PostApplicationSerializer(applications, many=False, context={'key': key, "applicationId": request.data.get('applicationId')})
            return Response(postSerializer.data, status=status.HTTP_200_OK)
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
                extendDays
        """
        allowedFields = ['applicationStatus', 'challengeId', 'extendDays']

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
                            statusCode = status.HTTP_400_BAD_REQUEST
                            break
                    if key == allowedFields[1]:
                        serialized_application['fields'][key] = request.data.get(key)
                    if key == allowedFields[2]:
                        if Challenge.objects.filter(id=request.data.get(key)):
                            serialized_application['fields'][key] = request.data.get(key)
                        else:
                            statusCode = status.HTTP_400_BAD_REQUEST
                            break
                    if key == allowedFields[3]:
                        timeStamp = time.time() + request.data.get(key) * 24 * 60 * 60
                        serialized_application['fields']['expiry'] = timeStamp
                else:
                    statusCode = status.HTTP_400_BAD_REQUEST
                    break
        else:
            statusCode = status.HTTP_204_NO_CONTENT

        serializer = GetApplicationSerializer(application, data=serialized_application["fields"])

        if serializer.is_valid():
            serializer.save()

            return Response(serializer.data, status=statusCode)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

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
        user.application.submission = time.time()
        user.application.save()
        return Response({"success": "true"})


# Implementation of GET Application Status
### endpoint: /api/getApplicationStatus
class StatusApplicationView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request, *args, **kwargs):
            user = User.objects.get(username = request.user.username)
            application = Application.objects.filter(applicationId = user.username).first()
            serializer = GetApplicationStatus(application, many=False)
            return Response(serializer.data, status = status.HTTP_200_OK)


class StartChallengeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        user = User.objects.get(username=request.user.username)
        expiryTimestamp = user.application.expiry
        currentTimestamp = time.time()
        timestampDifference = expiryTimestamp - currentTimestamp

        # seconds
        allowedTimeframeToStart = 5 * 24 * 60 * 60
        allowedTimeframeToFinish = 2 * 24 * 60 * 60

        # applicationIsExpired
        if timestampDifference > allowedTimeframeToStart:
            secondsSinceExpiration = currentTimestamp - expiryTimestamp
            # because the applicant didn't complete the challenge in the timeframe, the application gets archived.
            user.application.status = Application.Status.ARCHIVED
            user.application.save()           
            return Response(jsonMessages.errorJsonResponse("Can not start challenge! The application is expired since", secondsSinceExpiration, "seconds!"), status=status.HTTP_410_GONE)
        # application is still running
        else:
            # if the application is even before last three days, the expiration will be set to exactly three days.
            # otherwise the already short expiration timeframe (< 3 days remains the same)
            if timestampDifference > allowedTimeframeToFinish:
                user.application.expiry = time.time() + allowedTimeframeToFinish

        challenge = Challenge.objects.filter(id=request.user.application.challengeId).first()
        try:   
            user.application.status = Application.Status.CHALLENGE_STARTED
            
            # saves applicationStatus and new expiration date
            user.application.save()
            serializer = GetChallengeSerializer(challenge, many=False)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except:
            return Response(jsonMessages.errorJsonResponse("Challenge ID not found!"), status=status.HTTP_404_NOT_FOUND)

