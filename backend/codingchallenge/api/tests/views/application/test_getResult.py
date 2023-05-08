from unittest.mock import patch
from rest_framework import status
from rest_framework.test import APITestCase

from ...auth.mockAuth import MockAuth
from ....models.application import Application
from ....views import jsonMessages


@patch('api.include.githubApi.GithubApi.getRepoUrl', autospec="https://github.com/dummy/url")
@patch('api.include.githubApi.GithubApi.getLinterLog', autospec={'test': 'test123'})
class test_getResult(APITestCase):
    applicationUrl = "/api/admin/applications"
    url = '/api/admin/applications/results'

    def setUp(self):
        # Authorization
        MockAuth.admin(self)

        # Create Challenge
        self.client.post("/api/admin/challenges",
                         {"challengeHeading": "TestChallenge", "challengeText": "TestChallengeDescription"},
                         format='json')

        # Create Application
        self.client.post(self.applicationUrl, {"applicationId": "TEST1234"}, format='json')

        # TODO: Start Challenge

        # TODO: Upload Challenge
        self.client.put(self.applicationUrl + "/" + self.applicationId, {"githubRepo": "TestRepo"}, format='json')

        self.applicationId = getattr(Application.objects.first(), 'applicationId')

    def test_missingAuth(self, mockGetRepoUrl, mockGetLinterLog):
        # remove headers for this test
        self.client.credentials()
        response = self.client.get(self.url + "/" + self.applicationId, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_noApplicationId(self, mockGetRepoUrl, mockGetLinterLog):
        response = self.client.get(self.url, format='json')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_wrongApplicationId(self, mockGetRepoUrl, mockGetLinterLog):
        response = self.client.get(self.url + "/" + "4321TSET", format='json')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_repoNotExists(self, mockGetRepoUrl, mockGetLinterLog):
        self.client.put(self.applicationUrl + "/" + self.applicationId, {"githubRepo": ""}, format='json')

        response = self.client.get(self.url + "/" + self.applicationId, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_linterNotFinished(self, mockGetRepoUrl, mockGetLinterLog):
        return "tbd"

    def test_correctInput(self, mockGetRepoUrl, mockGetLinterLog):
        response = self.client.delete(self.url + "/" + self.applicationId)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, jsonMessages.successJsonResponse())
