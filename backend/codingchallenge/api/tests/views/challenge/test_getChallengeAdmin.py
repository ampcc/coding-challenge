import time

from rest_framework import status
from rest_framework.test import APITestCase

from ...auth.mockAuth import MockAuth
from ....models.challenge import Challenge
from ....views import jsonMessages


class test_getChallengeAdmin(APITestCase):
    url = "/api/admin/challenges/"

    def setUp(self):
        # Authorization
        MockAuth.admin(self)

        # Example Challenge in Database
        Challenge.objects.create(challengeHeading="TestChallenge", challengeText="This is a Test Challenge")
        Challenge.objects.create(challengeHeading="TestChallenge2", challengeText="This is a second challenge")

    def test_missingToken(self):
        # remove headers for this test
        self.client.credentials()

        response = self.client.get(self.url + "1/")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_invalidToken(self):
        # for this test, use the example token from the wiki
        self.client.credentials(HTTP_AUTHORIZATION='Token 62ce30b676d95ef439af5e1d84f9161034c67c4a')

        response = self.client.get(self.url + "1/")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_wrongTokenFormat(self):
        self.client.credentials(HTTP_AUTHORIZATION='Token 1234')

        response = self.client.get(self.url + "1/")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_challengeDoesNotExist(self):
        response = self.client.get(self.url + "67/")
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(response.data, jsonMessages.errorJsonResponse("The desired challenge can not be found!"))

    def test_receiveCorrectChallenges(self):
        response = self.client.get(self.url + "1/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, {
            "id": 1,
            "challengeHeading": "TestChallenge",
            "challengeText": "This is a Test Challenge"
        })

        response = self.client.get(self.url + "2/", {}, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, {
            "id": 2,
            "challengeHeading": "TestChallenge2",
            "challengeText": "This is a second challenge"
        })

    def test_ignoreAdditionalData(self):
        data = {
            "stuff": "World!"
        }
        response = self.client.get(self.url + "1/", data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, {
            "id": 1,
            "challengeHeading": "TestChallenge",
            "challengeText": "This is a Test Challenge"
        })

    def test_callNotAsAdmin(self):
        MockAuth.applicant(self)

        response = self.client.get(self.url + "1/", {}, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)        
