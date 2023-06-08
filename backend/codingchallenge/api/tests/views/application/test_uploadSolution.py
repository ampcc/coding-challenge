from pathlib import Path

from django.conf import settings
from rest_framework import status
from rest_framework.test import APITransactionTestCase

from ...mock.mockAuth import MockAuth

BASE_DIR = Path(__file__).resolve().parent.parent.parent.parent.parent
filePath = BASE_DIR.joinpath(Path("api/tests/mock/fileuploads"))

class test_uploadSolution(APITransactionTestCase):
    settings.DEPLOY_OFFLINE = True
    reset_sequences = True

    url = '/api/application/uploadSolution/'

    def setUp(self):
        MockAuth.admin(self)

        # Create Challenge
        self.client.post("/api/admin/challenges/", {
            "challengeHeading": "TestChallenge",
            "challengeText": "TestChallengeDescription"
        }, format='json')

        # Create Application and Challenge to proceed
        self.user = MockAuth.applicantWithApplication(self, "TEST1234")

        # Reset of uploaded Files list from Mock
        uploadedFileList = []

    def test_missingAuth(self):
        # remove headers for this test
        self.client.credentials()

        fileupload = open(filePath.joinpath('fileupload_correct.zip'), 'rb')

        response = self.client.post(
            self.url,
            content_type="application/zip",
            files={"attachment": ("test.zip", fileupload)}
        )

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_wrongFormat(self):
        response = self.client.post(self.url, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_noFile(self):
        response = self.client.post(self.url, content_type="application/zip")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data, {'detail': 'No file passed. Aborting.'})

    def test_missingFilename(self):
        fileupload = open(filePath.joinpath('fileupload_correct.zip'), 'rb').read()

        response = self.client.post(
            self.url,
            content_type="application/zip",
            data={"attachment": fileupload}
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(
            response.data,
            {
                'detail': 'Missing filename. Request should include a Content-Disposition header with a filename '
                          'parameter.'
            }
        )

    def test_testFileupload1(self):
        # folder-structure of fileupload_wrong.zip
        # .
        # └── files
        #     └── program
        #         ├── assets
        #         │      ├── asset1.jpg
        #         │      ├── asset2.jpg
        #         │      └── asset3.jpg
        #         ├── run.py
        #         └── test.py

        fileuploadPath = filePath.joinpath('fileupload_wrong.zip')
        fileupload = open(fileuploadPath, 'rb').read()

        # set Content-Disposition header
        headers = {
            'HTTP_CONTENT_DISPOSITION': 'attachment; filename=file.zip}',
        }

        response = self.client.post(
            self.url,
            content_type="application/zip",
            data=fileupload,
            **headers
        )

        self.assertEqual(response.status_code, status.HTTP_406_NOT_ACCEPTABLE)
        self.assertEqual(
            response.data,
            {
                'detail': 'The data does not match the required structure inside of the zipfile!'
            }
        )

    def test_testFileupload2(self):
        # folder-structure of fileupload_correct.zip
        # .
        # ├── assets
        # │      ├── asset1.jpg
        # │      ├── asset2.jpg
        # │      └── asset3.jpg
        # ├── run.py
        # └── test.py

        fileuploadPath = filePath.joinpath('fileupload_correct.zip')
        fileupload = open(fileuploadPath, 'rb').read()

        # set Content-Disposition header
        headers = {
            'HTTP_CONTENT_DISPOSITION': 'attachment; filename=file.zip}',
        }

        response = self.client.post(
            self.url,
            content_type="application/zip",
            data=fileupload,
            **headers
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(
            response.data,
            {
                'success': 'true'
            }
        )

    def test_testFileupload3(self):
        # folder-structure of fileupload_correct2.zip
        # assets
        #    ├── asset1.jpg
        #    ├── asset2.jpg
        #    └── asset3.jpg
        # run.py
        # test.py

        fileuploadPath = filePath.joinpath('fileupload_correct2.zip')
        fileupload = open(fileuploadPath, 'rb').read()

        # set Content-Disposition header
        headers = {
            'HTTP_CONTENT_DISPOSITION': 'attachment; filename=file.zip}',
        }

        response = self.client.post(
            self.url,
            content_type="application/zip",
            data=fileupload,
            **headers
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(
            response.data,
            {
                'success': 'true'
            }
        )

    def test_multipleUpload(self):
        # folder-structure of fileupload_correct.zip
        # .
        # ├── assets
        # │      ├── asset1.jpg
        # │      ├── asset2.jpg
        # │      └── asset3.jpg
        # ├── run.py
        # └── test.py

        fileuploadPath = filePath.joinpath('fileupload_correct.zip')
        fileupload = open(fileuploadPath, 'rb').read()

        # set Content-Disposition header
        headers = {
            'HTTP_CONTENT_DISPOSITION': 'attachment; filename=file.zip}',
        }

        response = self.client.post(
            self.url,
            content_type="application/zip",
            data=fileupload,
            **headers
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        response = self.client.post(
            self.url,
            content_type="application/zip",
            data=fileupload,
            **headers
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(
            response.data,
            {
                'detail': 'solution has already been submitted'
            }
        )
