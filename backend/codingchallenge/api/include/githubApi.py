from github import Github
from github.AppAuthentication import AppAuthentication
import os
from dotenv import load_dotenv
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv()


class GithubApi:
    def __init__(self):
        # Add exceptions
        self.app_id = os.getenv('GH_APP_ID')
        self.private_key = open("ampcc-api-bot.2023-04-24.private-key.pem", "r").read()
        self.installation_id = int(os.getenv('GH_APP_INSTALLATION_ID'))

        self.gApi = Github(app_auth=AppAuthentication(app_id=self.app_id, private_key=self.private_key,
                                                     installation_id=self.installation_id))

    def getRepos(self):
        ret = []

        for repo in self.gApi.get_organization('ampcc').get_repos():
            ret.append(repo.name)

        return ret

    # def createRepo(self):
