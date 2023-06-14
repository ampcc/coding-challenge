from rest_framework import status
from rest_framework.response import Response

from ...models import Application
from ...serializers import (
    GetApplicationSerializer
)


def get():
    applications = Application.objects
    serializer = GetApplicationSerializer(applications, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)
