from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token


class MockAuth:
    @staticmethod
    def admin(testcase):
        # Authorisation Header
        user = User.objects.create_superuser('admin', 'admin@test.com', "admin")
        user.save()
        token = Token.objects.create(user=user)

        testcase.client.credentials(HTTP_AUTHORIZATION='Token ' + token.key)

    @staticmethod
    def applicant(testcase):
        # Authorisation Header
        user = User.objects.create_user('user', 'user@test.com', "user")
        user.save()
        token = Token.objects.create(user=user)

        testcase.client.credentials(HTTP_AUTHORIZATION='Token ' + token.key)
