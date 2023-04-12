from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from ...models import Challenge
from ...serializers import TestChallengeSerializer


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
