import sys
from django.core.exceptions import ObjectDoesNotExist
from github import GithubException
from rest_framework import status
from rest_framework.response import Response
from ...include import jsonMessages
from ...include.githubApi import GithubApi
from ...models import Application


def get(**kwargs):
    g_api = GithubApi()
    try:
        application = Application.objects.get(applicationId=kwargs["applicationId"])

    except(KeyError, ObjectDoesNotExist):
        return Response(
            jsonMessages.error_json_response("Application ID not found!"),
            status=status.HTTP_404_NOT_FOUND
        )

    if not application.githubRepo:
        return Response(
            jsonMessages.error_json_response("Can not find repo"),
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        github_url = g_api.get_repo_url(application.githubRepo)
        linter_result = g_api.get_linter_result(application.githubRepo)

    except GithubException:
        response, status_code = jsonMessages.error_github_json_response(sys.exception())
        return Response(response, status=status_code)

    return Response(
        {
            'githubUrl': github_url,
            'content': linter_result
        }, status=status.HTTP_200_OK
    )