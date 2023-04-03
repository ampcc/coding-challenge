# from django.conf.urls import url
from django.urls import path, include

from .views import (
    TestListApiView,
)

urlpatterns = [
    path('task/', TestListApiView.as_view()),
]