import time

from django.contrib.auth.models import User
from rest_framework import status

from rest_framework.authtoken.models import Token
from rest_framework.test import APITestCase

from .....models.challenge import Challenge
from .....models.application import Application

# Authorization
from ....auth.mockAuth import MockAuth


class test_createApplication(APITestCase):

    def setUp(self):
        # Authorization
        MockAuth.admin(self)

        # Example Challenge in Database
        Challenge.objects.create(challengeHeading="TestChallenge", challengeText="This is a Test Challenge")

    def test_missingAuth(self):
        # remove headers for this test
        self.client.credentials()

        url = '/api/admin/applications/'
        data = {
            "applicationId": "TEST1234",
            "applicantEmail": "hallo@thi.de",
            "challengeId": 1,
            "days": 6
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_wrongUrl(self):
        url = '/api/admin/dumb'
        data = {
            "applicationId": "TEST1234",
            "applicantEmail": "hallo@thi.de",
            "challengeId": 1,
            "days": 6
        }
        response = self.client.post(url, data, format='json', )
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_wrongDatafields(self):
        url = '/api/admin/applications/'
        data = {
            "applicationId": "TEST1234",
            "applicantEmail": "hallo@thi.de",
            "notGivenDatafield": 2,
            "days": 6
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_emptyData(self):
        url = '/api/admin/applications/'
        data = {}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_noChallenge(self):
        # delete all challenge objects
        Challenge.objects.all().delete()

        url = '/api/admin/applications/'
        data = {}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_422_UNPROCESSABLE_ENTITY)

    def test_randomChallengeSelection(self):
        # Add more challenges in Database
        Challenge.objects.create(challengeHeading="TestChallenge2", challengeText="This is a Test Challenge2")
        Challenge.objects.create(challengeHeading="TestChallenge3", challengeText="This is a Test Challenge3")
        Challenge.objects.create(challengeHeading="TestChallenge4", challengeText="This is a Test Challenge4")
        Challenge.objects.create(challengeHeading="TestChallenge5", challengeText="This is a Test Challenge5")

        url = '/api/admin/applications/'
        data = {
            "application": {
                "applicationId": "TEST1234",
                "applicantEmail": "hallo@thi.de",
            }
        }
        response = self.client.post(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Application.objects.count(), 1)

        # test if challengeId is a valid random challenge from database
        challengeId = Application.objects.get().challengeId

        self.assertIn(Challenge.objects.get(id=challengeId), Challenge.objects.all())

    def test_correctInput(self):
        url = '/api/admin/applications/'
        data = {
            "application": {
                "applicationId": "TEST1234",
                "applicantEmail": "hallo@thi.de",
                "challengeId": 1,
                "days": 6
            }
        }
        response = self.client.post(url, data, format='json')

        timestamp = time.time()
        timestamp = timestamp + 6 * 24 * 60 * 60

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Application.objects.count(), 1)

        self.assertEqual(Application.objects.get().applicationId, 'TEST1234')
        self.assertEqual(Application.objects.get().applicantEmail, 'hallo@thi.de')
        self.assertEqual(Application.objects.get().challengeId, 1)

        # rounds the assertion to seconds
        self.assertAlmostEqual(Application.objects.get().expiry, timestamp, 0)

    def test_correctInputDefault(self):
        url = '/api/admin/applications/'
        data = {
            "application": {
                "applicationId": "TEST1234",
                "applicantEmail": "hallo@thi.de",
            }
        }
        response = self.client.post(url, data, format='json')

        timestamp = time.time()
        timestamp = timestamp + 2 * 24 * 60 * 60

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Application.objects.count(), 1)

        self.assertEqual(Application.objects.get().applicationId, 'TEST1234')
        self.assertEqual(Application.objects.get().applicantEmail, 'hallo@thi.de')

        # test if challengeId is the single created challenge
        self.assertEqual(Application.objects.get().challengeId, 1)

        # rounds the assertion to seconds
        self.assertAlmostEqual(Application.objects.get().expiry, timestamp, 0)

    def test_multipleIds(self):
        url = '/api/admin/applications/'
        data = {
            "application": {
                "applicationId": "TEST1234",
                "applicantEmail": "hallo@thi.de",
                "challengeId": 1,
                "days": 2
            }
        }
        response1 = self.client.post(url, data, format='json')
        self.assertEqual(response1.status_code, status.HTTP_201_CREATED)

        response2 = self.client.post(url, data, format='json')
        self.assertEqual(response2.status_code, status.HTTP_409_CONFLICT)

    def test_wrongApplicationIdLength(self):
        url = '/api/admin/applications/'
        data = {
            "application": {
                "applicationId": "TEST123412312312312312",
                "applicantEmail": "hallo@thi.de",
                "challengeId": 1,
                "days": 6
            }
        }
        data2 = {
            "application": {
                "applicationId": "TEST4",
                "applicantEmail": "hallo@thi.de",
                "challengeId": 1,
                "days": 6
            }
        }
        response = self.client.post(url, data, format='json')
        response2 = self.client.post(url, data2, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response2.status_code, status.HTTP_400_BAD_REQUEST)
