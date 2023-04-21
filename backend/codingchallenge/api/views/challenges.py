from django.core import serializers
import json

# Authentication imports
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from django.contrib.auth.models import User

# RESTapi imports
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

# import model
from ..models import Challenge, Application

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
            try:
                challengeId = self.kwargs["challengeId"]
                try:
                    challenge = Challenge.objects.get(id=challengeId)
                    serializer = GetChallengeSerializer(challenge, many=False)
                    return Response(serializer.data, status=status.HTTP_200_OK)
                
                except Challenge.DoesNotExist:
                    return Response(jsonMessages.errorJsonResponse("The applications challenge can not be found!"), status=status.HTTP_404_NOT_FOUND)  
                except Challenge.MultipleObjectsReturned:
                    return Response(jsonMessages.errorJsonResponse("Multiple challenges with the same id exist!"), status=status.HTTP_500_INTERNAL_SERVER_ERROR)

            except KeyError:
                return Response(jsonMessages.errorJsonResponse("Parameter challengeId is missing!"), status=status.HTTP_400_BAD_REQUEST)
        
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
            return Response(status=status.HTTP_200_OK)
        except:
            return Response(status=status.HTTP_404_NOT_FOUND)


# endpoint: /api/application/challenges/<applicationId>
class ApplicationChallengesView(APIView):
    permission_classes = [IsAuthenticated]

    name = "Get Challenge Application View"
    description = "get a specific challenge for the corespnding applicant"

    def get(self, request, *args, **kwargs):
        """
        get the challenge of the specified application
            required arguments:
                applicationId

            returns:
                id
                challengeHeader
                challengeText
        """

        user = User.objects.get(username = request.user.username)

        try:
            applicationId = self.kwargs["applicationId"]
            if applicationId != user.username:
                return Response(jsonMessages.errorJsonResponse("Wrong pair of token and applicationId provided!"), status=status.HTTP_403_FORBIDDEN)
            
            try:
                application = Application.objects.get(applicationId=applicationId)
                try:
                    challengeOfSpecificApplication = Challenge.objects.get(id=application.challengeId)
                    serializer = ChallengeSerializer(challengeOfSpecificApplication, many=False)
                    return Response(serializer.data, status=status.HTTP_200_OK)
                
                except Challenge.DoesNotExist:
                    return Response(jsonMessages.errorJsonResponse("The applications challenge can not be found!"), status=status.HTTP_404_NOT_FOUND)  
                except Challenge.MultipleObjectsReturned:
                    return Response(jsonMessages.errorJsonResponse("Multiple challenges with the same id exist!"), status=status.HTTP_500_INTERNAL_SERVER_ERROR)
                
            except Application.DoesNotExist:
                return Response(jsonMessages.errorJsonResponse("The referenced application can not be found!"), status=status.HTTP_404_NOT_FOUND)
            except Application.MultipleObjectsReturned:
                return Response(jsonMessages.errorJsonResponse("Multiple applications with the same id exist!"), status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        except KeyError:
            return Response(jsonMessages.errorJsonResponse("Parameter applicationId is missing!"), status=status.HTTP_400_BAD_REQUEST)

