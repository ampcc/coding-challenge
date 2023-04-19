import json
import random
import time

from django.core import serializers
from rest_framework import status
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response
from rest_framework.views import APIView

from . import jsonMessages

from ..models import Application, Challenge

from ..serializers import ApplicationSerializer


# endpoint: /api/admin/applications
class AdminApplicationsView(APIView):
    # grant permission only for admin user
    permission_classes = [IsAdminUser]

    name = "Admin Application View"
    description = "handling all requests for applications as a admin"

    # default 2 days time for start
    days = 2

    # 4. Create Application
    # https://github.com/ampcc/coding-challenge/wiki/API-Documentation-for-admin-functions#4-create-application
    def post(self, request, *args, **kwargs):
        """
        create Application with
            required arguments:
                applicationId,
                applicantEmail

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

        data = {
            'applicationId': request.data.get('applicationId'),
            'applicantEmail': request.data.get('applicantEmail'),
            'challengeId': challengeId,
            'expiry': time.time() + self.days * 24 * 60 * 60
        }

        serializer = ApplicationSerializer(data=data)
        if serializer.is_valid():
            serializer.save()

            return Response(jsonMessages.successJsonResponse(), status=status.HTTP_201_CREATED)

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
                applicantEmail
                challengeId
                extendDays
        """
        allowedFields = ['applicationStatus', 'applicantEmail', 'challengeId', 'extendDays']

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

        serializer = ApplicationSerializer(application, data=serialized_application["fields"])

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
