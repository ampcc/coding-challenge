import time

from rest_framework import status
from rest_framework.test import APITestCase

from ...mock.mockAuth import MockAuth
from ....models.application import Application
from ....models.challenge import Challenge
from ....views import jsonMessages


class test_getChallengeApplication(APITestCase):
    url = "/api/application/challenges/"

    def setUp(self):
        # First authorize as admin to create the mock data for the database
        MockAuth.admin(self)
        # MockAuth.applicant(self)

        # Initialize data in the database
        challenge1 = {
            "challengeHeading": "TestChallenge", 
            "challengeText": "This is a Test Challenge"
        }

        challenge2 = {
            "challengeHeading": "TestChallenge2", 
            "challengeText": "This is a second challenge"
        }

        user = {
            "applicationId": "TEST1234", 
            "challengeId": 1, 
            "expiry": 0
        }

        self.client.post("/api/admin/challenges/", challenge1, format='json')
        self.client.post("/api/admin/challenges/", challenge2, format='json')
        # self.client.post("/api/admin/applications/", user, format='json')

        Application.objects.create(applicationId="user", challengeId=1, expiry=0, user_id=1)

        # Now authorize as application, so that the test can be run properly
        MockAuth.applicant(self)
        self.applicationId = "user"

    def test_missingToken(self):
        # remove headers for this test
        self.client.credentials()

        response = self.client.get(self.url)

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_invalidToken(self):
        # for this test, use the example token from the wiki
        self.client.credentials(HTTP_AUTHORIZATION='Token 62ce30b676d95ef439af5e1d84f9161034c67c4a')

        response = self.client.get(self.url)

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_wrongTokenFormat(self):
        self.client.credentials(HTTP_AUTHORIZATION='Token 1234')

        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_challengeDoesNotExist(self):
        Application.objects.create(applicationId="WrongApplication", challengeId=107, expiry=0, user_id=189)

        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_wrongUrl(self):
        url = '/api/application/super_cool_challenges/45'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_challengeDoesNotExist(self):
        Application.objects.filter(applicationId=self.applicationId).update(challengeId=3)

        response = self.client.get(self.url)

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(response.data, jsonMessages.errorJsonResponse("The applications challenge can not be found!"))

    def test_receiveCorrectChallenge(self):

        response = self.client.get(self.url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, {
            "id": 1,
            "challengeHeading": "TestChallenge",
            "challengeText": "This is a Test Challenge"
        })

    def test_ignoreAdditionalData(self):
    
        data = {
            "stuff": "World!"
        }
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, {
            "id": 1,
            "challengeHeading": "TestChallenge",
            "challengeText": "This is a Test Challenge"
        })

    def test_callAsPost(self):

        response = self.client.post(self.url, format="json")

        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)
        self.assertEqual(Challenge.objects.count(), 2)

    def test_callAsPut(self):
        response = self.client.put(self.url)
        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)

        self.assertEqual(Challenge.objects.count(), 2)