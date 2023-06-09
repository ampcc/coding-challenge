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
from ..include import jsonMessages

class AdminChallengesView(APIView):
    permission_classes = [IsAdminUser]

    name = "Admin Challenges View"
    description = "handling all requests for challenges as a admin"



    # 9. Get Challenge (Admin)
    # https://github.com/ampcc/coding-challenge/wiki/API-Documentation-for-admin-functions#9-get-challenge
    # /api/admin/challenges/{challengeId}

    # 10. Get Challenges (Admin)
    # https://github.com/ampcc/coding-challenge/wiki/API-Documentation-for-admin-functions#10-get-challenges
    # /api/admin/challenges/
    def get(self, request, *args, **kwargs):
        """
        get all challenges or only the specified challenge
            optional arguments:
                challengeId

            (on provided challengeId) returns a single object with the following values:
                id
                challengeHeader
                challengeText

            (no provided challengeId) returns an array of objects with the following values:
                id
                challengeHeader
                challengeText
        """
        if kwargs.keys():
            # getChallenge
            try:
                challengeId = self.kwargs["challengeId"]
                try:
                    challenge = Challenge.objects.get(id=challengeId)
                    serializer = GetChallengeSerializer(challenge, many=False)
                    return Response(serializer.data, status=status.HTTP_200_OK)
                
                except Challenge.DoesNotExist:
                    return Response(jsonMessages.errorJsonResponse("The desired challenge can not be found!"), status=status.HTTP_404_NOT_FOUND)  
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
        try:
            challenge = Challenge.objects.get(id=self.kwargs["challengeId"])
            serialized_challenge = json.loads(serializers.serialize("json", [challenge]))[0]
        except Challenge.DoesNotExist:
            return Response(jsonMessages.errorJsonResponse("No object found for given challengeId."), status=status.HTTP_404_NOT_FOUND)
        except Challenge.MultipleObjectsReturned:
            return Response(jsonMessages.errorJsonResponse("There have been found multiple challenges for the given challengeId. " +
                                                           "This should never be the case."), status=status.HTTP_409_CONFLICT)

        # check for valid body arguments
        keys_of_request = request.data.keys()
        both_arguments_in_body = "challengeHeading" in keys_of_request and "challengeText" in keys_of_request
        either_argument_in_body = "challengeHeading" in keys_of_request or "challengeText" in keys_of_request
        if not keys_of_request:
            # no update values passed in body
            serializer = GetChallengeSerializer(challenge)
            return Response(serializer.data, status=status.HTTP_200_OK)
        elif len(keys_of_request) > 2:
            # passed too many arguments
            return Response(jsonMessages.errorJsonResponse("Passed too many arguments in body. " +
                                                           "Only 'challengeHeading' and 'challengeText' are permitted."),
                                                           status=status.HTTP_400_BAD_REQUEST)
        elif len(keys_of_request) == 2 and not both_arguments_in_body or \
             len(keys_of_request) == 1 and not either_argument_in_body:
            # passed two arguments but at least one is not permitted or
            # passed one argument which is not permitted
            return Response(jsonMessages.errorJsonResponse("Only 'challengeHeading' and 'challengeText' are permitted."),
                            status=status.HTTP_400_BAD_REQUEST)

        for key in keys_of_request:
            serialized_challenge["fields"][key] = request.data[key]
        
        serializer = GetChallengeSerializer(challenge, data=serialized_challenge["fields"])
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # /api/admin/challenges/<challengeId>
    def delete(self, request, *args, **kwargs):
        try:
            challenge = Challenge.objects.get(id=self.kwargs["challengeId"])
        except Challenge.DoesNotExist:
            return Response(jsonMessages.errorJsonResponse("No object found for given challengeId."), status=status.HTTP_404_NOT_FOUND)
        except Challenge.MultipleObjectsReturned:
            return Response(jsonMessages.errorJsonResponse("There have been found multiple challenges for the given challengeId. " +
                                                           "This should never be the case."), status=status.HTTP_409_CONFLICT)

        challenge.active = False
        challenge.save()
        return Response(jsonMessages.successJsonResponse(), status=status.HTTP_200_OK)



class ApplicationChallengesView(APIView):
    permission_classes = [IsAuthenticated]

    name = "Get Challenge Application View"
    description = "get a specific challenge for the corespnding applicant"


    # 17. Get Challenge (Application)
    # https://github.com/ampcc/coding-challenge/wiki/API-Documentation-for-applicant-functions#17-get-challenge
    # /api/application/challenges/
    def get(self, request, *args, **kwargs):
        """
        get the challenge of the specified application
            required arguments:
                applicationId

            returns a single object with the following values:
                id
                challengeHeader
                challengeText
        """
        applicationId = request.user.username

        user = User.objects.get(username = applicationId)

        try:
            application = Application.objects.get(applicationId=applicationId)
            try:
                challengeOfSpecificApplication = Challenge.objects.get(id=application.challengeId)
                serializer = GetChallengeSerializer(challengeOfSpecificApplication, many=False)
                return Response(serializer.data, status=status.HTTP_200_OK)
            
            except Challenge.DoesNotExist:
                return Response(jsonMessages.errorJsonResponse("The applications challenge can not be found!"), status=status.HTTP_404_NOT_FOUND)  
            except Challenge.MultipleObjectsReturned:
                return Response(jsonMessages.errorJsonResponse("Multiple challenges with the same id exist!"), status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
        except Application.DoesNotExist:
            return Response(jsonMessages.errorJsonResponse("The referenced application can not be found!"), status=status.HTTP_404_NOT_FOUND)
        except Application.MultipleObjectsReturned:
            return Response(jsonMessages.errorJsonResponse("Multiple applications with the same id exist!"), status=status.HTTP_500_INTERNAL_SERVER_ERROR)