# from django.conf.urls import url
from django.urls import path, include
from rest_framework.authtoken.views import obtain_auth_token

from .views import applications, challenges


# Endpoint Definition

urlpatterns = [
    path('admin/login', obtain_auth_token),
    
    path('admin/applications/', applications.AdminApplicationsView.as_view()),
    path('admin/applications/<applicationId>', applications.AdminApplicationsView.as_view(), name="applicationId"),
    path('challenge/', TestChallengeApiView.TestChallengeApiView.as_view()),
    path('/api/admin/challenges', GetChallengesAdminApiView.GetChallengesAdminApiView.as_view()),
    path('/api/admin/challenges/<int:challengeId>', GetChallengeAdminApiView.GetChallengeAdminApiView.as_view()),
    path('/api/application/challenges/<int:applicationId>', GetChallengeApplicationApiView.GetChallengeApplicationApiView.as_view()),
    path('application/', TestApplicationApiView.TestApplicationApiView.as_view()),

    path('admin/challenges', challenges.AdminChallengesView.as_view()),
    path('admin/challenges/<challengeId>', challenges.AdminChallengesView.as_view(), name="challengeId"),

    path('application/loginWithKey', obtain_auth_token),
    path('application/getApplicationStatus', applications.StatusApplicationView.as_view()),
    path('application/submitChallenge', applications.SubmitApplicationView.as_view()),
    path('application/startChallenge', applications.StartChallengeView.as_view())
]
    path('admin/challenges', GetChallengesAdminApiView.GetChallengesAdminApiView.as_view()),
    path('admin/challenges/<int:challengeId>', GetChallengeAdminApiView.GetChallengeAdminApiView.as_view()),
    path('application/challenges/<int:applicationId>', GetChallengeApplicationApiView.GetChallengeApplicationApiView.as_view()),
    path('application/', TestApplicationApiView.TestApplicationApiView.as_view()),

    path('login/', obtain_auth_token),
    path('testAdminView/', AdminApiView.AdminView.as_view()),
    path('testApplicantView/', ApplicantApiView.ApplicantView.as_view()),
    path('createApplicant/', AdminApiView.addApplicant.as_view()),
]
