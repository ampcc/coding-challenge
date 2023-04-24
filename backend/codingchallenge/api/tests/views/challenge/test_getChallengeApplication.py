import time

from rest_framework import status
from rest_framework.test import APITestCase

from ...auth.mockAuth import MockAuth
from ....models.application import Application
from ....models.challenge import Challenge
from ....views import jsonMessages


class test_getChallengeApplication(APITestCase):

    def setUp(self):
        # Authorization
        MockAuth.applicant(self)

        # Example Challenge in Database
        Challenge.objects.create(challengeHeading="TestChallenge", challengeText="This is a Test Challenge")
        Challenge.objects.create(challengeHeading="TestChallenge2", challengeText="This is a second challenge")

        Application.objects.create(applicationId="user", challengeId=1, expiry=0, user_id=1)
        self.applicationId = "user"

    def test_missingToken(self):
        # remove headers for this test
        self.client.credentials()

        url = '/api/application/challenges/' + self.applicationId
        data = {}
        response = self.client.get(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_invalidToken(self):
        # for this test, use the example token from the wiki
        self.client.credentials(HTTP_AUTHORIZATION='Token 62ce30b676d95ef439af5e1d84f9161034c67c4a')

        url = '/api/application/challenges/' + self.applicationId
        data = {}
        response = self.client.get(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_wrongToken(self):
        ...

    def test_wrongTokenFormat(self):
        self.client.credentials(HTTP_AUTHORIZATION='Token 1234')

        url = '/api/application/challenges/' + self.applicationId
        data = {}
        response = self.client.get(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_missingApplicationId(self):
        url = '/api/application/challenges/'

        data = {}
        response = self.client.get(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_wrongApplicationId(self):
        url = '/api/application/challenges/23456'

        data = {}
        response = self.client.get(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(response.data, jsonMessages.errorJsonResponse("Wrong pair of token and applicationId provided!"))

    def test_challengeDoesNotExist(self):
        Application.objects.create(applicationId="WrongApplication", challengeId=107, expiry=0, user_id=189)
        url = '/api/application/challenges/WrongApplication'

        data = {}
        response = self.client.get(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(response.data, jsonMessages.errorJsonResponse("Wrong pair of token and applicationId provided!"))


    def test_wrongUrl(self):
        url = '/api/application/super_cool_challenges/45'
        data = {}
        response = self.client.get(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_applicationDoesNotExist(self):
        url = '/api/application/challenges/67'

        data = {}
        response = self.client.get(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(response.data, jsonMessages.errorJsonResponse("Wrong pair of token and applicationId provided!"))

    def test_challengeDoesNotExist(self):
        Application.objects.filter(applicationId=self.applicationId).update(challengeId=3)

        url = '/api/application/challenges/' + self.applicationId

        data = {}
        response = self.client.get(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(response.data, jsonMessages.errorJsonResponse("The applications challenge can not be found!"))

    def test_receiveCorrectChallenges(self):
        url = '/api/application/challenges/' + self.applicationId

        data = {}
        response = self.client.get(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, {
            "id": 1,
            "challengeHeading": "TestChallenge",
            "challengeText": "This is a Test Challenge"
        })

    def test_ignoreAdditionalData(self):
        url = '/api/application/challenges/' + self.applicationId
        data = {
            "stuff": "World!"
        }
        response = self.client.get(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, {
            "id": 1,
            "challengeHeading": "TestChallenge",
            "challengeText": "This is a Test Challenge"
        })

    def test_callAsPost(self):
        url = '/api/application/challenges/' + self.applicationId
        data = {}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)
        self.assertEqual(Challenge.objects.count(), 2)

    def test_callAsPut(self):
        url = '/api/appliaction/challenges/' + self.applicationId
        data = {}
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(Challenge.objects.count(), 2)

    def test_callNotAsUser(self):
        MockAuth.admin(self)

        url = '/api/application/challenges/' + self.applicationId
        data = {}
        response = self.client.get(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(response.data, jsonMessages.errorJsonResponse("Wrong pair of token and applicationId provided!"))
