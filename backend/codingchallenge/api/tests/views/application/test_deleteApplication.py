from unittest.mock import patch

from rest_framework import status
from rest_framework.test import APITransactionTestCase

from ...mock.mockAuth import MockAuth
from ....include import jsonMessages
from ....models.application import Application


# patch is used to bypass the default githubApi and to replace the following method with mock data
@patch('api.include.githubApi.GithubApi.delete_repo', autospec=True)
class test_deleteApplication(APITransactionTestCase):
    reset_sequences = True
    url = '/api/admin/applications/'

    def setUp(self):
        # Authorization
        MockAuth.admin(self)

        # Create Challenge
        self.client.post(
            "/api/admin/challenges/",
            {
                "challengeHeading": "TestChallenge",
                "challengeText": "TestChallengeDescription"
            },
            format='json'
        )

        # Create Application
        self.client.post(self.url, {"applicationId": "TEST1234"}, format='json')

        self.applicationId = getattr(Application.objects.first(), 'applicationId')

    def test_missing_auth(self, mockDelete):
        # remove headers for this test
        self.client.credentials()
        self.assertEqual(Application.objects.count(), 1)

        response = self.client.delete(self.url + self.applicationId, format='json')
        self.assertEqual(Application.objects.count(), 1)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_no_application_id(self, mockDelete):
        self.assertEqual(Application.objects.count(), 1)

        response = self.client.delete(self.url + "/", format='json', )
        self.assertEqual(Application.objects.count(), 1)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_wrong_application_id(self, mockDelete):
        self.assertEqual(Application.objects.count(), 1)

        response = self.client.delete(self.url + "/" + "4321TSET", format='json', )
        self.assertEqual(Application.objects.count(), 1)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_correct_input(self, mockDelete):
        self.assertEqual(Application.objects.count(), 1)

        response = self.client.delete(self.url + self.applicationId)
        self.assertEqual(Application.objects.count(), 0)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, jsonMessages.success_json_response())
