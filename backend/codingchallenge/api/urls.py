# from django.conf.urls import url
from django.urls import path, include
from rest_framework.authtoken.views import obtain_auth_token 

from .views import applications, challenges


# Endpoint Definition

urlpatterns = [
    path('admin/login', obtain_auth_token),

    path('admin/applications/', applications.AdminApplicationsView.as_view()),
    path('admin/applications/<applicationId>', applications.AdminApplicationsView.as_view(), name="applicationId"),

    path('admin/challenges', challenges.AdminChallengesView.as_view()),
    path('admin/challenges/<challengeId>', challenges.AdminChallengesView.as_view(), name="challengeId"),

    path('application/loginWithKey', obtain_auth_token),
    path('application/submitChallenge', applications.SubmitApplicationView.as_view())
]