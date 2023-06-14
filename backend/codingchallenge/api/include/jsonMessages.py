def error_json_response(response_text):
    error = {
        "detail": response_text
    }
    return error


def success_json_response():
    success = {
        "success": "true"
    }
    return success


def error_github_json_response(exception):
    status_code, detail, args = exception.args

    error = {
        "detail": f'GitHub: {detail["message"]}'
    }
    return error, status_code
