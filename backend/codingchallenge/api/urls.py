# from django.conf.urls import url
from django.urls import path, include
from rest_framework.authtoken.views import obtain_auth_token 

from .views import applications


# Endpoint Definition

urlpatterns = [
    path('admin/applications/', applications.AdminApplicationView.as_view()),

    path('login/', obtain_auth_token),

]