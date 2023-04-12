# from django.conf.urls import url
from django.urls import path, include


from .views import *

# Endpoint Definition

urlpatterns = [
    path('challenge/', TestChallengeApiView.TestChallengeApiView.as_view()),
    path('application/', TestApplicationApiView.TestApplicationApiView.as_view()),

    path('testAdminView/', AdminApiView.AdminView.as_view()),
    path('testApplicantView/', ApplicantApiView.ApplicantView.as_view()),
    path('createApplicant/', AdminApiView.addApplicant.as_view()),
]