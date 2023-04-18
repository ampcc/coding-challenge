from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAdminUser, IsAuthenticated

from ...models import Challenge
from ...serializers import ChallengeSerializer
from .. import errorMessage

class ChallengesAdminView(APIView):
    permission_classes = [IsAdminUser]

    # /api/admin/challenges
    # /api/admin/challenges/<challengeId>
    def get(self, request, *args, **kwargs):
        if kwargs.keys():
            # getChallenge
            challengeId = self.kwargs["challengeId"]
            challenge = Challenge.objects.filter(id = challengeId)
            try:
                serializer = ChallengeSerializer(challenge[0], many=False)
                return Response(serializer.data, status=status.HTTP_200_OK)
            except:
                return Response(errorMessage.errorJsonResponse("Challenge ID not found!"), status=status.HTTP_404_NOT_FOUND)     
        else:
            # getChallenges
            challenges = Challenge.objects.all()
            serializer = ChallengeSerializer(challenges, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)

    # /api/admin/challenges
    def post(self, request, *args, **kwargs):
        serializer = ChallengeSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class Challenges(APIView):
    permission_classes = [IsAuthenticated]
