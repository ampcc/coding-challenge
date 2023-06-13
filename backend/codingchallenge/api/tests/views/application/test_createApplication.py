import time
import unittest.mock as mock

from rest_framework import status
from rest_framework.test import APITransactionTestCase

from ...mock.mockAuth import MockAuth
from ....models.application import Application
from ....models.challenge import Challenge
from ....include import expirySettings


class test_createApplication(APITransactionTestCase):
    # resets sequence in postgresql database when launching setup
    reset_sequences = True

    url = '/api/admin/applications/'
    expected_return_data = {
        "applicationId": "TEST1234",
        "created": mock.ANY,
        "status": 0,
        "expiry": mock.ANY,
        "tmpLink": mock.ANY
    }

    def setUp(self):
        # Authorization
        MockAuth.admin(self)

        # Example Challenge in Database
        self.client.post("/api/admin/challenges/", {"challengeHeading": "TestChallenge", "challengeText": "This is a Test Challenge"}, format="json")



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
        self.client.post("/api/admin/challenges/", {"challengeHeading": "TestChallenge2", "challengeText": "This is a Test Challenge2"}, format="json")
        self.client.post("/api/admin/challenges/", {"challengeHeading": "TestChallenge3", "challengeText": "This is a Test Challenge3"}, format="json")
        self.client.post("/api/admin/challenges/", {"challengeHeading": "TestChallenge4", "challengeText": "This is a Test Challenge4"}, format="json")
        self.client.post("/api/admin/challenges/", {"challengeHeading": "TestChallenge5", "challengeText": "This is a Test Challenge5"}, format="json")
        
        data = {
            "applicationId": "TEST1234",
        }

        self.assertEqual(Application.objects.count(), 0)

        response = self.client.post(self.url, data, format='json')

        self.assertEqual(Application.objects.count(), 1)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn("www.amplimind.io/application/", response.data['tmpLink'])
        # tmpLink also contains a key
        self.assertGreater(len(response.data['tmpLink']), len("www.amplimind.io/application/"))
        self.assertEqual(self.expected_return_data, response.data)

        # test if challengeId is a valid random challenge from database
        challenge_id = Application.objects.get().challengeId

        self.assertIn(Challenge.objects.get(id=challenge_id), Challenge.objects.all())

    def test_correctInput(self):
        data = {
            "applicationId": "TEST1234",
            "challengeId": 1,
            "expiry": time.time() + 6 * 24 * 60 * 60
        }

        self.assertEqual(Application.objects.count(), 0)

        response = self.client.post(self.url, data, format='json')

        self.assertEqual(Application.objects.count(), 1)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data, self.expected_return_data)

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

        self.assertEqual(Application.objects.count(), 0)

        response = self.client.post(self.url, data, format='json')
        self.assertEqual(Application.objects.count(), 1)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data, self.expected_return_data)

        timestamp = time.time()
        timestamp = timestamp + expirySettings.days_until_challenge_start * 24 * 60 * 60

        self.assertEqual(Application.objects.get().applicationId, 'TEST1234')

        # test if challengeId is the single created challenge
        self.assertEqual(Application.objects.get().challengeId, 1)

        # timestamp is greater than expiry due to server access delay (delay < 5 seconds is ok)
        expiry = Application.objects.get().expiry
        if timestamp < expiry + 5:
            timestamp = expiry
        
        # rounds the assertion to seconds
        self.assertAlmostEqual(Application.objects.get().expiry, timestamp, 0)

    def test_multipleIds(self):
        data = {
            "applicationId": "TEST1234",
            "challengeId": 1,
            "days": 2
        }

        self.assertEqual(Application.objects.count(), 0)

        response1 = self.client.post(self.url, data, format='json')
        self.assertEqual(Application.objects.count(), 1)
        self.assertEqual(response1.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response1.data, self.expected_return_data)

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
