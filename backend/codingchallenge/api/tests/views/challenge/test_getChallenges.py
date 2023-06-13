from rest_framework import status
from rest_framework.test import APITestCase

from ...mock.mockAuth import MockAuth

class test_getChallenges(APITestCase):
    url = '/api/admin/challenges/'


    def setUp(self):
        # Authorization
        MockAuth.admin(self)

        # Initialize data in the database
        challenge_1 = {
            "challengeHeading": "TestChallenge", 
            "challengeText": "This is a Test Challenge"
        }
        challenge_2 = {
            "challengeHeading": "TestChallenge2", 
            "challengeText": "This is a second challenge"
        }
        self.client.post(self.url, challenge_1, format='json')
        self.client.post(self.url, challenge_2, format='json')


    def test_missing_token(self):
        # remove headers for this test
        self.client.credentials()
        response = self.client.get(self.url)

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


    def test_invalid_token(self):
        # for this test, use the example token from the wiki
        self.client.credentials(HTTP_AUTHORIZATION='Token 62ce30b676d95ef439af5e1d84f9161034c67c4a')
        response = self.client.get(self.url)

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


    def test_wrong_token_format(self):
        self.client.credentials(HTTP_AUTHORIZATION='Token 1234')
        response = self.client.get(self.url)

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


    def test_wrong_url(self):
        url = '/api/admin/super_cool_challenges/'
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)


    def test_receive_correct_challenges(self):
        response = self.client.get(self.url)
        id_1 = response.data[0]['id']
        id_2 = response.data[1]['id']
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, [{
            "id": id_1,
            "challengeHeading": "TestChallenge",
            "challengeText": "This is a Test Challenge",
            "active": True
        }, 
        {
            "id": id_2,
            "challengeHeading": "TestChallenge2",
            "challengeText": "This is a second challenge",
            "active": True
        }])


    def test_ignoreChallengeId(self):
        data = {
            "challengeId": "Hello"
        }
        response = self.client.get(self.url, data, format='json')
        id_1 = response.data[0]['id']
        id_2 = response.data[1]['id']

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, [{
            "id": id_1,
            "challengeHeading": "TestChallenge",
            "challengeText": "This is a Test Challenge",
            "active": True
        }, 
        {
            "id": id_2,
            "challengeHeading": "TestChallenge2",
            "challengeText": "This is a second challenge",
            "active": True
        }])


    def test_callNotAsAdmin(self):
        self.user = MockAuth.applicantWithApplication(self, "TEST1234")
        response = self.client.get(self.url)
        
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)        
