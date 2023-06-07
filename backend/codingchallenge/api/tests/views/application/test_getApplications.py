from rest_framework import status
from rest_framework.test import APITestCase

from ...mock.mockAuth import MockAuth
from ....models.application import Application
from ....serializers import GetApplicationSerializer


class test_getApplications(APITestCase):
    url = '/api/admin/applications/'
    

    def setUp(self):
        # Authorization as admin
        MockAuth.admin(self)
        
        #Challenge is needed to create Application tests
        self.client.post('/api/admin/challenges/', {"challengeHeading": "TestChallenge", "challengeText": "Text Challenge 123"}, format='json')
        
        # Example Application for the tests, will be deleted after passing the test
        self.client.post(self.url, {"applicationId" : "TEST1234"}, format='json')
        self.client.post(self.url, {"applicationId" : "TEST4321"}, format='json')
    

    #Test the successful Response of getApplications, its also a test for the right token
    def test_successfulResponse(self):
        #Data that is expected
        expected_data = GetApplicationSerializer(Application.objects.all(), many=True)
        #Real response
        response = self.client.get(self.url)
        
        #Comparison of the real response data with the expected data
        self.assertEqual(response.data, expected_data.data)
    

    #Test wrong url
    def test_wrongUrl(self):
        #Define wrong url for the test
        wrongUrl = '/api/admin/appppplications/'
        response = self.client.get(wrongUrl, {}, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)


    #Test with missing Token
    def test_missingToken(self):
        #Delete token
        self.client.credentials()
        response = self.client.get(self.url, {}, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


    #Test with invalid Token(applicant token)
    def test_invalidToken(self):
        #Give wrong token
        self.client.credentials(HTTP_AUTHORIZATION='Token 4f25709a420a92aa01cc67b091b92ac0247f168a')
        response = self.client.get(self.url, {}, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        

    #Test with wrong Token format
    def test_wrongTokenFormat(self):
        #Give wrong token
        self.client.credentials(HTTP_AUTHORIZATION='Token 8234kawsdjfas')
        response = self.client.get(self.url, {}, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


    #Test to ingore additional data
    def test_ignoreAdditionalData(self):
        #Define additional data
        data = {
            "name": "ExampleName"
        }
        
        #Data that is expected
        expected_data = GetApplicationSerializer(Application.objects.all(), many=True)
        response = self.client.get(self.url, data)
        
        self.assertEqual(response.data, expected_data.data)
    