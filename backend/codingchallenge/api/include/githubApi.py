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
        return self.gApi.get_organization('ampcc').get_repo(repoName).create_file(path=path,
                                                                                  message="auto push " + path,
                                                                                  content=file)

    def addLinter(self, repoName):
        linterCode = """
            # MegaLinter GitHub Action configuration file
            # More info at https://megalinter.io
            name: MegaLinter
            
            on:
              # Trigger mega-linter at every push. Action will also be visible from Pull Requests to main
              push: # Comment this line to trigger action only on pull-requests (not recommended if you don't pay for GH Actions)
              pull_request:
                branches: [master, main]
                
            permissions:
              contents: write
            
            env: # Comment env block if you do not want to apply fixes
              # Apply linter fixes configuration
              APPLY_FIXES: none # When active, APPLY_FIXES must also be defined as environment variable (in github/workflows/mega-linter.yml or other CI tool)
            
            concurrency:
              group: ${{ github.ref }}-${{ github.workflow }}
              cancel-in-progress: true
            
            jobs:
              build:
                name: MegaLinter
                runs-on: ubuntu-latest
                steps:
                  # Git Checkout
                  - name: Checkout Code
                    uses: actions/checkout@v3
                    with:
                      token: ${{ secrets.PAT || secrets.GITHUB_TOKEN }}
                      fetch-depth: 0 # If you use VALIDATE_ALL_CODEBASE = true, you can remove this line to improve performances
            
                  # MegaLinter
                  - name: MegaLinter
                    id: ml
                    # You can override MegaLinter flavor used to have faster performances
                    # More info at https://megalinter.io/flavors/
                    uses: oxsecurity/megalinter@v6
                    # uses: oxsecurity/megalinter/flavors/python@v6.22.2
                    env:
                      # All available variables are described in documentation
                      # https://megalinter.io/configuration/
                      VALIDATE_ALL_CODEBASE: ${{ github.event_name == 'push' && github.ref == 'refs/heads/main' }} # Validates all source when push on main, else just the git diff with main. Override with true if you always want to lint all sources
                      GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
                      REPORT_OUTPUT_FOLDER: megalinter-reports
                      CLEAR_REPORT_FOLDER: true
                      LOG_FILE: megalinter.log
            
                  # Upload MegaLinter artifacts
                  - name: Archive production artifacts
                    if: ${{ success() }} || ${{ failure() }}
                    uses: actions/upload-artifact@v3
                    with:
                      name: MegaLinter reports
                      path: |
                        megalinter-reports
            
            
                  # Upload Megalinter Log
                  - name: Push logs in repo
                    if: ${{ success() }} ||  ${{ failure() }}
                    uses: Endbug/add-and-commit@v9
                    with:
                      #author_name: Megalint Bot
                      #default_author: github_actions
                      #author_email: mail@example.com
                      #message: 'Your commit message'
                      #github_token: ${{ secrets.PAT || secrets.GITHUB_TOKEN }}
                      add: |
                        megalinter-reports
        """

        return self.gApi.get_organization('ampcc').get_repo(repoName).create_file(
            path=".github/workflows/super-linter.yml",
            message="added superlinter",
            content=linterCode)


    def getLinterResult(self, repoName):
        megalinterLog = self.gApi.get_organization('ampcc').get_repo(repoName).get_contents('megalinter-reports/megalinter.log')
        return megalinterLog.decoded_content.decode()
