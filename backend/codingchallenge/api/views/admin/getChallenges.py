from rest_framework import status
from rest_framework.response import Response

from ...models import Challenge
from ...serializers import GetChallengeSerializer


def get():
    challenges = Challenge.objects.all()
    serializer = GetChallengeSerializer(challenges, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)
