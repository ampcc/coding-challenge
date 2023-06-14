from rest_framework.parsers import FileUploadParser
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView

from .application import getApplicationStatus, getChallenge, loginWithApplicationKey, startChallenge, uploadSolution


class LoginWithApplicationKeyEndpoint(APIView):
    # https://github.com/ampcc/coding-challenge/wiki/API-Documentation-for-applicant-functions#loginWithApplicationKey
    def post(self, request, *args, **kwargs):
        return loginWithApplicationKey.login(request, **kwargs)


class StartChallengeEndpoint(APIView):
    permission_classes = [IsAuthenticated]

    # https://github.com/ampcc/coding-challenge/wiki/API-Documentation-for-applicant-functions#startChallenge
    def get(self, request, *args, **kwargs):
        return startChallenge.start(request)


class GetApplicationStatusEndpoint(APIView):
    permission_classes = [IsAuthenticated]

    # https://github.com/ampcc/coding-challenge/wiki/API-Documentation-for-applicant-functions#getApplicationStatus
    def get(self, request, *args, **kwargs):
        return getApplicationStatus.get(request)


class GetChallengeEndpoint(APIView):
    permission_classes = [IsAuthenticated]

    # https://github.com/ampcc/coding-challenge/wiki/API-Documentation-for-applicant-functions#getChallenge
    def get(self, request, *args, **kwargs):
        return getChallenge.get(request)


class UploadSolutionEndpoint(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [FileUploadParser]

    # https://github.com/ampcc/coding-challenge/wiki/API-Documentation-for-applicant-functions#uploadSolution
    def post(self, request, *args, **kwargs):
        return uploadSolution.upload(request)
