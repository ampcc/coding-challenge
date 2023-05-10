import time

from rest_framework import status
from rest_framework.test import APITestCase

from ...auth.mockAuth import MockAuth
from ....models.application import Application
from ....models.challenge import Challenge
from ....views import jsonMessages
from ....views import expirySettings

import unittest.mock as mock

class test_changeAdminPassword(APITestCase):
    url = '/api/admin/changePassword/'

    def setUp(self):
        # Authorization
        MockAuth.admin(self)

    def test_noData(self):
        response = self.client.put(self.url, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data["detail"], "Wrong keys sent! Can not process request!")

    def test_emptyStringsCorrectKeys(self):
        data = {
            "oldPassword": "",
            "newPassword": "admin1",
        }
        response = self.client.put(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data["detail"], "Password(s) must not be empty!")

        data = {
            "oldPassword": "admin",
            "newPassword": "",
        }
        response = self.client.put(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data["detail"], "Password(s) must not be empty!")
      
    def test_wrongOldPassword(self):
        data = {
            "oldPassword": "asfsdf",
            "newPassword": "admin1",
        }
        response = self.client.put(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(response.data["detail"], "The old password does not match the currently logged in admin user account!")
  
    def test_correctRequest(self):
        data = {
            "oldPassword": "admin",
            "newPassword": "admin1",
        }
        response = self.client.put(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_202_ACCEPTED)
        self.assertEqual(response.data["success"], "true")