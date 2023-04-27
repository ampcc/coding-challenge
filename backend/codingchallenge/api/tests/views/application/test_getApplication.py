import unittest.mock as mock
from rest_framework import status
from rest_framework.test import APITestCase

from ....models.challenge import Challenge

from ...auth.mockAuth import MockAuth
from ....models.application import Application
from ....views import jsonMessages
from ....serializers import GetApplicationSerializer


class test_getApplication(APITestCase):

    def setUp(self):
        
        #Define url with the additional applicationId of every object
        
        # Authorization
        MockAuth.admin(self)

        # Example Application for the tests, will be deleted after passing the test
        #self.client.post('/api/admin/applications/', {"applicationId" : "TEST1234"}, format='json')
        #self.client.post('/api/admin/applications/', {"applicationId" : "TEST4321"}, format='json')

        #Challenge is needed to create Application tests
        Challenge.objects.create(challengeHeading="TestChallenge", challengeText="This is a Test Challenge")
        
        #Create Application Object
        Application.objects.create(applicationId="TEST1234", challengeId=1, expiry=0, user_id=1, modified='', created='')
        self.applicationId = "TEST1234"
    
    
    #Test the successful Response of getApplications, its also a test for the right token
    def test_successfulResponse(self):

        #Define url with the specific applicationId
        url = '/api/admin/applications/' + self.applicationId
        response = self.client.get(url, {}, format='json')
        
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
        
        #Define wrong url with the specific applicationId
        url = '/api/admin/applicationsasdfasd/' + self.applicationId
        #Define response
        response = self.client.get(url, {}, format='json')
        #Compare defined response status code with status 404 not found
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)


    #Test with missing Token
    def test_missingToken(self):

        #Define url with the specific applicationId
        url = '/api/admin/applications/' + self.applicationId
        #Delete token
        self.client.credentials()
        #Define response
        response = self.client.get(url, {}, format='json')
        #Compare defined response status code with status 401 unauthorized
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


    #Test with invalid Token(applicant token)
    def test_invalidToken(self):
        
        #Define url with the specific applicationId
        url = '/api/admin/applications/' + self.applicationId
        #Give wrong token
        self.client.credentials(HTTP_AUTHORIZATION='Token 4f25709a420a92aa01cc67b091b92ac0247f168a')
        #Define response
        response = self.client.get(url, {}, format='json')
        #Compare defined response status code with status 401 unauthorized
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        
 
    #Test with wrong Token format
    def test_wrongTokenFormat(self):
        
        #Define url with the specific applicationId
        url = '/api/admin/applications/' + self.applicationId
        #Give wrong token
        self.client.credentials(HTTP_AUTHORIZATION='Token 8234kawsdjfas')
        #Define response
        response = self.client.get(url, {}, format='json')
        #Compare defined response status code with status 401 unauthorized
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


    #Test to ingore additional data
    def test_ignoreAdditionalData(self):
        
        #Define url with the specific applicationId
        url = '/api/admin/applications/' + self.applicationId
        #Define additional data
        data = {
            "name": "ExampleName"
        }
        #Data that is expected
        
        #Real response with additional data
        response = self.client.get(url, data)
        
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
