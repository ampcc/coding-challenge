from rest_framework import status
from rest_framework.test import APITestCase

from ...auth.mockAuth import MockAuth
from ....models.challenge import Challenge
from ....serializers import GetChallengeSerializer

class test_postChallengeAdmin(APITestCase):
    url = "/api/admin/challenges/"
    
    def setUp(self):
        # Authorization
        MockAuth.admin(self)

        Challenge.objects.create(challengeHeading="Test", challengeText="Text of challenge...")

    def test_differentDataFields(self):
        expected_data = {
            "id": 1,
            "challengeHeading": "Test",
            "challengeText": "Text of challenge..."
        }
        data_heading = {
            "challengeHeading": "Another Heading"
        }
        data_text = {
            "challengeText": "Another challenge text..."
        }

        # when no data is passed, no update will happen 
        response_no_data = self.client.put(self.url + "1/", {}, format="json")
        self.assertEqual(response_no_data.status_code, status.HTTP_200_OK)
        self.assertEqual(response_no_data.data, expected_data)
        self.assertEqual(response_no_data.data, GetChallengeSerializer(Challenge.objects.get(id="1")).data)

        # updating heading
        response_only_heading = self.client.put(self.url + "1/", data_heading, format="json")
        expected_data["challengeHeading"] = "Another Heading"
        self.assertEqual(response_only_heading.status_code, status.HTTP_200_OK)
        self.assertEqual(response_only_heading.data, expected_data)
        self.assertEqual(response_only_heading.data, GetChallengeSerializer(Challenge.objects.get(id="1")).data)

        # updating text
        response_only_text = self.client.put(self.url + "1/", data_text, format="json")
        expected_data["challengeText"] = "Another challenge text..."
        self.assertEqual(response_only_text.status_code, status.HTTP_200_OK)
        self.assertEqual(response_only_text.data, expected_data)
        self.assertEqual(response_only_text.data, GetChallengeSerializer(Challenge.objects.get(id="1")).data)

    def test_defaultRequest(self):
        expected_data = {
            "id": 1,
            "challengeHeading": "Another Heading",
            "challengeText": "Another challenge text..."
        }
        data = {
            "challengeHeading": "Another Heading",
            "challengeText": "Another challenge text..."
        }

        response = self.client.put(self.url + "1/", data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, expected_data)
        self.assertEqual(response.data, GetChallengeSerializer(Challenge.objects.get(id="1")).data)

    def test_updateNonexistentChallenge(self):
        response = self.client.put(self.url + "2/", {}, format="json")
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_tryUpdatingId(self):
        expected_error = {
            "detail": "Only 'challengeHeading' and 'challengeText' are permitted."
        }
        data = {
            "id": 2
        }

        response = self.client.put(self.url + "1/", data, format="json")
        self.assertEqual(response.data, expected_error)   
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_faultyBodyArguments(self):
        data_too_many = {
            "challengeHeading": "Another Heading",
            "challengeText": "Another challenge text...",
            "third_param": "this is not a valid argument"
        }
        data_with_one_wrong_argument = {
            "challengeHeading": "Another Heading",
            "challengeTexts": "Another challenge text..."
        }
        data_one_argument_wrong = {
            "challengeTexts": "Another challenge text..."
        }
        expected_error_too_many = {
            "detail": "Passed too many arguments in body. Only 'challengeHeading' and 'challengeText' are permitted."
        }
        expected_error = {
            "detail": "Only 'challengeHeading' and 'challengeText' are permitted."
        }

        response_too_many = self.client.put(self.url + "1/", data_too_many, format="json")
        self.assertEqual(response_too_many.data, expected_error_too_many)
        self.assertEqual(response_too_many.status_code, status.HTTP_400_BAD_REQUEST)

        response_wrong_argument = self.client.put(self.url + "1/", data_with_one_wrong_argument, format="json")
        self.assertEqual(response_wrong_argument.data, expected_error)
        self.assertEqual(response_wrong_argument.status_code, status.HTTP_400_BAD_REQUEST)

        response_one_wrong_argument = self.client.put(self.url + "1/", data_one_argument_wrong, format="json")
        self.assertEqual(response_wrong_argument.data, expected_error)
        self.assertEqual(response_wrong_argument.status_code, status.HTTP_400_BAD_REQUEST)
