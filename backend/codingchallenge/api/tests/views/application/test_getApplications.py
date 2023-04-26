from rest_framework import status
from rest_framework.test import APITestCase

from ...auth.mockAuth import MockAuth
from ....models.application import Application
from ....views import jsonMessages


class test_getApplications(APITestCase):
    # Do we need this test?
    def setUp(self):
        # Authorization
        MockAuth.admin(self)

        # Example Application in Database
        Application.objects.create(applicationId="12345678", challengeId=1, expiry=0, user_id=1)
        Application.objects.create(applicationId="user1234", challengeId=2, expiry=0, user_id=2)

    def test_missingToken(self):
        self.client.credentials()

        url = '/api/admin/applications/'
        data = {}
        response = self.client.get(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_invalidToken(self):
        # test for invalid token (Used an applicant token)
        self.client.credentials(HTTP_AUTHORIZATION='Token 4f25709a420a92aa01cc67b091b92ac0247f168a')

        url = '/api/admin/applications/'
        data = {}
        response = self.client.get(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_correctToken(self):
        # test with admin token
        self.client.credentials(HTTP_AUTHORIZATION='Token 648f5cad595ae411e2427997c469caaf74c1cce3')

        url = '/api/admin/applications/'
        data = {}
        response = self.client.get(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, {
            "applicationId": "Test1234",
            "challengeId": 3,
            "expiry": 0,
            "user_id": 99
        })

    def test_wrongTokenFormat(self):
        # test for invalid token
        self.client.credentials(HTTP_AUTHORIZATION='Token 83438')

        url = '/api/admin/applications/'
        data = {}
        response = self.client.get(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_wrongUrl(self):
        url = '/api/admin/applicationsS12/'
        data = {}
        response = self.client.get(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_ignoreAdditionalData(self):
        self.client.credentials(HTTP_AUTHORIZATION='Token 648f5cad595ae411e2427997c469caaf74c1cce3')

        url = '/api/admin/applications/'
        data = {
            "name": "ExampleName"
        }
        response = self.client.get(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, {
            "applicationId": "T1234est",
            "challengeId": 2,
            "expiry": 0,
            "user_id": 78
        })

    def test_callAsPost(self):
        url = '/api/admin/applications/'
        data = {}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)
        self.assertEqual(Application.objects.count(), 11)

    def test_callAsPost(self):
        url = '/api/admin/applications/'
        data = {}
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(Application.objects.count(), 11)

    def test_callNotAsUser(self):
        MockAuth.admin(self)

        url = '/api/admin/applications/'
        data = {}
        response = self.client.get(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(response.data, jsonMessages.errorJsonResponse("Wrong pair of token and applicationId provided!"))
