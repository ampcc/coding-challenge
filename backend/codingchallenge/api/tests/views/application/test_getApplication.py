import unittest.mock as mock
from rest_framework import status
from rest_framework.test import APITestCase

from ...mock.mockAuth import MockAuth


class test_getApplication(APITestCase):
    url = '/api/admin/applications/'

    def setUp(self):
        MockAuth.admin(self)
        self.client.post('/api/admin/challenges/', {"challengeHeading": "TestChallenge", "challengeText": "Text Challenge 123"}, format='json')
        self.client.post(self.url, {"applicationId": "TEST1234"}, format="json")
        self.application_id = "TEST1234"


    def test_successfulResponse(self):
        response = self.client.get(self.url + self.application_id, {}, format='json') 
        challenge_id = self.client.get(self.url).data[0]['challengeId']
        user = self.client.get(self.url).data[0]['user']
        testdata = {
            'applicationId': 'TEST1234', 
            'challengeId': challenge_id, 
            'operatingSystem': '', 
            'programmingLanguage': '', 
            'expiry': mock.ANY, 
            'submission': 0.0,
            'githubRepo': '', 
            'status': 0, 
            'created': mock.ANY,
            'modified': mock.ANY, 
            'user': user
        }
            
        self.assertEqual(response.data, testdata) 


    def test_wrongUrl(self):
        url = '/api/admin/applicationsasdfasd/' + self.application_id
        response = self.client.get(url, {}, format='json')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)


    def test_missingToken(self):
        self.client.credentials()
        response = self.client.get(self.url + self.application_id, {}, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


    def test_invalidToken(self):
        self.client.credentials(HTTP_AUTHORIZATION='Token 4f25709a420a92aa01cc67b091b92ac0247f168a')
        response = self.client.get(self.url + self.application_id, {}, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


    def test_wrongTokenFormat(self):
        self.client.credentials(HTTP_AUTHORIZATION='Token 8234kawsdjfas')
        response = self.client.get(self.url + self.application_id, {}, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


    def test_ignoreAdditionalData(self):
        data = {
            "name": "ExampleName"
        }
        response = self.client.get(self.url + self.application_id, data)
        challenge_id = self.client.get(self.url).data[0]['challengeId']
        user = self.client.get(self.url).data[0]['user']

        self.assertEqual(response.data, {
            'applicationId': 'TEST1234', 
            'challengeId': challenge_id, 
            'operatingSystem': '', 
            'programmingLanguage': '', 
            'expiry': mock.ANY, 
            'submission': 0.0, 
            'githubRepo': '', 
            'status': 0, 
            'created': mock.ANY,
            'modified': mock.ANY, 
            'user': user})
