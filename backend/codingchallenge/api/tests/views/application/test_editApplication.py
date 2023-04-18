import time

from django.contrib.auth.models import User
from rest_framework import status

from rest_framework.authtoken.models import Token
from rest_framework.test import APITestCase

from ....models.challenge import Challenge
from ....models.application import Application

# Authorization
from ...auth.mockAuth import MockAuth


class test_editApplication(APITestCase):

    def setUp(self):
        return