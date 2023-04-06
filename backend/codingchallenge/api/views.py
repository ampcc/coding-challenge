from django.shortcuts import render

# Create your views here.

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework import permissions
from .models import Challenge, Application
from .serializers import TestChallengeSerializer, TestApplicationSerializer


class TestChallengeApiView(APIView):
    # add permission to check if user is authenticated
    # permission_classes = [permissions.IsAuthenticated]

    name = "Test Challenge Api View"
    description = "get challenges or post a new one"

    # 1. List all
    def get(self, request, *args, **kwargs):
        '''
        get challenges with following columns:
            id,
            challengeHeader,
            challengeText
        '''
        challenges = Challenge.objects
        serializer = TestChallengeSerializer(challenges, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    # 2. Create
    def post(self, request, *args, **kwargs):
        '''
        post challenge with following columns:
            challengeHeading,
            challengeText
        '''
        data = {
            'challengeHeading': request.data.get('challengeHeading'),
            'challengeText': request.data.get('challengeText')
        }
        serializer = TestChallengeSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class TestApplicationApiView(APIView):
    # add permission to check if user is authenticated
    # permission_classes = [permissions.IsAuthenticated]

    name = "Test Application Api View"
    description = "get applications or post a new one"

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
        serializer = TestApplicationSerializer(applications, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    # 2. Create
    def post(self, request, *args, **kwargs):
        '''
        post Application with follwing columns:
            applicationId,
            challengeId
            operatingSystem,
            programingLanguage,
            expiry,
            submission,
            githubRepo,
            status
        '''
        data = {
            'applicationId': request.data.get('applicationId'),
            'challengeId': request.data.get('challengeId'),
            'operatingSystem': request.data.get('operatingSystem'),
            'programmingLanguage': request.data.get('programmingLanguage'),
            'expiry': request.data.get('expiry'),
            'submission': request.data.get('submission'),
            'githubRepo': request.data.get('githubRepo'),
            'status': request.data.get('status')
        }
        serializer = TestApplicationSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
