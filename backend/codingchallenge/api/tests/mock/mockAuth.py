from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token

from ...models import Application


class MockAuth:
    @staticmethod
    def admin(testcase):
        # Authorisation Header
        user = User.objects.create_superuser('admin', 'admin@test.com', "admin")
        user.save()
        token = Token.objects.create(user=user)

        testcase.client.credentials(HTTP_AUTHORIZATION='Token ' + token.key)

        return user

    @staticmethod
    def applicantWithApplication(testcase):
        applicationUrl = "/api/admin/applications/"
        challengeUrl = "/api/admin/challenges/"
        applicationId = "TEST1234"

        # Create Application and Challenges as Admin
        MockAuth.admin(testcase)

        # Create Challenge
        testcase.client.post(challengeUrl, {
            "challengeHeading": "TestChallenge",
            "challengeText": "TestChallengeDescription"
        }, format='json')

        # Create Application
        testcase.applicationId = "TEST1234"
        application = testcase.client.post(applicationUrl, {"applicationId": applicationId}, format='json')
        applicationobj = Application.objects.get(applicationId=application.data['applicationId'])
        user = User.objects.get(id=applicationobj.user_id)
        tmpLink = application.data["tmpLink"]
        lastIndex = tmpLink.rfind("/") + 1
        key = tmpLink[lastIndex:]
        response = testcase.client.post("/api/application/loginWithKey/" + key)
        token = response.data["token"]

        # Authorisation Header
        testcase.client.credentials(HTTP_AUTHORIZATION='Token ' + token)

        return user
