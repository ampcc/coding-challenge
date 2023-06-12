import json
import time
from django.core import serializers
from django.core.exceptions import ObjectDoesNotExist
from rest_framework import status
from rest_framework.response import Response
from ...include import jsonMessages
from ...models import Application, Challenge
from ...serializers import (
    GetApplicationSerializer
)

def edit(request, **kwargs):   
    allowedFields = ['applicationStatus', 'challengeId', 'expiry']

    try:
        application = Application.objects.get(applicationId=kwargs["applicationId"])

    except (KeyError, ObjectDoesNotExist):
        return Response(jsonMessages.errorJsonResponse('Application not found'), status=status.HTTP_404_NOT_FOUND)

    serialized_application = json.loads(serializers.serialize("json", [application]))[0]

    statusCode = status.HTTP_200_OK

    if request.data:
        for key in request.data.keys():
            if key in allowedFields:
                if key == allowedFields[0]:
                    if request.data.get(key) in Application.Status.values:
                        serialized_application['fields']['status'] = request.data.get(key)
                    else:
                        return Response(
                            jsonMessages.errorJsonResponse("Invalid status!"),
                            status=status.HTTP_400_BAD_REQUEST
                        )
                if key == allowedFields[1]:
                    if Challenge.objects.filter(id=request.data.get(key)).exists():
                        serialized_application['fields']['challengeId'] = request.data.get(key)
                    else:
                        return Response(
                            jsonMessages.errorJsonResponse("Passed Challenge ID does not exist!"),
                            status=status.HTTP_404_NOT_FOUND
                        )
                if key == allowedFields[2]:
                    if request.data.get(key) > time.time():
                        serialized_application['fields']['expiry'] = request.data.get(key)
                    else:
                        return Response(
                            jsonMessages.errorJsonResponse("Invalid expiry date!"),
                            status=status.HTTP_400_BAD_REQUEST
                        )
            else:
                return Response(
                    jsonMessages.errorJsonResponse("Field: " + key + " not valid!"),
                    status=status.HTTP_400_BAD_REQUEST
                )

    else:
        return Response(jsonMessages.errorJsonResponse("No data provided!"), status=status.HTTP_204_NO_CONTENT)

    serializer = GetApplicationSerializer(application, data=serialized_application["fields"])

    if serializer.is_valid() and statusCode == status.HTTP_200_OK:
        serializer.save()
        return Response(serializer.data, status=statusCode)

    return Response(jsonMessages.errorJsonResponse("Please check input!"), status=status.HTTP_400_BAD_REQUEST)