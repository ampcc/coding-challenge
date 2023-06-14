from django.contrib.auth.models import User
from django.core.exceptions import ObjectDoesNotExist
from rest_framework import status
from rest_framework.response import Response

from ...include import jsonMessages
from ...models import Application
from ...serializers import GetApplicationStatus

def get(request):
    try:
        user = User.objects.get(username=request.user.username)
    except ObjectDoesNotExist:
        return Response(
            jsonMessages.error_json_response("Application not found!"),
            status=status.HTTP_404_NOT_FOUND
        )

    try:
        application = Application.objects.get(applicationId=user.username)
    except Application.DoesNotExist:
        return Response(jsonMessages.error_json_response("The referenced application can not be found!"), status=status.HTTP_404_NOT_FOUND)
    except Application.MultipleObjectsReturned:
        return Response(jsonMessages.error_json_response("Multiple applications with the same id exist!"), status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    serializer = GetApplicationStatus(application, many=False)
    return Response(serializer.data, status=status.HTTP_200_OK)
