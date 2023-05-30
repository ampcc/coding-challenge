import json

from django.core import serializers
from rest_framework import status
from rest_framework.test import APITransactionTestCase

from ...mock.mockAuth import MockAuth
from ....models.application import Application

from django.contrib.auth.models import User


class test_editApplication(APITransactionTestCase):
    reset_sequences = True
    url = '/api/admin/applications/'

    def setUp(self):
        # Authorization
        MockAuth.admin(self)

        # Create Challenge
        self.client.post("/api/admin/challenges/",
                         {"challengeHeading": "TestChallenge", "challengeText": "TestChallengeDescription"},
                         format='json')

        # Create Application
        self.client.post(self.url, {"applicationId": "TEST1234"}, format='json')

        self.applicationId = getattr(Application.objects.first(), 'applicationId')

    def test_missingAuth(self):
        # remove headers for this test
        self.client.credentials()

        response = self.client.put(self.url + self.applicationId, {}, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_noApplicationId(self):
        data = {
            "applicationStatus": 2,
            "challengeId": 1,
            "extendDays": 2
        }
        response = self.client.put(self.url + "/", data, format='json')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_wrongApplicationId(self):
        data = {
            "applicationStatus": 2,
            "challengeId": 1,
            "extendDays": 2
        }

        response = self.client.put(self.url + "/" + "4321TSET", data, format='json')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_wrongDatafields(self):
        data = {
            "applicationStatus": 2,
            "wrongDatafield": 1,
            "extendDays": 2
        }
        response = self.client.put(self.url + self.applicationId, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data, {"detail": "Field: wrongDatafield not valid!"})

    def test_notAllowedDatafields(self):
        data = {
            "applicationId": "TEST1234",
            "challengeId": 1,
            "expiry": 2
        }
        response = self.client.put(self.url + self.applicationId, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data, {"detail": "Field: applicationId not valid!"})

    def test_emptyData(self):
        response = self.client.put(self.url + self.applicationId, {}, format='json')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(response.data, {"detail": "No data provided!"})

    def test_correctInput(self):
        data = {
            "applicationStatus": 2,
            "challengeId": 1,
            "expiry": 99999999999999
        }
        response = self.client.put(self.url + self.applicationId, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(Application.objects.count(), 1)

        self.assertEqual(Application.objects.get().status, 2)

        self.assertEqual(Application.objects.get().applicationId, self.applicationId)
        self.assertEqual(Application.objects.get().challengeId, 1)

        # rounds the assertion to seconds
        self.assertAlmostEqual(Application.objects.get().expiry, 99999999999999, 0)

        self.assertEqual(response.data,
                         json.loads(serializers.serialize("json", [Application.objects.first()]))[0]['fields'])

    def test_nonExistingStatus(self):
        data = {
            "applicationStatus": 123123,
            "challengeId": 1,
            "extendDays": 2
        }
        response = self.client.put(self.url + self.applicationId, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertNotEqual(Application.objects.get().status, 123123)
        self.assertEqual(response.data, {"detail": "Invalid status!"})

    def test_nonExistingChallengeId(self):
        data = {
            "applicationStatus": 2,
            "challengeId": 123123,
            "extendDays": 2
        }

        response = self.client.put(self.url + self.applicationId, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

        self.assertNotEqual(Application.objects.get().challengeId, 123123)
        self.assertEqual(response.data, {"detail": "Passed Challenge ID does not exist!"})
