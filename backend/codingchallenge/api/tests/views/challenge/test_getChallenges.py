from rest_framework import status
from rest_framework.test import APITestCase

from ...auth.mockAuth import MockAuth
from ....models.challenge import Challenge


class test_getChallenges(APITestCase):

    def setUp(self):
        # Authorization
        MockAuth.admin(self)

        # Example Challenge in Database
        Challenge.objects.create(challengeHeading="TestChallenge", challengeText="This is a Test Challenge")
        Challenge.objects.create(challengeHeading="TestChallenge2", challengeText="This is a second challenge")

    def test_missingToken(self):
        # remove headers for this test
        self.client.credentials()

        url = '/api/admin/challenges'
        data = {}
        response = self.client.get(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_invalidToken(self):
        # for this test, use the example token from the wiki
        self.client.credentials(HTTP_AUTHORIZATION='Token 62ce30b676d95ef439af5e1d84f9161034c67c4a')

        url = '/api/admin/challenges'
        data = {}
        response = self.client.get(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_wrongTokenFormat(self):
        self.client.credentials(HTTP_AUTHORIZATION='Token 1234')

        url = '/api/admin/challenges'
        data = {}
        response = self.client.get(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_wrongUrl(self):
        url = '/api/admin/super_cool_challenges'
        data = {}
        response = self.client.get(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_receiveCorrectChallenges(self):
        url = '/api/admin/challenges'
        data = {}
        response = self.client.get(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, [{
            "id": 1,
            "challengeHeading": "TestChallenge",
            "challengeText": "This is a Test Challenge"
        }, 
        {
            "id": 2,
            "challengeHeading": "TestChallenge2",
            "challengeText": "This is a second challenge"
        }])

    def test_ignoreChallengeId(self):
        url = '/api/admin/challenges'
        data = {
            "challengeId": "Hello"
        }
        response = self.client.get(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, [{
            "id": 1,
            "challengeHeading": "TestChallenge",
            "challengeText": "This is a Test Challenge"
        }, 
        {
            "id": 2,
            "challengeHeading": "TestChallenge2",
            "challengeText": "This is a second challenge"
        }])

    def test_callAsPost(self):
        url = '/api/admin/challenges'
        data = {}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)
        self.assertEqual(Challenge.objects.count(), 2)

    def test_callAsPut(self):
        url = '/api/admin/challenges'
        data = {}
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(Challenge.objects.count(), 2)

    def test_callNotAsAdmin(self):
        MockAuth.applicant(self)

        url = '/api/admin/challenges'
        data = {}
        response = self.client.get(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)        
