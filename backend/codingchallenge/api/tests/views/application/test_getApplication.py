from rest_framework import status
from rest_framework.test import APITestCase

from ...auth.mockAuth import MockAuth
from ....models.application import Application
from ....views import jsonMessages


class test_getApplication(APITestCase):

    def setUp(self):
        # Authorization
        MockAuth.admin(self)

        # Example Application in Database
        Application.objects.create(applicationId="12345678", challengeId=1, expiry=0, user_id=1)
        Application.objects.create(applicationId="user1234", challengeId=2, expiry=0, user_id=2)

    def test_missingToken(self):
        self.client.credentials()

        url = '/api/admin/applications/' + self.applicationId
        data = {}
        response = self.client.get(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_invalidToken(self):
        # test for invalid token (Used an applicant token)
        self.client.credentials(HTTP_AUTHORIZATION='Token 4f25709a420a92aa01cc67b091b92ac0247f168a')

        url = '/api/admin/applications/' + self.applicationId
        data = {}
        response = self.client.get(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_correctToken(self):
        # test with admin token (Funktioniert das??? oder passt id nicht zu token)
        self.client.credentials(HTTP_AUTHORIZATION='Token 648f5cad595ae411e2427997c469caaf74c1cce3')

        url = '/api/admin/applications/' + self.applicationId
        data = {}
        response = self.client.get(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, {
            "applicationId": "32n4j23s",
            "challengeId": 3,
            "expiry": 0,
            "user_id": 24
        })

    def test_wrongTokenFormat(self):
        # test for invalid token
        self.client.credentials(HTTP_AUTHORIZATION='Token 83438ysfdfhzz')

        url = '/api/admin/applications/' + self.applicationId
        data = {}
        response = self.client.get(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_wrongApplicationId(self):
        url = '/api/admin/applications/sdafskk1'

        data = {}
        response = self.client.get(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(response.data, jsonMessages.errorJsonResponse("Wrong applicationId! (Didnt match token)"))

    def test_applicationDoesNotExist(self):
        Application.objects.create(applicationId="InvalidApplication", challengeId=138, expiry=0, user_id=146)
        url = '/api/admin/applications/InvalidApplication'
        data = {}
        response = self.client.get(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(response.data, jsonMessages.errorJsonResponse("Wrong applicationId! (Didnt match token)"))

    def test_wrongUrl(self):
        url = '/api/admin/applicationsS12/' + self.applicationId
        data = {}
        response = self.client.get(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_applicationDoesNotExist(self):
        url = '/api/admin/applications/345'

        data = {}
        response = self.client.get(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(response.data, jsonMessages.errorJsonResponse("Wrong applicationId! (Didnt match token)"))

    def test_ignoreAdditionalData(self):
        self.client.credentials(HTTP_AUTHORIZATION='Token 648f5cad595ae411e2427997c469caaf74c1cce3')

        url = '/api/admin/applicationsS12/' + self.applicationId
        data = {
            "name": "NameSomething"
        }
        response = self.client.get(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, {
            "applicationId": "Correct1",
            "challengeId": 2,
            "expiry": 0,
            "user_id": 632
        })

    def test_callAsPost(self):
        url = '/api/admin/applications/' + self.applicationId
        data = {}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)
        self.assertEqual(Application.objects.count(), 11)

    def test_callAsPost(self):
        url = '/api/admin/applications/' + self.applicationId
        data = {}
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(Application.objects.count(), 11)

    def test_callNotAsUser(self):
        MockAuth.admin(self)

        url = '/api/admin/applications/' + self.applicationId
        data = {}
        response = self.client.get(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(response.data, jsonMessages.errorJsonResponse("No User"))
