from rest_framework.permissions import IsAdminUser
from django.contrib.auth.models import User
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.authtoken.models import Token

# IsAdminUser -> Required permissions to access admin-functions
# IsAuthenticated -> Required permissions to acces all applicant- and admin-functions


#only works if admin-token passed in http-header as described in wiki
class AdminView(APIView):
    permission_classes = [IsAdminUser]
    def get(self, request):
        content = {'message': 'Hello, Admin!'}
        return Response(content)

    # only works if admin-token passed in http-header as described in wiki. Returns applicant token.
class addApplicant(APIView):
    permission_classes = [IsAdminUser]

    def post(self, request):
        user = User.objects.create_user(username=request.POST.get("username"), email='u@beatles.com',
                                        password=request.POST.get("password"))
        user.save()
        token = Token.objects.create(user=user)
        return Response("Token " + str(token))