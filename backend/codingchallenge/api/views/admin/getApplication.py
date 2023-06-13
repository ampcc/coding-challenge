from django.core.exceptions import ObjectDoesNotExist
from rest_framework import status
from rest_framework.response import Response
from ...include import jsonMessages
from ...models import Application
from ...serializers import (
    GetApplicationSerializer
)

def get(**kwargs):
    application_id = kwargs["applicationId"]

    try:
        application = Application.objects.get(applicationId=application_id)
    except ObjectDoesNotExist:
        return Response(
            jsonMessages.error_json_response("Application not found!"),
            status=status.HTTP_404_NOT_FOUND
        )

    try:
        serializer = GetApplicationSerializer(application, many=False)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except:
        return Response(
            jsonMessages.error_json_response("Application ID not found!"),
            status=status.HTTP_404_NOT_FOUND
        )