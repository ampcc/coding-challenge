from pathlib import Path
from pathlib import Path
from unittest.mock import patch

from rest_framework import status
from rest_framework.test import APITransactionTestCase

from ...mock.mockAuth import MockAuth
from ....models.application import Application

BASE_DIR = Path(__file__).resolve().parent.parent.parent.parent.parent
mockRepoUrl = "https://github.com/dummy/url"

mockLinterPath = BASE_DIR.joinpath(Path("api/tests/mock/mockMegalinter.log"))
mockLinterLog = open(mockLinterPath, "r", encoding="utf8").read()


# patch is used to bypass the default githubApi and to raplace the following methods with mock data
@patch('api.include.githubApi.GithubApi.getLinterLog', return_value=mockLinterLog)
@patch('api.include.githubApi.GithubApi.getRepoUrl', return_value=mockRepoUrl)
class test_getResult(APITransactionTestCase):
    reset_sequences = True
    applicationUrl = "/api/admin/applications/"
    url = '/api/admin/applications/results/'

    def setUp(self):
        # Authorization
        MockAuth.admin(self)

        # Create Challenge
        self.client.post("/api/admin/challenges/",
                         {"challengeHeading": "TestChallenge", "challengeText": "TestChallengeDescription"},
                         format='json')

        # Create Application
        self.applicationId = "TEST1234"
        self.client.post(self.applicationUrl, {"applicationId": self.applicationId}, format='json')
        self.application = Application.objects.get(applicationId=self.applicationId)

        self.application.githubRepo = mockRepoUrl
        self.application.status = Application.Status.IN_REVIEW
        self.application.save()

    def test_missingAuth(self, mockGetRepoUrl, mockGetLinterLog):
        # remove headers for this test
        self.client.credentials()
        response = self.client.get(self.url + self.applicationId, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_noApplicationId(self, mockGetRepoUrl, mockGetLinterLog):
        response = self.client.get(self.url, format='json')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_wrongApplicationId(self, mockGetRepoUrl, mockGetLinterLog):
        response = self.client.get(self.url + "4321TSET", format='json')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_repoNotExists(self, mockGetRepoUrl, mockGetLinterLog):
        self.application.githubRepo = ""
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

    def test_correctInput(self, mockGetRepoUrl, mockGetLinterLog):
        # ignore pep8
        mockLinterResult = "+----SUMMARY----+------------+---------------+-------+-------+--------+--------------+\n| Descriptor    | Linter     | Mode          | Files | Fixed | Errors | Elapsed time |\n+---------------+------------+---------------+-------+-------+--------+--------------+\n| ✓  ACTION     | actionlint | list_of_files |     1 |       |      0 |        0.02s |\n| ✓  COPYPASTE  | jscpd      | project       |   n/a |       |      0 |        1.08s |\n| ✓  PYTHON     | bandit     | list_of_files |    12 |       |      0 |        0.89s |\n| ⁇ PYTHON      | black      | list_of_files |    12 |       |      1 |        0.72s |\n| ✕  PYTHON     | flake8     | list_of_files |    12 |       |     43 |        0.41s |\n| ⁇ PYTHON      | isort      | list_of_files |    12 |       |      3 |        0.17s |\n| ✕  PYTHON     | mypy       | list_of_files |    12 |       |      1 |        0.33s |\n| ✕  PYTHON     | pylint     | list_of_files |    12 |       |     15 |        2.06s |\n| ✕  PYTHON     | pyright    | list_of_files |    12 |       |      9 |        6.43s |\n| ✕  PYTHON     | ruff       | list_of_files |    12 |       |     15 |        0.07s |\n| ✓  REPOSITORY | checkov    | project       |   n/a |       |      0 |       14.82s |\n| ✓  REPOSITORY | devskim    | project       |   n/a |       |      0 |        0.93s |\n| ✓  REPOSITORY | dustilock  | project       |   n/a |       |      0 |        0.02s |\n| ✓  REPOSITORY | gitleaks   | project       |   n/a |       |      0 |        0.15s |\n| ✓  REPOSITORY | git_diff   | project       |   n/a |       |      0 |        0.01s |\n| ✓  REPOSITORY | secretlint | project       |   n/a |       |      0 |        0.91s |\n| ✓  REPOSITORY | syft       | project       |   n/a |       |      0 |        0.16s |\n| ✓  REPOSITORY | trivy      | project       |   n/a |       |      0 |        4.86s |\n| ✕  SPELL      | cspell     | list_of_files |    16 |       |     19 |        5.14s |\n| ✓  SPELL      | misspell   | list_of_files |    15 |       |      0 |        0.04s |\n| ⁇ YAML        | prettier   | list_of_files |     1 |       |      1 |        0.54s |\n| ✓  YAML       | v8r        | list_of_files |     1 |       |      0 |         2.4s |\n| ✕  YAML       | yamllint   | list_of_files |     1 |       |      1 |        0.28s |\n+---------------+------------+---------------+-------+-------+--------+--------------+"

        response = self.client.get(self.url + self.applicationId)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, {'githubUrl': mockRepoUrl,
                                         'content': mockLinterResult})
