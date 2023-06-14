from rest_framework import status
from rest_framework.test import APITestCase

from ...mock.mockAuth import MockAuth
from ....include import jsonMessages
from ....models.challenge import Challenge


class test_deleteChallengeAdmin(APITestCase):
    url = "/api/admin/challenges/"

    def setUp(self):
        # Authorization
        MockAuth.admin(self)

        self.client.post(self.url, {"challengeHeading": "Test", "challengeText": "Text of challenge..."}, format='json')

    def test_default_request(self):
        response = self.client.get(self.url)
        id = response.data[0]['id']
        response = self.client.delete(self.url + str(id))

        self.assertEqual(response.data, jsonMessages.success_json_response())
        self.assertFalse(Challenge.objects.first().active)

    def test_try_delete_on_nonexistent_challenge(self):
        response = self.client.delete(self.url + "9999")

        self.assertEqual(
            response.data, jsonMessages.error_json_response("No object found for given challengeId."),
            status.HTTP_404_NOT_FOUND
        )
        self.assertTrue(Challenge.objects.first().active)
