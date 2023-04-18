from rest_framework import status
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from ...models import Challenge
from ...serializers import TestChallengeSerializer


# This view returnes a spefific challenge which id is passed through the url
# Only this challenge is returned, assuming there are no duplicate ids  
class GetChallengeAdminApiView(APIView):
    # add permission to check if user is authenticated
    permission_classes = [IsAdminUser]

    name = "Get Challenge Admin Api View"
    description = "get a specific challenge as an admin"

    # 1. List all
    def get(self, request, challengeId):
        '''
        get a challenge with following columns:
            id,
            challengeHeader,
            challengeText
        '''
        challenge = Challenge.objects.filter(challengeId=challengeId)
        serializer = TestChallengeSerializer(challenge)
        return Response(serializer.data, status=status.HTTP_200_OK)
