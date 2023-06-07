import json
from rest_framework import status
from rest_framework.test import APITestCase

from ...mock.mockAuth import MockAuth
from ....serializers import GetApplicationStatus
from ....models.application import Application

#Test for GET ApplicationStatus and LoginWithKey
#This test needs a User Object with an user token so its also tests loginWithKey
class test_getApplicationStatus(APITestCase):
    url = "/api/application/getApplicationStatus/"

    def setUp(self):
        # Authorization
        MockAuth.admin(self)

        # create application to be able to log a user in
        challenge = {
            "challengeHeading": "TestChallenge",
            "challengeText": "This is a Test Challenge"
        }
        self.client.post("/api/admin/challenges/", challenge, format="json")
        self.response_key_url = self.client.post("/api/admin/applications/", {"applicationId": "TEST1234"}, format="json")
        index_last_dash = self.response_key_url.data["tmpLink"].rfind("/") + 1
        self.key = self.response_key_url.data["tmpLink"][index_last_dash:]

        response = self.client.post("/api/application/loginWithKey/" + self.key)
        self.client.credentials(HTTP_AUTHORIZATION="Token " + response.data["token"])
        

    #Test the successful Response of getApplicationStatus, its also a test for the right token
    def test_successfulResponse(self):
        expected_data = GetApplicationStatus(Application.objects.get(applicationId = "TEST1234"))
        response = self.client.get(self.url)
        self.assertEqual(response.data, json.loads(json.dumps(expected_data.data)))
    

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
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        
   
    #Test with wrong Token format
    def test_wrongTokenFormat(self):
        #Give wrong token
        self.client.credentials(HTTP_AUTHORIZATION='Token 8234kawsdjfas')
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


    #Test to ingore additional data
    def test_ignoreAdditionalData(self):
        #Define additional data
        data = {
            "name": "ExampleName"
        }
        
        expected_data = GetApplicationStatus(Application.objects.get(applicationId = "TEST1234"))
        response = self.client.get(self.url, data)
        self.assertEqual(response.data, json.loads(json.dumps(expected_data.data)))
