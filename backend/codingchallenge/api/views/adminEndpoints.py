from rest_framework.views import APIView
from rest_framework.permissions import IsAdminUser

from .admin import changePassword, getApplication, getApplications, createApplication, editApplication, deleteApplication, getResult, getChallenge, getChallenges, createChallenge, editChallenge, deleteChallenge

class ChangePasswordEndpoint(APIView):
    permission_classes = [IsAdminUser]
    
    #https://github.com/ampcc/coding-challenge/wiki/API-Documentation-for-admin-functions#changePassword
    def put(self, request, *args, **kwargs):
        return changePassword.change(request)

class ApplicationEndpoints(APIView):
    permission_classes = [IsAdminUser]
    
    def get(self, request, *args, **kwargs):
        if kwargs.keys():
            #https://github.com/ampcc/coding-challenge/wiki/API-Documentation-for-admin-functions#getApplication
            return getApplication.get(**kwargs)
        else:
            #https://github.com/ampcc/coding-challenge/wiki/API-Documentation-for-admin-functions#getApplications
            return getApplications.get()
        
    #https://github.com/ampcc/coding-challenge/wiki/API-Documentation-for-admin-functions#createApplication
    def post(self, request, *args, **kwargs):
        return createApplication.create(request)
    
    #https://github.com/ampcc/coding-challenge/wiki/API-Documentation-for-admin-functions#editApplication
    def put(self, request, *args, **kwargs):
        return editApplication.edit(request, **kwargs)
    
    #https://github.com/ampcc/coding-challenge/wiki/API-Documentation-for-admin-functions#deleteApplication  
    def delete(self, request, *args, **kwargs):
        return deleteApplication.delete(**kwargs)
        
class ApplicationResultEndpoint(APIView):
    permission_classes = [IsAdminUser]
    
    #https://github.com/ampcc/coding-challenge/wiki/API-Documentation-for-admin-functions#getResult
    def get(self, request, *args, **kwargs):
        return getResult.get(**kwargs)
    
class ApplicationChallengesEndpoint(APIView):
    permission_classes = [IsAdminUser]
    
    def get(self, request, *args, **kwargs):
        if kwargs.keys():
            #https://github.com/ampcc/coding-challenge/wiki/API-Documentation-for-admin-functions#getChallenge
            return getChallenge.get(**kwargs)
        else:
            #https://github.com/ampcc/coding-challenge/wiki/API-Documentation-for-admin-functions#getChallenges
            return getChallenges.get()
    
    #https://github.com/ampcc/coding-challenge/wiki/API-Documentation-for-admin-functions#createChallenge
    def post(self, request, *args, **kwargs):
        return createChallenge.create(request)
    
    #https://github.com/ampcc/coding-challenge/wiki/API-Documentation-for-admin-functions#editChallenge
    def put(self, request, *args, **kwargs):
        return editChallenge.edit(request, **kwargs)
    
    #https://github.com/ampcc/coding-challenge/wiki/API-Documentation-for-admin-functions#deleteChallenge
    def delete(self, request, *args, **kwargs):
        return deleteChallenge.delete(**kwargs)