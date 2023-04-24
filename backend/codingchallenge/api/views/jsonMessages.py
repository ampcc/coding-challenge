def errorJsonResponse(responseText):
    error = {
        "detail": responseText
    }
    return error


def successJsonResponse():
    success = {
        "success": "true"
    }
    return success
