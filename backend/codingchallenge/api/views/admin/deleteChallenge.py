from rest_framework import status
from rest_framework.response import Response

from ...include import jsonMessages
from ...models import Challenge


def delete(**kwargs):
    try:
        challenge = Challenge.objects.get(id=kwargs["challengeId"])
    except Challenge.DoesNotExist:
        return Response(
            jsonMessages.error_json_response("No object found for given challengeId."),
            status=status.HTTP_404_NOT_FOUND
        )
    except Challenge.MultipleObjectsReturned:
        return Response(
            jsonMessages.error_json_response(
                "There have been found multiple challenges for the given challengeId. " +
                "This should never be the case."
                ), status=status.HTTP_409_CONFLICT
        )

    challenge.active = False
    challenge.save()
    return Response(jsonMessages.success_json_response(), status=status.HTTP_200_OK)
