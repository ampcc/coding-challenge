from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import FileUploadParser

from .application import getApplicationStatus, getChallenge, loginWithApplicationKey, startChallenge, uploadSolution

class LoginWithApplicationKeyEndpoint(APIView):
    def post(self, request, *args, **kwargs):
        return loginWithApplicationKey.login(request, **kwargs)

class startChallengeEndpoint(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        return startChallenge.start(request)

class getApplicationStatusEndpoint(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        return getApplicationStatus.get(request)

class getChallengeEndpoint(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        return getChallenge.get(request)

class uploadSolutionEndpoint(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [FileUploadParser]

    def post(self, request, *args, **kwargs):
        return uploadSolution.upload(request)