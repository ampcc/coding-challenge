from django.core import serializers
import json

# Authentication imports
from rest_framework.permissions import IsAdminUser, IsAuthenticated

# RESTapi imports
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from ...models import Challenge
from ...serializers import ChallengeSerializer
from .. import errorMessage

class AdminChallengesView(APIView):
    permission_classes = [IsAdminUser]

    # /api/admin/challenges
    # /api/admin/challenges/<challengeId>
    def get(self, request, *args, **kwargs):
        if kwargs.keys():
            # getChallenge
            challengeId = self.kwargs["challengeId"]
            challenge = Challenge.objects.filter(id=challengeId).first()
            try:
                serializer = ChallengeSerializer(challenge, many=False)
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
    
    # /api/admin/challenges/<challengeId>
    def put(self, request, *args, **kwargs):
        challenge = Challenge.objects.filter(id=self.kwargs["challengeId"]).first()
        serialized_challenge = json.loads(serializers.serialize("json", [challenge]))[0]

        for key in request.data.keys():
            serialized_challenge["fields"][key] = request.data[key]
        
        serializer = ChallengeSerializer(challenge, data=serialized_challenge["fields"])
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # /api/admin/challenges/<challengeId>
    def delete(self, request, *args, **kwargs):
        challenge = Challenge.objects.filter(id=self.kwargs["challengeId"]).first()
        try:
            challenge.delete()
            return Response(status=status.HTTP_200_OK)
        except:
            return Response(status=status.HTTP_404_NOT_FOUND)
        

class Challenges(APIView):
    permission_classes = [IsAuthenticated]
