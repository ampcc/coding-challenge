# from django.conf.urls import url
from django.urls import path
from rest_framework.authtoken.views import obtain_auth_token
from .views import adminEndpoints
from .views.authentication import authentication
from .views.challenges import challenges
from .views.applications import applications


# Endpoint Definition

urlpatterns = [
    path('admin/login/', obtain_auth_token),
    
    path('admin/applications/', adminEndpoints.ApplicationEndpoints.as_view()),
    path('admin/changePassword/', adminEndpoints.ChangePasswordEndpoint.as_view()),

    path('admin/applications/<applicationId>', adminEndpoints.ApplicationEndpoints.as_view(), name="applicationId"),
    path('admin/applications/results/<applicationId>', adminEndpoints.ApplicationResultEndpoint.as_view(), name="applicationId"),

    path('admin/challenges/', adminEndpoints.ApplicationChallengesEndpoint.as_view()),
    path('admin/challenges/<challengeId>', adminEndpoints.ApplicationChallengesEndpoint.as_view(), name="challengeId"),

    path('application/loginWithKey/<key>', authentication.KeyAuthentication.as_view(), name="key"),
    path('application/getApplicationStatus/', applications.StatusApplicationView.as_view()),
    path('application/startChallenge/', applications.StartChallengeView.as_view()),
    path('application/challenges/', challenges.ApplicationChallengesView.as_view()),

    path('application/uploadSolution/', applications.UploadSolutionView.as_view()),
]
