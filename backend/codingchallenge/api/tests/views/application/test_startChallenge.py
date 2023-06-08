import time
from unittest import mock

from django.conf import settings
from rest_framework import status
from rest_framework.test import APITransactionTestCase

from ...mock.mockAuth import MockAuth
from ....models import Challenge
from ....models.application import Application


class test_getResult(APITransactionTestCase):
    reset_sequences = True
    url = '/api/application/startChallenge/'

    def setUp(self):
        # Authorization
        self.user = MockAuth.applicantWithApplication(self)
        self.application = Application.objects.get(user_id=self.user)
        settings.DEPLOY_OFFLINE = True

    def test_missingAuth(self):
        # remove headers for this test
        self.client.credentials()
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_challengeAlreadyStarted(self):
        self.application.status = Application.Status.COMPLETED
        self.application.save()

        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(
            response.data, {
                'detail': 'Can not start challenge! The challenge has already been started!'
            }
        )

    def test_challengeExpired(self):
        self.application.expiry = self.application.expiry - time.time() - 1000
        self.application.save()

        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_410_GONE)
        self.assertEqual(
            response.data, {
                'detail': mock.ANY
            }
        )

    def test_challengeNotFound(self):
        self.application.challengeId = Challenge.objects.last().id + 1
        self.application.save()

        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(
            response.data, {
                'detail': "Challenge ID not found!"
            }
        )

    def test_correctInput(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(
            response.data, {
                'id': mock.ANY,
                'challengeHeading': mock.ANY,
                'challengeText': mock.ANY
            }
        )
