import json

def errorJsonResponse(responseText):
    error = {
        "errorMessage": responseText
    }
    return error