from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.response import Response
from ...models import Application
from ...serializers import GetApplicationStatus

def get(request):
    user = User.objects.get(username=request.user.username)
    application = Application.objects.get(applicationId=user.username)
    serializer = GetApplicationStatus(application, many=False)
    return Response(serializer.data, status=status.HTTP_200_OK)
