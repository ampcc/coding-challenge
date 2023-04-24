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

    def createRepo(self, repoName, repoDescription):
        self.gApi.get_organization('ampcc').create_repo(name=repoName, description=repoDescription, private=True)
        self.addLinter(repoName)

        return True

    # def pushFiles(self):
    def pushFile(self, repoName, path, file):
        return self.gApi.get_organization('ampcc').get_repo(repoName).create_file(path=path,message="auto push "+path,content=file)

    def addLinter(self, repoName):
        linterCode="""
            # This workflow executes several linters on changed files based on languages used in your code base whenever
            # you push a code or open a pull request.
            #
            # You can adjust the behavior by modifying this file.
            # For more information, see:
            # https://github.com/github/super-linter
            name: Lint Code Base
            
            on:
              push:
                branches: [ "main" ]
              pull_request:
                branches: [ "main" ]
            jobs:
              run-lint:
                runs-on: ubuntu-latest
                steps:
                  - name: Checkout code
                    uses: actions/checkout@v3
                    with:
                      # Full git history is needed to get a proper list of changed files within `super-linter`
                      fetch-depth: 0
            
                  - name: Lint Code Base
                    uses: github/super-linter@v4
                    env:
                      VALIDATE_ALL_CODEBASE: false
                      DEFAULT_BRANCH: "main"
                      GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        """

        return self.gApi.get_organization('ampcc').get_repo(repoName).create_file(path=".github/workflows/super-linter.yml",
                                                                                  message="added superlinter",
                                                                                  content=linterCode)
    #
    # def addActions(self):
    #
    # def getActionResult(self):

    def getLinterResult(self, repoName):
        workflow_run = self.gApi.get_organization('ampcc').get_repo(repoName).get_workflow_runs()[0]

        print(workflow_run.status) #can be "completed" and "queued"
        print(workflow_run.conclusion) #can be null and "success" and ???
        return workflow_run.raw_data