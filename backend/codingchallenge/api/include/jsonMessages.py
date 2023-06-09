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


def errorGithubJsonResponse(exception):
    statusCode, detail, args = exception.args

    error = {
        "detail": f'GitHub: {detail["message"]}'
    }
    return error, statusCode
