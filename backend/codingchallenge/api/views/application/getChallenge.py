from django.contrib.auth.models import User
from django.core.exceptions import ObjectDoesNotExist
from rest_framework import status
from rest_framework.response import Response

from ...include import jsonMessages
from ...models import Challenge, Application
from ...serializers import GetChallengeSerializer


def get(request):
    application_id = request.user.username

    try:
        user = User.objects.get(username=application_id)
    except ObjectDoesNotExist:
        return Response(
            jsonMessages.error_json_response("Application not found!"),
            status=status.HTTP_404_NOT_FOUND
        )

    try:
        application = Application.objects.get(applicationId=application_id)
        try:
            challenge_of_specific_application = Challenge.objects.get(id=application.challengeId)
            serializer = GetChallengeSerializer(challenge_of_specific_application, many=False)
            return Response(serializer.data, status=status.HTTP_200_OK)

        except Challenge.DoesNotExist:
            return Response(
                jsonMessages.error_json_response("The applications challenge can not be found!"),
                status=status.HTTP_404_NOT_FOUND
            )
        except Challenge.MultipleObjectsReturned:
            return Response(
                jsonMessages.error_json_response("Multiple challenges with the same id exist!"),
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    except Application.DoesNotExist:
        return Response(
            jsonMessages.error_json_response("The referenced application can not be found!"),
            status=status.HTTP_404_NOT_FOUND
        )
    except Application.MultipleObjectsReturned:
        return Response(
            jsonMessages.error_json_response("Multiple applications with the same id exist!"),
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
