from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate
from ...include import jsonMessages

def change(request):
        old_password = request.data.get('oldPassword')
        new_password = request.data.get('newPassword')
        
        if old_password == None or new_password == None:
            return Response(jsonMessages.error_json_response("Wrong keys sent! Can not process request!"), status=status.HTTP_400_BAD_REQUEST)
        
        if len(old_password) == 0 or len(new_password) == 0:
            return Response(jsonMessages.error_json_response("Password(s) must not be empty!"), status=status.HTTP_400_BAD_REQUEST)
        
        user = authenticate(request, username=request.user.username, password=old_password)
        
        if not user:
            return Response(jsonMessages.error_json_response("The old password does not match the currently logged in admin user account!"), status=status.HTTP_403_FORBIDDEN)
        try:        
            user.set_password(new_password)
            user.save()
            return Response(jsonMessages.success_json_response(), status=status.HTTP_202_ACCEPTED)
        except:
            return Response(jsonMessages.error_json_response("Could not set password!"), status=status.HTTP_500_INTERNAL_SERVER_ERROR)