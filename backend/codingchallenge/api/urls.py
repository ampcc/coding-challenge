# from django.conf.urls import url
from django.urls import path, include
from rest_framework.authtoken.views import obtain_auth_token 

from .views import *


# Endpoint Definition

urlpatterns = [
    path('admin/challenges/<challengeId>', challenges.AdminChallengesView.as_view(), name="challengeId"), 
    path('admin/challenges', challenges.AdminChallengesView.as_view()),     
    path('challenges/', challenges.Challenges.as_view()),

    path('login/', obtain_auth_token),
]