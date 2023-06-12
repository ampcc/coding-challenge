from rest_framework.views import APIView
from rest_framework.permissions import IsAdminUser

from .admin import changePassword, getApplication, getApplications, createApplication, editApplication, deleteApplication, getResult, getChallenge, getChallenges, createChallenge, editChallenge, deleteChallenge

class ChangePasswordEndpoint(APIView):
    permission_classes = [IsAdminUser]
    
    def put(self, request, *args, **kwargs):
        return changePassword.change(request)

class ApplicationEndpoints(APIView):
    permission_classes = [IsAdminUser]
    
    def get(self, request, *args, **kwargs):
        if kwargs.keys():
            return getApplication.get(**kwargs)
        else:
            return getApplications.get()
                
    def post(self, request, *args, **kwargs):
        return createApplication.create(request)
        
    def put(self, request, *args, **kwargs):
        return editApplication.edit(request, **kwargs)
        
    def delete(self, request, *args, **kwargs):
        return deleteApplication.delete(**kwargs)
        
class ApplicationResultEndpoint(APIView):
    permission_classes = [IsAdminUser]
    
    def get(self, request, *args, **kwargs):
        return getResult.get(**kwargs)
    
class ApplicationChallengesEndpoint(APIView):
    permission_classes = [IsAdminUser]
    
    def get(self, request, *args, **kwargs):
        if kwargs.keys():
            return getChallenge.get(**kwargs)
        else:
            return getChallenges.get()
    
    def post(self, request, *args, **kwargs):
        return createChallenge.create(request)
    
    def put(self, request, *args, **kwargs):
        return editChallenge.edit(request, **kwargs)
    
    def delete(self, request, *args, **kwargs):
        return deleteChallenge.delete(**kwargs)