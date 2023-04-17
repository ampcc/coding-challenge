from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

# IsAdminUser -> Required permissions to access admin-functions
# IsAuthenticated -> Required permissions to access all applicant- and admin-functions

#only works if admin- or applicant-token passed in http-header as described in wiki
class ApplicantView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        content = {'message': 'Hello, Applicant!'}
        return Response(content)