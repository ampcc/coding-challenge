from rest_framework import status
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from ...models import Challenge
from ...serializers import TestChallengeSerializer


# This view returnes all challenges
class GetChallengesAdminApiView(APIView):
    # check if user is authenticated
    permission_classes = [IsAdminUser]

    def get(self, request):
        '''
        Returns a challenge via HTTP-Get with the following columns:
            - id
            - challengeHeader
            - challengeText
        '''
        challenge = Challenge.objects.all()
        serializer = TestChallengeSerializer(challenge, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
