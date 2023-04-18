import math
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
class AdminApplicationView(APIView):
    # grant permission only for admin user
    permission_classes = [IsAdminUser]

    name = "Admin Application View"
    description = "handling all requests for applications as a admin"

    # 1. List all
    def get(self, request, *args, **kwargs):
        '''
        get Application with follwing columns:
            applicationId,
            operatingSystem,
            programingLanguage,
            expiry,
            submission,
            githubRepo,
            status,
            created,
            modified
        '''
        applications = Application.objects
        serializer = ApplicationSerializer(applications, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    # 2. Create
    def post(self, request, *args, **kwargs):
        '''
        post Application with
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
            # default 2 days time for start
            days = 2

        except IndexError:
            return Response({'detail': 'there are no challenges in database'},
                            status=status.HTTP_422_UNPROCESSABLE_ENTITY)

        if len(request.data) == 0:
            return Response({'detail': 'body is empty'}, status=status.HTTP_204_NO_CONTENT)

        try:

            if not len(request.data.get('application').get('applicationId')) == 8:
                return Response({'detail': 'applicationId has the wrong length'}, status=status.HTTP_400_BAD_REQUEST)

            if Application.objects.all().filter(
                    applicationId=request.data.get('application').get('applicationId')):
                return Response({'detail': 'applicationId already in use'}, status=status.HTTP_409_CONFLICT)

            if 'challengeId' in request.data.get('application'):
                challengeId = request.data.get('application').get('challengeId')

            if 'days' in request.data.get('application'):
                days = request.data.get('application').get('days')

        except AttributeError:
            return Response({'detail': 'wrong json attributes'}, status=status.HTTP_400_BAD_REQUEST)

        data = {
            'applicationId': request.data.get('application').get('applicationId'),
            'applicantEmail': request.data.get('application').get('applicantEmail'),
            'challengeId': challengeId,
            'expiry': time.time() + days * 24 * 60 * 60
        }

        serializer = ApplicationSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            successObj = {"success": "true"}

            return Response(successObj, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
