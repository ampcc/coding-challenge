from rest_framework import status
from rest_framework.response import Response
from ...models import Challenge
from ...serializers import GetChallengeSerializer
from ...include import jsonMessages

def get(**kwargs):
    try:
        challengeId = kwargs["challengeId"]
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
        