import json

from rest_framework import status
from rest_framework.test import APITestCase

from ...mock.mockAuth import MockAuth
from ....models.application import Application
from ....serializers import GetApplicationStatus


class test_getApplicationStatus(APITestCase):
    url = "/api/application/getApplicationStatus/"

    def setUp(self):
        MockAuth.admin(self)
        challenge = {
            "challengeHeading": "TestChallenge",
            "challengeText": "This is a Test Challenge"
        }

        self.client.post("/api/admin/challenges/", challenge, format="json")
        self.response_key_url = self.client.post(
            "/api/admin/applications/",
            {"applicationId": "TEST1234"},
            format="json"
        )
        index_last_dash = self.response_key_url.data["tmpLink"].rfind("/") + 1
        self.key = self.response_key_url.data["tmpLink"][index_last_dash:]

        response = self.client.post("/api/application/loginWithKey/" + self.key)
        self.client.credentials(HTTP_AUTHORIZATION="Token " + response.data["token"])

    def test_successful_response(self):
        expected_data = GetApplicationStatus(Application.objects.get(applicationId="TEST1234"))
        response = self.client.get(self.url)
        self.assertEqual(response.data, json.loads(json.dumps(expected_data.data)))

    def test_wrong_url(self):
        wrong_url = '/api/admin/appppplications/'
        response = self.client.get(wrong_url, {}, format='json')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_missing_token(self):
        self.client.credentials()
        response = self.client.get(self.url, {}, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_invalid_token(self):
        self.client.credentials(HTTP_AUTHORIZATION='Token 4f25709a420a92aa01cc67b091b92ac0247f168a')
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_wrong_token_format(self):
        self.client.credentials(HTTP_AUTHORIZATION='Token 8234kawsdjfas')
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_ignore_additional_data(self):
        data = {
            "name": "ExampleName"
        }
        expected_data = GetApplicationStatus(Application.objects.get(applicationId="TEST1234"))
        response = self.client.get(self.url, data)
        self.assertEqual(response.data, json.loads(json.dumps(expected_data.data)))
