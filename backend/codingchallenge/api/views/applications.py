from django.core import serializers
import json
import time
import random

# Authentication imports
from rest_framework.permissions import IsAdminUser, IsAuthenticated

# RESTapi imports
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView


# import model
from ..models import Application, Challenge

# import serializer
from ..serializers import ApplicationSerializer

# import errorMessage class
from . import errorMessage

### endpoint: /api/admin/applications
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
        '''
        create Application with
            required arguments:
                applicationId,
                applicantEmail

            optional arguments:
                challengeId
                days
        '''

        try:
            # random challenge
            challengeId = random.choice(Challenge.objects.all()).id

        except IndexError:
            return Response({'detail': 'there are no challenges in database'},
                            status=status.HTTP_422_UNPROCESSABLE_ENTITY)

        if request.data:
            return Response({'detail': 'body is empty'}, status=status.HTTP_204_NO_CONTENT)

        try:

            if not len(request.data.get('applicationId')) == 8:
                return Response({'detail': 'applicationId has the wrong length'}, status=status.HTTP_400_BAD_REQUEST)

            if Application.objects.all().filter(
                    applicationId=request.data.get('applicationId')):
                return Response({'detail': 'applicationId already in use'}, status=status.HTTP_409_CONFLICT)

            if 'challengeId' in request.data:
                challengeId = request.data.get('challengeId')

            if 'days' in request.data:
                days = request.data.get('days')

        except AttributeError:
            return Response({'detail': 'wrong json attributes'}, status=status.HTTP_400_BAD_REQUEST)

        data = {
            'applicationId': request.data.get('applicationId'),
            'applicantEmail': request.data.get('applicantEmail'),
            'challengeId': challengeId,
            'expiry': time.time() + self.days * 24 * 60 * 60
        }

        serializer = ApplicationSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            successObj = {"success": "true"}

            return Response(successObj, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # 5. Edit Application
    # https://github.com/ampcc/coding-challenge/wiki/API-Documentation-for-admin-functions#editApplication
    # /api/admin/applications/{applicationId}
    def put(self, request, *args, **kwargs):
        '''
        create Application with
            required arguments:
                applicationId,


            optional arguments:
                applicationStatus
                applicantEmail
                challengeId
                extendDays
        '''

        applicationId = Application.objects.filter(id=self.kwargs["applicationId"]).first()

        serialized_application = json.loads(serializers.serialize("json", [applicationId]))[0]

        for key in request.data.keys():
            serialized_application["fields"][key] = request.data[key]

        serializer = ApplicationSerializer(Application, data=serialized_application["fields"])
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
