import time

from rest_framework.test import APITransactionTestCase

from ..mock.mockAuth import MockAuth
from ...include import expirySettings
from ...jobs.daily.expiredStatusScheduler import Job
from ...models import Application


class test_expiredStatusScheduler(APITransactionTestCase):
    reset_sequences = True
    url = '/api/admin/applications/'

    def setUp(self):
        MockAuth.admin(self)

        self.client.post(
            "/api/admin/challenges/",
            {"challengeHeading": "TestChallenge", "challengeText": "TestChallengeDescription"},
            format='json'
        )

        self.client.post(
            "/api/admin/challenges/",
            {"challengeHeading": "TestChallenge2", "challengeText": "TestChallengeDescription2"},
            format='json'
        )

        self.client.post(
            self.url,
            {
                "applicationId": "TEST1234",
                "expiry": time.time() - (expirySettings.days_until_challenge_start * 24 * 60 * 60) - 360
            },
            format='json'
        )
        self.client.post(self.url, {"applicationId": "ZWEI1234"}, format='json')

        self.applicationId = getattr(Application.objects.first(), 'applicationId')

    def test_expiredStatusGetsSet(self):
        applications = Application.objects.all()
        self.assertEqual(len(applications), 2)
        self.assertEqual(len(applications.filter(status=4)), 0)

        Job().execute()

        applications = Application.objects.all()
        self.assertEqual(len(applications), 2)
        self.assertEqual(len(applications.filter(status=4)), 1)
        self.assertEqual(applications.filter(status=4)[0].applicationId, 'TEST1234')
