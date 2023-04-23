from rest_framework import status
from rest_framework.test import APITestCase

from ...auth.mockAuth import MockAuth
from ....models.application import Application
from ....views import jsonMessages


class test_deleteApplication(APITestCase):

    def setUp(self):
        # Authorization
        MockAuth.admin(self)

        # default url
        Application.objects.create(applicationId="TEST1234", challengeId=1, expiry=0, user_id=1)
        self.applicationId = getattr(Application.objects.first(), 'applicationId')

    def test_missingAuth(self):
        # remove headers for this test
        self.client.credentials()

        url = '/api/admin/applications/' + self.applicationId

        self.assertEqual(Application.objects.count(), 1)

        response = self.client.delete(url, format='json')
        self.assertEqual(Application.objects.count(), 1)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_wrongUrl(self):
        url = '/api/admin/dumb'

        self.assertEqual(Application.objects.count(), 1)

        response = self.client.delete(url, format='json')
        self.assertEqual(Application.objects.count(), 1)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_noApplicationId(self):
        url = '/api/admin/applications/'

        self.assertEqual(Application.objects.count(), 1)

        response = self.client.delete(url, format='json', )
        self.assertEqual(Application.objects.count(), 1)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_wrongApplicationId(self):
        url = '/api/admin/applications/' + '4321TSET'

        self.assertEqual(Application.objects.count(), 1)

        response = self.client.delete(url, format='json', )
        self.assertEqual(Application.objects.count(), 1)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_correctInput(self):
        url = '/api/admin/applications/' + self.applicationId

        self.assertEqual(Application.objects.count(), 1)

        response = self.client.delete(url, format='json')
        self.assertEqual(Application.objects.count(), 0)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, jsonMessages.successJsonResponse())
