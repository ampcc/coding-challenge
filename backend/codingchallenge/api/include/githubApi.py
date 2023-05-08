from github import Github
from github.AppAuthentication import AppAuthentication
import os
from dotenv import load_dotenv
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent.parent
load_dotenv()


class GithubApi:
    def __init__(self):
        # Add exceptions
        self.app_id = os.getenv('GH_APP_ID')
        self.private_key = open(BASE_DIR.joinpath("privateKey.pem"), "r").read()
        self.installation_id = int(os.getenv('GH_APP_INSTALLATION_ID'))
        self.githubOrg = "ampcc"

        self.gApi = Github(app_auth=AppAuthentication(app_id=self.app_id, private_key=self.private_key,
                                                      installation_id=self.installation_id))

    def getRepoUrl(self, repoName):
        return self.gApi.get_organization(self.githubOrg).get_repo(repoName).url
    def getRepos(self):
        ret = []

        for repo in self.gApi.get_organization(self.githubOrg).get_repos():
            ret.append(repo.name)

        return ret

    def createRepo(self, repoName, repoDescription):
        self.gApi.get_organization(self.githubOrg).create_repo(name=repoName, description=repoDescription, private=True)
        return True

    def deleteRepo(self, repoName):
        return self.gApi.get_organization(self.githubOrg).get_repo(repoName).delete()


    # def pushFiles(self):
    def pushFile(self, repoName, path, file):
        return self.gApi.get_organization(self.githubOrg).get_repo(repoName).create_file(path=path,
                                                                                  message="auto push " + path,
                                                                                  content=file)

    def addLinter(self, repoName):

        return self.gApi.get_organization(self.githubOrg).get_repo(repoName).create_file(
            path=".github/workflows/megalinter.yml",
            message="added megalinter",
            content=open(BASE_DIR.joinpath("api/include/megalinter.yml"), 'r').read())


    def getLinterLog(self, repoName):
        return self.gApi.get_organization(self.githubOrg).get_repo(repoName).get_contents(
            'megalinter-reports/megalinter.log')

    def getLinterResult(self, repoName):

        megalinterLog = self.getLinterLog(repoName)
        decodedLinter = megalinterLog.decoded_content.decode()

        # ----SUMMARY ----
        linterStartIndex = decodedLinter.find("+----SUMMARY----")
        linterSummary = decodedLinter[linterStartIndex:-1:1]
        linterEndIndex = linterSummary.find('\n\n')

        cleanSummary = linterSummary[0:linterEndIndex:1]

        # replacing symbols and added padding for correct spacing
        # check
        cleanSummary = cleanSummary.replace(u"\u2705",u"\u2713" + " ")
        # cross
        cleanSummary = cleanSummary.replace(u"\u274c",u"\u2715" + " ")
        # question mark
        cleanSummary = cleanSummary.replace(u"\u25EC",u"\u2047" + " ")

        return cleanSummary

