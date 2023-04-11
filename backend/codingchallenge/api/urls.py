# from django.conf.urls import url
from django.urls import path, include

# from .views.application import TestApplicationApiView
# from .views.challenge import TestChallengeApiView

from .views import *

# Endpoint Definition

urlpatterns = [
    path('challenge/', TestChallengeApiView.TestChallengeApiView.as_view()),
    path('application/', TestApplicationApiView.TestApplicationApiView.as_view()),
]