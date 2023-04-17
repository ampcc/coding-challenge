import time

from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from ....models.challenge import Challenge
from ....models.application import Application


class test_createApplication(APITestCase):
    def test_wrongUrl(self):
        url = '/api/admin/dumb'
        data = {
            "applicationId": "TEST1234",
            "applicantEmail": "hallo@thi.de",
            "days": 6
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_wrongDatafields(self):
        Challenge.objects.create(challengeHeading="TestChallenge", challengeText="This is a Test Challenge")

        url = '/api/admin/applications/'
        data = {
            "applicationId": "TEST1234",
            "applicantEmail": "hallo@thi.de",
            "notGivenDatafield": 2
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_emptyData(self):
        Challenge.objects.create(challengeHeading="TestChallenge", challengeText="This is a Test Challenge")

        url = '/api/admin/applications/'
        data = {}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_noChallenge(self):
        url = '/api/admin/applications/'
        data = {}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_422_UNPROCESSABLE_ENTITY)

    def test_randomChallengeSelection(self):
        Challenge.objects.create(challengeHeading="TestChallenge", challengeText="This is a Test Challenge")
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
        Challenge.objects.create(challengeHeading="TestChallenge", challengeText="This is a Test Challenge")

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
        Challenge.objects.create(challengeHeading="TestChallenge", challengeText="This is a Test Challenge")

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
        Challenge.objects.create(challengeHeading="TestChallenge", challengeText="This is a Test Challenge")

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
