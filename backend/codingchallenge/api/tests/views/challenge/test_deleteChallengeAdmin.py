from rest_framework import status
from rest_framework.test import APITestCase

from ...mock.mockAuth import MockAuth
from ....models.challenge import Challenge
from ....views import jsonMessages

class test_deleteChallengeAdmin(APITestCase):
    url = "/api/admin/challenges/"
    
    def setUp(self):
        # Authorization
        MockAuth.admin(self)

        Challenge.objects.create(challengeHeading="Test", challengeText="Text of challenge...")

    def test_defaultRequest(self):
        response = self.client.delete(self.url + "1")
        self.assertEqual(response.data, jsonMessages.successJsonResponse())

    def test_tryDeleteOnNonexistentChallenge(self):
        response = self.client.delete(self.url + "2")
        self.assertEqual(response.data, jsonMessages.errorJsonResponse("No object found for given challengeId."),
                         status.HTTP_404_NOT_FOUND)
    