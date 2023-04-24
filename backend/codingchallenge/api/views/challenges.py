from django.core import serializers
import json

# Authentication imports
from rest_framework.permissions import IsAdminUser, IsAuthenticated

# RESTapi imports
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

# import model
from ..models import Challenge

# import serializer
from ..serializers import GetChallengeSerializer

# import errorMessage class
from . import jsonMessages

class AdminChallengesView(APIView):
    permission_classes = [IsAdminUser]

    name = "Admin Challenges View"
    description = "handling all requests for challenges as a admin"

    # /api/admin/challenges
    # /api/admin/challenges/<challengeId>
    def get(self, request, *args, **kwargs):
        if kwargs.keys():
            # getChallenge
            challengeId = self.kwargs["challengeId"]
            challenge = Challenge.objects.filter(id=challengeId).first()
            try:
                serializer = GetChallengeSerializer(challenge, many=False)
                return Response(serializer.data, status=status.HTTP_200_OK)
            except:
                return Response(jsonMessages.errorJsonResponse("Challenge ID not found!"), status=status.HTTP_404_NOT_FOUND)
        else:
            # getChallenges
            challenges = Challenge.objects.all()
            serializer = GetChallengeSerializer(challenges, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)

    # /api/admin/challenges
    def post(self, request, *args, **kwargs):
        serializer = GetChallengeSerializer(data=request.data)
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
        
        serializer = GetChallengeSerializer(challenge, data=serialized_challenge["fields"])
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # /api/admin/challenges/<challengeId>
    def delete(self, request, *args, **kwargs):
        challenge = Challenge.objects.filter(id=self.kwargs["challengeId"]).first()
        try:
            challenge.delete()
            return Response(jsonMessages.successJsonResponse(), status=status.HTTP_200_OK)
        except:
            return Response(jsonMessages.errorJsonResponse("Could not delete challenge " + self.kwargs["challengeId"] + "!"), status=status.HTTP_404_NOT_FOUND)
        

class Challenges(APIView):
    permission_classes = [IsAuthenticated]

    name = "Applicant Challenges View"
    description = "handling all requests for challenges as a applicant"