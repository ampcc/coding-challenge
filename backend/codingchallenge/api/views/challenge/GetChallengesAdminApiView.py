from rest_framework import status
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from ...models import Challenge
from ...serializers import TestChallengeSerializer


# This view returnes a spefific challenge which id is passed through the url
# Only this challenge is returned, assuming there are no duplicate ids  
class GetChallengesAdminApiView(APIView):

    permission_classes = [IsAdminUser]

    name = "Get Challenges Admin Api View"
    description = "get all challenges as an admin"

    # 1. List all
    def get(self, request):
        '''
        get a challenge with following columns:
            id,
            challengeHeader,
            challengeText
        '''
        challenge = Challenge.objects.all()
        serializer = TestChallengeSerializer(challenge, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
