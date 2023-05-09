from github import Github
from github.AppAuthentication import AppAuthentication
import os
from dotenv import load_dotenv
from pathlib import Path
from django.conf import settings

BASE_DIR = Path(__file__).resolve().parent.parent.parent
load_dotenv()


class GithubApi:
    def __init__(self):
        # Add exceptions
        self.app_id = os.getenv('GH_APP_ID')
        self.private_key = open(BASE_DIR.joinpath("privateKey.pem"), "r").read()
        self.installation_id = int(os.getenv('GH_APP_INSTALLATION_ID'))
        if not settings.OFFLINE_USE:
            self.gApi = Github(app_auth=AppAuthentication(app_id=self.app_id, private_key=self.private_key,
                                                      installation_id=self.installation_id))

    def getRepos(self):
        ret = []
        
        if not settings.OFFLINE_USE:
            for repo in self.gApi.get_organization('ampcc').get_repos():
                ret.append(repo.name)

        return ret

    def createRepo(self, repoName, repoDescription):
        if not settings.OFFLINE_USE:
            self.gApi.get_organization('ampcc').create_repo(name=repoName, description=repoDescription, private=True)
        return True

    # def pushFiles(self):
    def pushFile(self, repoName, path, file):
        if not settings.OFFLINE_USE:   
            return self.gApi.get_organization('ampcc').get_repo(repoName).create_file(path=path,
                                                                                    message="auto push " + path,
                                                                                    content=file)
        return True

    def addLinter(self, repoName):
        if not settings.OFFLINE_USE:   
            return self.gApi.get_organization('ampcc').get_repo(repoName).create_file(
                path=".github/workflows/megalinter.yml",
                message="added megalinter",
                content=open(BASE_DIR.joinpath("api/include/megalinter.yml"), 'r').read())
        else:
            return True

    def getLinterResult(self, repoName):
        if not settings.OFFLINE_USE:   
            megalinterLog = self.gApi.get_organization('ampcc').get_repo(repoName).get_contents('megalinter-reports/megalinter.log')
            decodedLinter = megalinterLog.decoded_content.decode()

            # ----SUMMARY ----
            linterStartIndex = decodedLinter.find("+----SUMMARY----")
            linterSummary = decodedLinter[linterStartIndex:-1:1]
            linterEndIndex = linterSummary.find('\n\n')

            cleanSummary = linterSummary[0:linterEndIndex:1]

            return cleanSummary
        else:
            return True
