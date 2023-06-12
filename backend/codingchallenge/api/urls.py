# from django.conf.urls import url
from django.urls import path
from rest_framework.authtoken.views import obtain_auth_token
from .views import adminEndpoints
from .views import applicationEndpoints

urlpatterns = [
    path('admin/login/', obtain_auth_token),
    
    path('admin/applications/', adminEndpoints.ApplicationEndpoints.as_view()),
    path('admin/changePassword/', adminEndpoints.ChangePasswordEndpoint.as_view()),

    path('admin/applications/<applicationId>', adminEndpoints.ApplicationEndpoints.as_view(), name="applicationId"),
    path('admin/applications/results/<applicationId>', adminEndpoints.ApplicationResultEndpoint.as_view(), name="applicationId"),

    path('admin/challenges/', adminEndpoints.ApplicationChallengesEndpoint.as_view()),
    path('admin/challenges/<challengeId>', adminEndpoints.ApplicationChallengesEndpoint.as_view(), name="challengeId"),

    path('application/loginWithKey/<key>', applicationEndpoints.LoginWithApplicationKeyEndpoint.as_view(), name="key"),
    path('application/getApplicationStatus/', applicationEndpoints.getApplicationStatusEndpoint.as_view()),
    path('application/startChallenge/', applicationEndpoints.startChallengeEndpoint.as_view()),
    path('application/challenges/', applicationEndpoints.getChallengeEndpoint.as_view()),

    path('application/uploadSolution/', applicationEndpoints.uploadSolutionEndpoint.as_view()),
]
