from rest_framework import status
from rest_framework.test import APITestCase

from ...auth.mockAuth import MockAuth
from ....models.application import Application


class test_getApplications(APITestCase):
    def setUp(self):
        # Authorization
        MockAuth.admin(self)

        # Example Challenge in Database
        Application.objects.create(applicationId="12345678", challengeId=1, expiry=0, user_id=1)
        Application.objects.create(applicationId="user1234", challengeId=2, expiry=0, user_id=2)
        
    def test_missingToken(self):
        self.client.credentials()
        
        url = '/api/admin/applications/'
        data = {}
        response = self.client.get(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)