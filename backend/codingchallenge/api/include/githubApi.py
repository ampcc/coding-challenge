import os
from pathlib import Path

from django.conf import settings
from dotenv import load_dotenv
from github import GithubException

from . import procedureGithubAPI, githubApiMockData

BASE_DIR = Path(__file__).resolve().parent.parent.parent
load_dotenv()


class GithubApi:
    def __init__(self):
        if not settings.DEPLOY_OFFLINE:
            private_key = open(BASE_DIR.joinpath("privateKey.pem"), "r").read()
            self.github_base = procedureGithubAPI.GithubApiWrapper(
                os.getenv('GH_APP_ID'),
                int(os.getenv('GH_APP_INSTALLATION_ID')),
                private_key,
                "ampcc"
            )

    def get_repo_url(self, repo_name):
        if settings.DEPLOY_OFFLINE:
            if repo_name in githubApiMockData.get_repos:
                return githubApiMockData.get_repo_url(repo_name)
            else:
                raise GithubException(400, {"message": "Repo not found!"}, None)
        else:
            return self.github_base.get_repo(repo_name).url

    def create_repo(self, repo_name, repo_description):
        if settings.DEPLOY_OFFLINE:
            return githubApiMockData.create_repo
        else:
            return self.github_base.create_repo(repo_name, repo_description)

    def delete_repo(self, repo_name):
        if settings.DEPLOY_OFFLINE:
            return githubApiMockData.delete_repo
        else:
            return self.github_base.delete_repo(repo_name)

    # Note: upload_files automatically adds the megalinter
    def upload_files(self, repo_name, files):
        if settings.DEPLOY_OFFLINE:
            return githubApiMockData.push_file
        else:
            return self.github_base.upload_files(files, repo_name, "main", "application file upload: commit")

    def upload_file(self, repo_name, filename, input_file):
        if settings.DEPLOY_OFFLINE:
            return githubApiMockData.push_file
        else:
            input_file.seek(0)
            return self.github_base.upload_file(input_file, filename, repo_name, "main", "zipfile upload: commit")

    def get_linter_result(self, repo_name):
        if settings.DEPLOY_OFFLINE:
            return githubApiMockData.get_linter_result
        else:
            return self.github_base.get_linter_result(repo_name)
