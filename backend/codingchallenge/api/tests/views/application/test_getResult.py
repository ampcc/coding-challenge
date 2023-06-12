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
    mockLinterResult = [
        ['Descriptor', 'Linter', 'Mode', 'Files', 'Fixed', 'Errors', 'Elapsed time'],
        ['✓ ACTION', 'actionlint', 'list_of_files', '1', '', '0', '0.02s'],
        ['✓ COPYPASTE', 'jscpd', 'project', 'n/a', '', '0', '0.93s'],
        ['✓ REPOSITORY', 'checkov', 'project', 'n/a', '', '0', '12.79s'],
        ['✓ REPOSITORY', 'devskim', 'project', 'n/a', '', '0', '0.65s'],
        ['✓ REPOSITORY', 'dustilock', 'project', 'n/a', '', '0', '0.02s'],
        ['✓ REPOSITORY', 'gitleaks', 'project', 'n/a', '', '0', '0.11s'],
        ['✓ REPOSITORY', 'git_diff', 'project', 'n/a', '', '0', '0.01s'],
        ['✓ REPOSITORY', 'secretlint', 'project', 'n/a', '', '0', '0.65s'],
        ['✓ REPOSITORY', 'syft', 'project', 'n/a', '', '0', '0.43s'],
        ['✓ REPOSITORY', 'trivy', 'project', 'n/a', '', '0', '3.41s'],
        ['✕ SPELL', 'cspell', 'list_of_files', '2', '', '2', '2.85s'],
        ['✓ SPELL', 'misspell', 'list_of_files', '1', '', '0', '0.04s'],
        ['? YAML', 'prettier', 'list_of_files', '1', '', '1', '0.42s'],
        ['✓ YAML', 'v8r', 'list_of_files', '1', '', '0', '3.14s'],
        ['✕ YAML', 'yamllint', 'list_of_files', '1', '', '1', '0.22s']
    ]

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