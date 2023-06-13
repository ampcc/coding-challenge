from django.core import serializers
import json
from rest_framework import status
from rest_framework.response import Response
from ...models import Challenge
from ...serializers import GetChallengeSerializer
from ...include import jsonMessages


def edit(request, **kwargs):
    try:
        challenge = Challenge.objects.get(id=kwargs["challengeId"])
        serialized_challenge = json.loads(serializers.serialize("json", [challenge]))[0]
    except Challenge.DoesNotExist:
        return Response(jsonMessages.error_json_response("No object found for given challengeId."), status=status.HTTP_404_NOT_FOUND)
    except Challenge.MultipleObjectsReturned:
        return Response(jsonMessages.error_json_response("There have been found multiple challenges for the given challengeId. " +
                                                        "This should never be the case."), status=status.HTTP_409_CONFLICT)
    
    # check for valid body arguments
    keys_of_request = request.data.keys()
    both_arguments_in_body = "challengeHeading" in keys_of_request and "challengeText" in keys_of_request
    either_argument_in_body = "challengeHeading" in keys_of_request or "challengeText" in keys_of_request
    if not keys_of_request:
        # no update values passed in body
        serializer = GetChallengeSerializer(challenge)
        return Response(serializer.data, status=status.HTTP_200_OK)
    elif len(keys_of_request) > 2:
        # passed too many arguments
        return Response(jsonMessages.error_json_response("Passed too many arguments in body. " +
                                                        "Only 'challengeHeading' and 'challengeText' are permitted."),
                                                        status=status.HTTP_400_BAD_REQUEST)
    elif len(keys_of_request) == 2 and not both_arguments_in_body or \
            len(keys_of_request) == 1 and not either_argument_in_body:
        # passed two arguments but at least one is not permitted or
        # passed one argument which is not permitted
        return Response(jsonMessages.error_json_response("Only 'challengeHeading' and 'challengeText' are permitted."),
                        status=status.HTTP_400_BAD_REQUEST)

    for key in keys_of_request:
        serialized_challenge["fields"][key] = request.data[key]
    
    serializer = GetChallengeSerializer(challenge, data=serialized_challenge["fields"])
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)