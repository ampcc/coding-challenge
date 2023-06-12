from django.core import serializers
import json
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from ...models import Challenge, Application
from ...serializers import GetChallengeSerializer
from ...include import jsonMessages


def delete(**kwargs):
    try:
        challenge = Challenge.objects.get(id=kwargs["challengeId"])
    except Challenge.DoesNotExist:
        return Response(jsonMessages.errorJsonResponse("No object found for given challengeId."), status=status.HTTP_404_NOT_FOUND)
    except Challenge.MultipleObjectsReturned:
        return Response(jsonMessages.errorJsonResponse("There have been found multiple challenges for the given challengeId. " +
                                                        "This should never be the case."), status=status.HTTP_409_CONFLICT)

    challenge.active = False
    challenge.save()
    return Response(jsonMessages.successJsonResponse(), status=status.HTTP_200_OK)