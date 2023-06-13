from rest_framework import status
from rest_framework.test import APITestCase

from ...mock.mockAuth import MockAuth
from ....models.application import Application
from ....models.challenge import Challenge
from ....include import jsonMessages


class test_getChallengeApplication(APITestCase):
    url = "/api/application/challenges/"


    def setUp(self):
        # First authorize as admin to create the mock data for the database
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
        challenge_application = self.client.post("/api/admin/challenges/", challenge_1, format='json')
        self.client.post("/api/admin/challenges/", challenge_2, format='json')
        
        user = {
            "applicationId": "TEST1234", 
            "challengeId": challenge_application.data['id'], 
            "expiry": 999999999999999,
        }
        application = self.client.post("/api/admin/applications/", user, format='json')

        # Now authorize as application and login with key 
        self.application_id = "TEST1234"
        token = self.client.post('/api/application/loginWithKey/' + application.data['tmpLink'][29:]).data['token']
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + token)


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


    def test_challenge_does_not_exist(self):
        Application.objects.create(applicationId="WrongApplication", challengeId=107, expiry=0, user_id=189)
        response = self.client.get(self.url)

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)


    def test_wrong_url(self):
        url = '/api/application/super_cool_challenges/45'
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)


    def test_challenge_does_not_exist(self):
        Application.objects.filter(applicationId=self.application_id).update(challengeId=3000)
        response = self.client.get(self.url)

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(response.data, jsonMessages.error_json_response("The applications challenge can not be found!"))


    def test_receive_correct_challenge(self):
        response = self.client.get(self.url)
        id_1 = response.data['id']

        self.assertEqual(response.data, {
            "id": id_1,
            "challengeHeading": "TestChallenge",
            "challengeText": "This is a Test Challenge",
            "active": True
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)


    def test_ignore_additional_data(self):
        data = {
            "stuff": "World!"
        }
        response = self.client.get(self.url)
        id_1 = response.data['id']

        self.assertEqual(response.data, {
            "id": id_1,
            "challengeHeading": "TestChallenge",
            "challengeText": "This is a Test Challenge",
            "active": True
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)


    def test_call_as_post(self):
        response = self.client.post(self.url)

        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)
        self.assertEqual(Challenge.objects.count(), 2)


    def test_call_as_put(self):
        response = self.client.put(self.url)

        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)
        self.assertEqual(Challenge.objects.count(), 2)