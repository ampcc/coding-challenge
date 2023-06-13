from rest_framework import status
from rest_framework.test import APITestCase

from ...mock.mockAuth import MockAuth
from ....include import jsonMessages


class test_getChallengeAdmin(APITestCase):
    url = "/api/admin/challenges/"
    

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
        response = self.client.get(self.url + "1")

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


    def test_invalid_token(self):
        # for this test, use the example token from the wiki
        self.client.credentials(HTTP_AUTHORIZATION='Token 62ce30b676d95ef439af5e1d84f9161034c67c4a')
        response = self.client.get(self.url + "1")
        
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


    def test_wrong_token_format(self):
        self.client.credentials(HTTP_AUTHORIZATION='Token 1234')
        response = self.client.get(self.url + "1")

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


    def test_challenge_does_not_exist(self):
        response = self.client.get(self.url + "9999")
        
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(response.data, jsonMessages.error_json_response("The desired challenge can not be found!"))


    def test_receive_correct_challenges(self):
        response = self.client.get(self.url)
        id_1 = response.data[0]['id']
        id_2 = response.data[1]['id']
        response = self.client.get(self.url + str(id_1), format='json')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, {
            "id": id_1,
            "challengeHeading": "TestChallenge",
            "challengeText": "This is a Test Challenge",
            "active": True
        })

        response = self.client.get(self.url + str(id_2), {}, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, {
            "id": id_2,
            "challengeHeading": "TestChallenge2",
            "challengeText": "This is a second challenge",
            "active": True
        })


    def test_ignore_additional_data(self):
        response = self.client.get(self.url)
        id = response.data[0]['id']
        data = {
            "stuff": "World!"
        }
        responseGetChallenge = self.client.get(self.url + str(id), data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK) 
        self.assertEqual(responseGetChallenge.data, {
            "id": id,
            "challengeHeading": "TestChallenge",
            "challengeText": "This is a Test Challenge",
            "active": True
        })
        

    def test_call_not_as_admin(self):
        self.user = MockAuth.applicantWithApplication(self, "TEST1234")
        response = self.client.get(self.url + "1", {}, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)        
