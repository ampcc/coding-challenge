import sys
from django.core.exceptions import ObjectDoesNotExist
from github import GithubException
from rest_framework import status
from rest_framework.response import Response
from ...include import jsonMessages
from ...include.githubApi import GithubApi
from ...models import Application


def get(**kwargs):
    gApi = GithubApi()
    try:
        application = Application.objects.get(applicationId=kwargs["applicationId"])

    except(KeyError, ObjectDoesNotExist):
        return Response(
            jsonMessages.errorJsonResponse("Application ID not found!"),
            status=status.HTTP_404_NOT_FOUND
        )

    if not application.githubRepo:
        return Response(
            jsonMessages.errorJsonResponse("Can not find repo"),
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        githubUrl = gApi.get_repo_url(application.githubRepo)
        linterResult = gApi.get_linter_result(application.githubRepo)

    except GithubException:
        response, statusCode = jsonMessages.errorGithubJsonResponse(sys.exception())
        return Response(response, status=statusCode)

    return Response(
        {
            'githubUrl': githubUrl,
            'content': linterResult
        }, status=status.HTTP_200_OK
    )