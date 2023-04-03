# from django.conf.urls import url
from django.urls import path, include

from .views import (
    TestChallengeApiView,
    TestApplicationApiView,
)

urlpatterns = [
    path('challenge/', TestChallengeApiView.as_view()),
    path('application/', TestApplicationApiView.as_view()),
]