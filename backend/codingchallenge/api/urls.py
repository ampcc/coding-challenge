# from django.conf.urls import url
from django.urls import path, include
from rest_framework.authtoken.views import obtain_auth_token 

from .views import *


# Endpoint Definition

urlpatterns = [
    path('challenge/', TestChallengeApiView.TestChallengeApiView.as_view()),
    path('application/', ApplicationView.as_view()),

    path('login/', obtain_auth_token),
    path('testAdminView/', AdminApiView.AdminView.as_view()),
    path('testApplicantView/', ApplicantApiView.ApplicantView.as_view()),
    path('createApplicant/', AdminApiView.addApplicant.as_view()),
]