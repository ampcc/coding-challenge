import unittest.mock as mock
from rest_framework import status
from rest_framework.test import APITestCase

from ....models.challenge import Challenge

from ...auth.mockAuth import MockAuth
from ....models.application import Application
from ....views import jsonMessages
from ....serializers import GetApplicationSerializer


class test_getApplication(APITestCase):
    url = '/api/admin/applications/'

    def setUp(self):
        # Authorization
        MockAuth.admin(self)

        #Challenge is needed to create Application tests
        Challenge.objects.create(challengeHeading="TestChallenge", challengeText="This is a Test Challenge")
        
        #Create Application Object
        Application.objects.create(applicationId="TEST1234", challengeId=1, expiry=0, user_id=1, modified='', created='')
        self.applicationId = "TEST1234"
    
    #Test the successful Response of getApplications, its also a test for the right token
    def test_successfulResponse(self):
        response = self.client.get(self.url + self.applicationId, {}, format='json')
        
        self.assertEqual(response.data, {
            'applicationId': 'TEST1234', 
            'challengeId': 1, 
            'operatingSystem': '', 
            'programmingLanguage': '', 
            'expiry': 0.0, 
            'submission': 0.0, 
            'githubRepo': '', 
            'status': 0, 
            'created': mock.ANY,
            'modified': mock.ANY, 
            'user': 1})
        
    #Test wrong url
    def test_wrongUrl(self):
        url = '/api/admin/applicationsasdfasd/' + self.applicationId
        response = self.client.get(url, {}, format='json')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    #Test with missing Token
    def test_missingToken(self):
        #Delete token
        self.client.credentials()
        response = self.client.get(self.url + self.applicationId, {}, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    #Test with invalid Token(applicant token)
    def test_invalidToken(self):
        #Give wrong token
        self.client.credentials(HTTP_AUTHORIZATION='Token 4f25709a420a92aa01cc67b091b92ac0247f168a')
        response = self.client.get(self.url + self.applicationId, {}, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        
    #Test with wrong Token format
    def test_wrongTokenFormat(self):
        #Give wrong token
        self.client.credentials(HTTP_AUTHORIZATION='Token 8234kawsdjfas')
        #Define response
        response = self.client.get(self.url + self.applicationId, {}, format='json')
        #Compare defined response status code with status 401 unauthorized
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    #Test to ingore additional data
    def test_ignoreAdditionalData(self):
        #Define additional data
        data = {
            "name": "ExampleName"
        }
        
        response = self.client.get(self.url + self.applicationId, data)
        
        self.assertEqual(response.data, {
            'applicationId': 'TEST1234', 
            'challengeId': 1, 
            'operatingSystem': '', 
            'programmingLanguage': '', 
            'expiry': 0.0, 
            'submission': 0.0, 
            'githubRepo': '', 
            'status': 0, 
            'created': mock.ANY,
            'modified': mock.ANY, 
            'user': 1})
