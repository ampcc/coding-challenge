import json

def errorJsonResponse(responseText):
    error = {
        "errorMessage": responseText
    }
    return error

def successJsonResponse():
    success = {
        "success": "true"
    }
    return success