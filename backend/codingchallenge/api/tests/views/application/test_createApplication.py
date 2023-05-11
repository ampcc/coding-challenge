import time
import unittest.mock as mock

from rest_framework import status
from rest_framework.test import APITransactionTestCase

from ...mock.mockAuth import MockAuth
from ....models.application import Application
from ....models.challenge import Challenge
from ....views import expirySettings


class test_createApplication(APITransactionTestCase):
    reset_sequences = True
    url = '/api/admin/applications/'

    def setUp(self):
        # Authorization
        MockAuth.admin(self)

        # Example Challenge in Database
        Challenge.objects.create(challengeHeading="TestChallenge", challengeText="This is a Test Challenge")

    def test_missingAuth(self):
        # remove headers for this test
        self.client.credentials()

        data = {
            "applicationId": "TEST1234",
            "challengeId": 1,
            "days": 6
        }
        self.assertEqual(Application.objects.count(), 0)

        response = self.client.post(self.url, data, format='json')
        self.assertEqual(Application.objects.count(), 0)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_wrongUrl(self):
        url = '/api/admin/dumb/'
        data = {
            "applicationId": "TEST1234",
            "challengeId": 1,
            "days": 6
        }
        self.assertEqual(Application.objects.count(), 0)

        response = self.client.post(url, data, format='json')
        self.assertEqual(Application.objects.count(), 0)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_wrongDatafields(self):
        data = {
            "wrongDatafield": "TEST1234",
            "challengeId": 2,
            "days": 6
        }
        self.assertEqual(Application.objects.count(), 0)

        response = self.client.post(self.url, data, format='json')
        self.assertEqual(Application.objects.count(), 0)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_emptyData(self):
        self.assertEqual(Application.objects.count(), 0)

        response = self.client.post(self.url, {}, format='json')
        self.assertEqual(Application.objects.count(), 0)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_noChallenge(self):
        # delete all challenge objects
        Challenge.objects.all().delete()

        data = {
            "applicationStatus": 2,
            "challengeId": 1,
            "extendDays": 2
        }
        self.assertEqual(Application.objects.count(), 0)

        response = self.client.post(self.url, data, format='json')
        self.assertEqual(Application.objects.count(), 0)
        self.assertEqual(response.status_code, status.HTTP_422_UNPROCESSABLE_ENTITY)

    def test_randomChallengeSelection(self):
        # Add more challenges in Database
        Challenge.objects.create(challengeHeading="TestChallenge2", challengeText="This is a Test Challenge2")
        Challenge.objects.create(challengeHeading="TestChallenge3", challengeText="This is a Test Challenge3")
        Challenge.objects.create(challengeHeading="TestChallenge4", challengeText="This is a Test Challenge4")
        Challenge.objects.create(challengeHeading="TestChallenge5", challengeText="This is a Test Challenge5")

        data = {
            "applicationId": "TEST1234",
        }
        expectedReturnData = {
            "applicationId": "TEST1234",
            "created": mock.ANY,
            "status": 0,
            "expiry": mock.ANY,
            "tmpLink": mock.ANY
        }

        self.assertEqual(Application.objects.count(), 0)

        response = self.client.post(self.url, data, format='json')

        self.assertEqual(Application.objects.count(), 1)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn("www.amplimind.io/application/", response.data['tmpLink'])
        # tmpLink also contains a key
        self.assertGreater(len(response.data['tmpLink']), len("www.amplimind.io/application/"))
        self.assertEqual(expectedReturnData, response.data)

        # test if challengeId is a valid random challenge from database
        challengeId = Application.objects.get().challengeId

        self.assertIn(Challenge.objects.get(id=challengeId), Challenge.objects.all())

    def test_correctInput(self):
        data = {
            "applicationId": "TEST1234",
            "challengeId": 1,
            "expiry": time.time() + 6 * 24 * 60 * 60
        }

        expectedReturnData = {
            "applicationId": "TEST1234",
            "created": mock.ANY,
            "status": 0,
            "expiry": mock.ANY,
            "tmpLink": mock.ANY
        }

        self.assertEqual(Application.objects.count(), 0)

        response = self.client.post(self.url, data, format='json')

        self.assertEqual(Application.objects.count(), 1)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data, expectedReturnData)

        timestamp = time.time()
        timestamp = timestamp + 6 * 24 * 60 * 60

        # asserts if the two timestamps are in range of 10 seconds
        self.assertAlmostEqual(Application.objects.get().expiry / 10, timestamp / 10, 0)
        self.assertEqual(Application.objects.get().applicationId, 'TEST1234')
        self.assertEqual(Application.objects.get().challengeId, 1)

    def test_correctInputDefault(self):
        data = {
            "applicationId": "TEST1234",
        }

        expectedReturnData = {
            "applicationId": "TEST1234",
            "created": mock.ANY,
            "status": 0,
            "expiry": mock.ANY,
            "tmpLink": mock.ANY
        }
        self.assertEqual(Application.objects.count(), 0)

        response = self.client.post(self.url, data, format='json')
        self.assertEqual(Application.objects.count(), 1)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data, expectedReturnData)

        timestamp = time.time()
        timestamp = timestamp + expirySettings.daysUntilChallengeStart * 24 * 60 * 60

        self.assertEqual(Application.objects.get().applicationId, 'TEST1234')

        # test if challengeId is the single created challenge
        self.assertEqual(Application.objects.get().challengeId, 1)

        # rounds the assertion to seconds
        self.assertAlmostEqual(Application.objects.get().expiry, timestamp, 0)

    def test_multipleIds(self):
        data = {
            "applicationId": "TEST1234",
            "challengeId": 1,
            "days": 2
        }
        expectedReturnData = {
            "applicationId": "TEST1234",
            "created": mock.ANY,
            "status": 0,
            "expiry": mock.ANY,
            "tmpLink": mock.ANY
        }
        self.assertEqual(Application.objects.count(), 0)

        response1 = self.client.post(self.url, data, format='json')
        self.assertEqual(Application.objects.count(), 1)
        self.assertEqual(response1.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response1.data, expectedReturnData)

        response2 = self.client.post(self.url, data, format='json')
        self.assertEqual(Application.objects.count(), 1)
        self.assertEqual(response2.status_code, status.HTTP_409_CONFLICT)

    def test_wrongApplicationIdLength(self):
        data = {
            "applicationId": "TEST123412312312312312",
            "challengeId": 1,
            "days": 6
        }
        data2 = {
            "applicationId": "TEST4",
            "challengeId": 1,
            "days": 6
        }

        self.assertEqual(Application.objects.count(), 0)
        response = self.client.post(self.url, data, format='json')
        self.assertEqual(Application.objects.count(), 0)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        response2 = self.client.post(self.url, data2, format='json')
        self.assertEqual(Application.objects.count(), 0)
        self.assertEqual(response2.status_code, status.HTTP_400_BAD_REQUEST)
