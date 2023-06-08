from rest_framework import status
from rest_framework.test import APITestCase

from ...mock.mockAuth import MockAuth
from ....models.application import Application
from ....serializers import GetApplicationSerializer


class test_getApplications(APITestCase):
    url = '/api/admin/applications/'
    

    def setUp(self):
        MockAuth.admin(self)
        self.client.post('/api/admin/challenges/', {"challengeHeading": "TestChallenge", "challengeText": "Text Challenge 123"}, format='json')
        self.client.post(self.url, {"applicationId" : "TEST1234"}, format='json')
        self.client.post(self.url, {"applicationId" : "TEST4321"}, format='json')
    

    def test_successfulResponse(self):
        expected_data = GetApplicationSerializer(Application.objects.all(), many=True)
        response = self.client.get(self.url)
        self.assertEqual(response.data, expected_data.data)
    

    def test_wrongUrl(self):
        wrongUrl = '/api/admin/appppplications/'
        response = self.client.get(wrongUrl, {}, format='json')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)


    def test_missingToken(self):
        self.client.credentials()
        response = self.client.get(self.url, {}, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


    def test_invalidToken(self):
        self.client.credentials(HTTP_AUTHORIZATION='Token 4f25709a420a92aa01cc67b091b92ac0247f168a')
        response = self.client.get(self.url, {}, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        

    def test_wrongTokenFormat(self):
        self.client.credentials(HTTP_AUTHORIZATION='Token 8234kawsdjfas')
        response = self.client.get(self.url, {}, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


    def test_ignoreAdditionalData(self):
        data = {
            "name": "ExampleName"
        }
        expected_data = GetApplicationSerializer(Application.objects.all(), many=True)
        response = self.client.get(self.url, data)
        self.assertEqual(response.data, expected_data.data)
    