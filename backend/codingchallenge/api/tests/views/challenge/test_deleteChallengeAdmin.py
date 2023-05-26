from rest_framework import status
from rest_framework.test import APITestCase

from ...mock.mockAuth import MockAuth
from ....views import jsonMessages

class test_deleteChallengeAdmin(APITestCase):
    url = "/api/admin/challenges/"
    

    def setUp(self):
        # Authorization
        MockAuth.admin(self)

        self.client.post(self.url, {"challengeHeading": "Test", "challengeText": "Text of challenge..."}, format='json')


    def test_defaultRequest(self):
        response = self.client.get(self.url)
        id = response.data[0]['id']
        response = self.client.delete(self.url + str(id))

        self.assertEqual(response.data, jsonMessages.successJsonResponse())


    def test_tryDeleteOnNonexistentChallenge(self):
        response = self.client.delete(self.url + "9999")    
        
        self.assertEqual(response.data, jsonMessages.errorJsonResponse("No object found for given challengeId."),
                         status.HTTP_404_NOT_FOUND)
    