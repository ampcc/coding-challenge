from rest_framework import status
from rest_framework.response import Response

from ...include import jsonMessages
from ...models import Challenge
from ...serializers import GetChallengeSerializer


def get(**kwargs):
    try:
        challenge_id = kwargs["challengeId"]
        try:
            challenge = Challenge.objects.get(id=challenge_id)
            serializer = GetChallengeSerializer(challenge, many=False)
            return Response(serializer.data, status=status.HTTP_200_OK)

        except Challenge.DoesNotExist:
            return Response(
                jsonMessages.error_json_response("The desired challenge can not be found!"),
                status=status.HTTP_404_NOT_FOUND
            )
        except Challenge.MultipleObjectsReturned:
            return Response(
                jsonMessages.error_json_response("Multiple challenges with the same id exist!"),
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    except KeyError:
        return Response(
            jsonMessages.error_json_response("Parameter challenge ID is missing!"),
            status=status.HTTP_400_BAD_REQUEST
        )
