import sys
from django.contrib.auth.models import User
from github import GithubException
from rest_framework import status
from rest_framework.response import Response
from ...include import jsonMessages
from ...include.githubApi import GithubApi

def delete(**kwargs):
    g_api = GithubApi()
    try:
        user = User.objects.get(username=kwargs["applicationId"])

    except(KeyError, TypeError, User.DoesNotExist):
        return Response(
            jsonMessages.error_json_response("Application ID not found!"),
            status=status.HTTP_404_NOT_FOUND
        )

    # if the repository has not been created yet, there shouldnt be a GitHub API-Call
    if user.application.githubRepo:
        try:
            g_api.delete_repo(user.application.githubRepo)
        except GithubException:
            response, statusCode = jsonMessages.error_github_json_response(sys.exception())
            return Response(response, status=statusCode)

    try:
        user.delete()
    except:
        return Response(
            jsonMessages.error_json_response("Can't delete user due to an unknown error!"),
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

    return Response(jsonMessages.success_json_response(), status=status.HTTP_200_OK)