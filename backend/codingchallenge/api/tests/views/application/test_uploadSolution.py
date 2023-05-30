from pathlib import Path
from unittest.mock import patch
from zipfile import ZipFile

from rest_framework import status
from rest_framework.test import APITransactionTestCase

from ...mock.mockAuth import MockAuth

BASE_DIR = Path(__file__).resolve().parent.parent.parent.parent.parent
filePath = BASE_DIR.joinpath(Path("api/tests/mock/fileuploads"))

uploadedFileList = []


# Mock function
# appends the path of the uploaded file to a uploadedFileList
def pushFileMock(*args):
    path = args[2]
    uploadedFileList.append(path)


# patch is used to bypass the default githubApi and to replace the following method with mock data
@patch('api.include.githubApi.GithubApi.pushFile', pushFileMock)
@patch('api.include.githubApi.GithubApi.addLinter', autospec=True)
@patch('api.include.githubApi.GithubApi.createRepo', autospec=True)
class test_uploadSolution(APITransactionTestCase):
    reset_sequences = True

    url = '/api/application/uploadSolution/'

    def setUp(self):
        # Create Application and Challenge to proceed
        self.user = MockAuth.applicantWithApplication(self)

        # Reset of uploaded Files list from Mock
        uploadedFileList = []

    def test_missingAuth(self, mockAddLinter, mockPushRepo):
        # remove headers for this test
        self.client.credentials()

        fileupload = open(filePath.joinpath('fileupload_correct.zip'), 'rb')

        response = self.client.post(
            self.url,
            content_type="application/zip",
            files={"attachment": ("test.zip", fileupload)}
        )

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_wrongFormat(self, mockAddLinter, mockPushRepo):
        response = self.client.post(self.url, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_noFile(self, mockAddLinter, mockPushRepo):
        response = self.client.post(self.url, content_type="application/zip")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data, {'detail': 'No file passed. Aborting.'})

    def test_missingFilename(self, mockAddLinter, mockPushRepo):
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

    def test_testFileupload1(self, mockAddLinter, mockPushRepo):
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

        zipFile = ZipFile(fileuploadPath)

        print(zipFile.namelist())

    def test_testFileupload2(self, mockAddLinter, mockPushRepo):
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

        # get a list of every path in fileupload
        zipFile = ZipFile(fileuploadPath)

        print(zipFile.namelist())
        print(uploadedFileList)
        self.assertListEqual(zipFile.namelist(), uploadedFileList)

    def test_testFileupload3(self, mockAddLinter, mockPushRepo):
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

        # get a list of every path in fileupload
        zipFile = ZipFile(fileuploadPath)

        print(zipFile.namelist())
        print(uploadedFileList)
        self.assertListEqual(zipFile.namelist(), uploadedFileList)

    def test_multipleUpload(self, mockAddLinter, mockPushRepo):
        pass
