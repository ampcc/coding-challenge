import json
import time
from django.core import serializers

from django.contrib.auth.models import User
from rest_framework import status

from rest_framework.authtoken.models import Token
from rest_framework.test import APITestCase

from ....models.challenge import Challenge
from ....models.application import Application

# Authorization
from ...auth.mockAuth import MockAuth

class test_editApplication(APITestCase):

    def setUp(self):
        # Authorization
        MockAuth.admin(self)

        # default url
        Application.objects.create(applicationId="TEST1234", applicantEmail="Test@thi.de", challengeId=1, expiry=0)
        self.applicationId = getattr(Application.objects.first(), 'applicationId')

        # Example Challenge in Database
        Challenge.objects.create(challengeHeading="TestChallenge", challengeText="This is a Test Challenge")

    def test_missingAuth(self):
        # remove headers for this test
        self.client.credentials()

        url = '/api/admin/applications/' + self.applicationId
        data = {}
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_wrongUrl(self):
        url = '/api/admin/dumb'
        data = {
            "applicationStatus": 2,
            "applicantEmail": "Test@thi.de",
            "challengeId": 1,
            "extendDays": 2
        }
        response = self.client.put(url, data, format='json', )
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_noApplicationId(self):
        url = '/api/admin/applications/'

        data = {
            "applicationStatus": 2,
            "applicantEmail": "Test@thi.de",
            "challengeId": 1,
            "extendDays": 2
        }
        response = self.client.put(url, data, format='json', )
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_wrongApplicationId(self):
        url = '/api/admin/applications/' + '4321TSET'

        data = {
            "applicationStatus": 2,
            "applicantEmail": "Test@thi.de",
            "challengeId": 1,
            "extendDays": 2
        }
        response = self.client.put(url, data, format='json', )
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_wrongDatafields(self):
        url = '/api/admin/applications/' + self.applicationId
        data = {
            "applicationStatus": 2,
            "wrongDatafield": "Test@thi.de",
            "challengeId": 1,
            "extendDays": 2
        }
        response = self.client.put(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        wantedResponse = json.loads(serializers.serialize("json", [Application.objects.first()]))[0]['fields']
        self.assertEqual(response.data, wantedResponse)

    def test_notAllowedDatafields(self):
        url = '/api/admin/applications/' + self.applicationId
        data = {
            "applicationId": "TEST1234",
            "applicantEmail": "Test@thi.de",
            "challengeId": 1,
            "extendDays": 2
        }
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data,
                         json.loads(serializers.serialize("json", [Application.objects.first()]))[0]['fields'])

    def test_emptyData(self):
        url = '/api/admin/applications/' + self.applicationId
        data = ""
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(response.data,
                         json.loads(serializers.serialize("json", [Application.objects.first()]))[0]['fields'])

    def test_correctInput(self):
        url = '/api/admin/applications/' + self.applicationId
        data = {
            "applicationStatus": 2,
            "applicantEmail": "Test@thi.de",
            "challengeId": 1,
            "extendDays": 2
        }
        response = self.client.put(url, data, format='json')

        timestamp = time.time()
        timestamp = timestamp + 2 * 24 * 60 * 60

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(Application.objects.count(), 1)

        self.assertEqual(Application.objects.get().status, 2)

        self.assertEqual(Application.objects.get().applicationId, self.applicationId)
        self.assertEqual(Application.objects.get().applicantEmail, 'Test@thi.de')
        self.assertEqual(Application.objects.get().challengeId, 1)

        # rounds the assertion to seconds
        self.assertAlmostEqual(Application.objects.get().expiry, timestamp, 0)

        self.assertEqual(response.data,
                         json.loads(serializers.serialize("json", [Application.objects.first()]))[0]['fields'])

    def test_nonExistingStatus(self):
        url = '/api/admin/applications/' + self.applicationId
        data = {
            "applicationStatus": 123123,
            "applicantEmail": "Test@thi.de",
            "challengeId": 1,
            "extendDays": 2
        }
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        self.assertNotEqual(Application.objects.get().status, 123123)

        self.assertEqual(response.data,
                         json.loads(serializers.serialize("json", [Application.objects.first()]))[0]['fields'])

    def test_nonExistingChallengeId(self):
        url = '/api/admin/applications/' + self.applicationId
        data = {
            "applicationStatus": 2,
            "applicantEmail": "Test@thi.de",
            "challengeId": 123123,
            "extendDays": 2
        }
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        self.assertNotEqual(Application.objects.get().challengeId, 123123)
        self.assertEqual(response.data,
                         json.loads(serializers.serialize("json", [Application.objects.first()]))[0]['fields'])
