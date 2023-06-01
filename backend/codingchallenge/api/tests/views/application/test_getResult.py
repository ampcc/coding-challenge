from pathlib import Path
from django.conf import settings
from rest_framework import status
from rest_framework.test import APITransactionTestCase
from ...mock.mockAuth import MockAuth
from ....models.application import Application

BASE_DIR = Path(__file__).resolve().parent.parent.parent.parent.parent


class test_getResult(APITransactionTestCase):
    reset_sequences = True
    applicationUrl = "/api/admin/applications/"
    url = '/api/admin/applications/results/'
    mockLinterResult = "+----SUMMARY----+------------+---------------+-------+-------+--------+--------------+\n| Descriptor    | Linter     | Mode          | Files | Fixed | Errors | Elapsed time |\n+---------------+------------+---------------+-------+-------+--------+--------------+\n| ✓  ACTION     | actionlint | list_of_files |     1 |       |      0 |        0.02s |\n| ✓  COPYPASTE  | jscpd      | project       |   n/a |       |      0 |        0.93s |\n| ✓  REPOSITORY | checkov    | project       |   n/a |       |      0 |       12.79s |\n| ✓  REPOSITORY | devskim    | project       |   n/a |       |      0 |        0.65s |\n| ✓  REPOSITORY | dustilock  | project       |   n/a |       |      0 |        0.02s |\n| ✓  REPOSITORY | gitleaks   | project       |   n/a |       |      0 |        0.11s |\n| ✓  REPOSITORY | git_diff   | project       |   n/a |       |      0 |        0.01s |\n| ✓  REPOSITORY | secretlint | project       |   n/a |       |      0 |        0.65s |\n| ✓  REPOSITORY | syft       | project       |   n/a |       |      0 |        0.43s |\n| ✓  REPOSITORY | trivy      | project       |   n/a |       |      0 |        3.41s |\n| ✕  SPELL      | cspell     | list_of_files |     2 |       |      2 |        2.85s |\n| ✓  SPELL      | misspell   | list_of_files |     1 |       |      0 |        0.04s |\n| ⁇ YAML        | prettier   | list_of_files |     1 |       |      1 |        0.42s |\n| ✓  YAML       | v8r        | list_of_files |     1 |       |      0 |        3.14s |\n| ✕  YAML       | yamllint   | list_of_files |     1 |       |      1 |        0.22s |\n+---------------+------------+---------------+-------+-------+--------+--------------+"

    def setUp(self):
        # Authorization
        MockAuth.admin(self)
        settings.DEPLOY_OFFLINE = True
        # Create Challenge
        self.client.post(
            "/api/admin/challenges/",
            {"challengeHeading": "TestChallenge", "challengeText": "TestChallengeDescription"},
            format='json'
        )

        # Create Application
        self.applicationId = "appl0001"
        self.client.post(self.applicationUrl, {"applicationId": self.applicationId}, format='json')
        self.application = Application.objects.get(applicationId=self.applicationId)
        self.application.githubRepo = self.applicationId
        self.application.status = Application.Status.IN_REVIEW
        self.application.save()

    def test_missingAuth(self):
        # remove headers for this test
        self.client.credentials()
        response = self.client.get(self.url + self.applicationId, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_noApplicationId(self):
        response = self.client.get(self.url, format='json')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_wrongApplicationId(self):
        response = self.client.get(self.url + "4321TSET", format='json')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_repoNotExists(self):
        self.application.githubRepo = "12345679"
        self.application.save()

        response = self.client.get(self.url + self.applicationId, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    # Todo: should be implemented soon
    # def test_wrongStatus(self, mockGetRepoUrl, mockGetLinterLog):
    #     self.application.status = Application.Status.CHALLENGE_STARTED
    #     self.application.save()
    #
    #     response = self.client.get(self.url + self.applicationId, format='json')
    #     self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    # Todo: should be implemented soon
    # def test_linterNotFinished(self, mockGetRepoUrl, mockGetLinterLog):
    #     # MagicMock.
    #
    #     gApi = GithubApi()
    #
    #     print(gApi.getLinterLog("Test"))

    def test_correctInput(self):
        # ignore pep8

        response = self.client.get(self.url + self.applicationId, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(
            response.data, {
                'githubUrl': "https://api.github.com/repos/ampcc/" + self.applicationId,
                'content': self.mockLinterResult
            }
        )
