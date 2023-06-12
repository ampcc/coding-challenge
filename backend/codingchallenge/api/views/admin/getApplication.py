from rest_framework import status
from rest_framework.response import Response
from ...include import jsonMessages
from ...models import Application
from ...serializers import (
    GetApplicationSerializer
)

def get(**kwargs):
    applicationId = kwargs["applicationId"]
    application = Application.objects.get(applicationId=applicationId)
    try:
        serializer = GetApplicationSerializer(application, many=False)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except:
        return Response(
            jsonMessages.errorJsonResponse("Application ID not found!"),
            status=status.HTTP_404_NOT_FOUND
        )