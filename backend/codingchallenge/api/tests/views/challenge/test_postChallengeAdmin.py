from rest_framework import status
from rest_framework.test import APITestCase

from ...mock.mockAuth import MockAuth
from ....models.challenge import Challenge
from ....serializers import GetChallengeSerializer

class test_postChallengeAdmin(APITestCase):
    url = "/api/admin/challenges/"
    
    def setUp(self):
        # Authorization
        MockAuth.admin(self)

    def test_requiredFields(self):
        data_heading = {
            "challengeHeading": "Test"
        }
        data_text = {
            "challengeText": "Text of challenge..."
        }

        response_no_data = self.client.post(self.url, {}, format="json")
        response_only_heading = self.client.post(self.url, data_heading, format="json")
        response_only_text = self.client.post(self.url, data_text, format="json")

        self.assertEqual(response_no_data.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response_only_heading.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response_only_text.status_code, status.HTTP_400_BAD_REQUEST)

    def test_defaultRequest(self):
        expected_data = {
            "id": 1,
            "challengeHeading": "Test",
            "challengeText": "Text of challenge..."
        }
        data = {
            "challengeHeading": "Test",
            "challengeText": "Text of challenge..."
        }

        # check if test db is empty
        self.assertEqual(Challenge.objects.count(), 0)

        # check for new db entry,
        # correct response values,
        # and if db entry matches requested data
        response = self.client.post(self.url, data, format="json")
        self.assertEqual(Challenge.objects.count(), 1)
        self.assertEqual(response.data, expected_data)
        self.assertEqual(response.data, GetChallengeSerializer(Challenge.objects.get(id="1")).data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
