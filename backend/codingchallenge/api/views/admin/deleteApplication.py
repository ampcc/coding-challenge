import sys
from django.contrib.auth.models import User
from github import GithubException
from rest_framework import status
from rest_framework.response import Response
from ...include import jsonMessages
from ...include.githubApi import GithubApi

def delete(**kwargs):
    gApi = GithubApi()
    try:
        user = User.objects.get(username=kwargs["applicationId"])

    except(KeyError, TypeError, User.DoesNotExist):
        return Response(
            jsonMessages.errorJsonResponse("Application ID not found!"),
            status=status.HTTP_404_NOT_FOUND
        )

    # if the repository has not been created yet, there shouldnt be a GitHub API-Call
    if user.application.githubRepo:
        try:
            gApi.delete_repo(user.application.githubRepo)
        except GithubException:
            response, statusCode = jsonMessages.errorGithubJsonResponse(sys.exception())
            return Response(response, status=statusCode)

    try:
        user.delete()
    except:
        return Response(
            jsonMessages.errorJsonResponse("Can't delete user due to an unknown error!"),
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

    return Response(jsonMessages.successJsonResponse(), status=status.HTTP_200_OK)