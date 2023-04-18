from rest_framework import status
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response
from rest_framework.views import APIView

from ...models import Challenge
from ...serializers import TestChallengeSerializer


# This view returnes a spefific challenge which id is passed through the url
# Only this challenge is returned, assuming there are no duplicate ids  
class GetChallengeAdminApiView(APIView):
    # check if user is authenticated
    # permission_classes = [IsAdminUser]

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

        try:
            challenge = Challenge.objects.get(id=challengeId)
            serializer = TestChallengeSerializer(challenge, many=False)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except:
            return Response("The requested challenge can not be found!", status=status.HTTP_404_NOT_FOUND)
            # return Response(errorMessage.errorJsonResponse("Challenge ID not found!"), status=status.HTTP_404_NOT_FOUND)
