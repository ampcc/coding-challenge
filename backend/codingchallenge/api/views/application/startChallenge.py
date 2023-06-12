import time
from django.contrib.auth.models import User
from django.core.exceptions import ObjectDoesNotExist
from rest_framework import status
from rest_framework.response import Response
from ...include import jsonMessages, expirySettings
from ...models import Application, Challenge
from ...serializers import GetChallengeSerializer

def start(request):
    try:
        user = User.objects.get(username=request.user.username)
    except ObjectDoesNotExist:
        return Response(
            jsonMessages.errorJsonResponse("Application not found!"),
            status=status.HTTP_404_NOT_FOUND
        )

    if user.application.status >= Application.Status.CHALLENGE_STARTED:
        return Response(
            jsonMessages.errorJsonResponse("Can not start challenge! The challenge has already been started!"),
            status=status.HTTP_400_BAD_REQUEST
        )

    expiryTimestamp = user.application.expiry
    currentTimestamp = time.time()

    if expiryTimestamp - currentTimestamp < 0:
        # application is expired
        user.application.status = Application.Status.EXPIRED
        user.application.save()
        return Response(
            jsonMessages.errorJsonResponse(
                "Can not start challenge! The application is expired since " + str(
                    expiryTimestamp - currentTimestamp
                ) + " seconds!"
            ), status=status.HTTP_410_GONE
        )
    # application is still running
    else:
        user.application.expiry = time.time() + expirySettings.daysToFinishSinceChallengeStart * 24 * 60 * 60
        user.application.status = Application.Status.CHALLENGE_STARTED
    try:
        challenge = Challenge.objects.get(id=request.user.application.challengeId)

        # saves applicationStatus and new expiration date
        user.application.save()
        serializer = GetChallengeSerializer(challenge, many=False)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except:
        return Response(jsonMessages.errorJsonResponse("Challenge ID not found!"), status=status.HTTP_404_NOT_FOUND)
