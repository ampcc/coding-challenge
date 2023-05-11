from unittest.mock import patch

from rest_framework import status
from rest_framework.test import APITransactionTestCase

from ...mock.mockAuth import MockAuth
from ....models.application import Application
from ....views import jsonMessages


# patch is used to bypass the default githubApi and to raplace the following method with mock data
@patch('api.include.githubApi.GithubApi.deleteRepo', autospec=True)
class test_deleteApplication(APITransactionTestCase):
    reset_sequences = True
    url = '/api/admin/applications/'

    def setUp(self):
        # Authorization
        MockAuth.admin(self)

        # Create Challenge
        self.client.post("/api/admin/challenges",
                         {"challengeHeading": "TestChallenge", "challengeText": "TestChallengeDescription"},
                         format='json')

        # Create Application
        self.client.post(self.url, {"applicationId": "TEST1234"}, format='json')

        self.applicationId = getattr(Application.objects.first(), 'applicationId')

    def test_missingAuth(self, mockDelete):
        # remove headers for this test
        self.client.credentials()
        self.assertEqual(Application.objects.count(), 1)

        response = self.client.delete(self.url + self.applicationId, format='json')
        self.assertEqual(Application.objects.count(), 1)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_noApplicationId(self, mockDelete):
        self.assertEqual(Application.objects.count(), 1)

        response = self.client.delete(self.url + "/", format='json', )
        self.assertEqual(Application.objects.count(), 1)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_wrongApplicationId(self, mockDelete):
        self.assertEqual(Application.objects.count(), 1)

        response = self.client.delete(self.url + "/" + "4321TSET", format='json', )
        self.assertEqual(Application.objects.count(), 1)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_correctInput(self, mockDelete):
        self.assertEqual(Application.objects.count(), 1)

        response = self.client.delete(self.url + self.applicationId)
        self.assertEqual(Application.objects.count(), 0)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, jsonMessages.successJsonResponse())
