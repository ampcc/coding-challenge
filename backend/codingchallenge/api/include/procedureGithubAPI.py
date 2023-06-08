from github import Github, AppAuthentication, Repository, GitBlob, GitTree, InputGitTreeElement, GitCommit
from pathlib import Path
from zipfile import ZipFile
import requests
import base64

BASE_DIR = Path(__file__).resolve().parent.parent.parent

class GithubApiWrapper:
    def __init__(self, app_id, installation_id, private_key, organization_name):
        app_auth = AppAuthentication(app_id, private_key, installation_id)
        self.github_base = Github(app_auth=app_auth, timeout=600)
        self.github_organization = self.github_base.get_organization(organization_name)

    def get_repo(self, repo_name):
        return self.github_organization.get_repo(repo_name)

    def get_repos(self):
        return self.github_organization.get_repos()

    def create_repo(self, repo_name, repo_description):
        return self.github_organization.create_repo(name=repo_name, description=repo_description, private=True)

    def delete_repo(self, repo_name):
        return self.get_repo(repo_name).delete()

    def get_latest_git_commit(self, repo, branch_name):
        sha_of_latest_commit = repo.get_branch(branch_name).commit.sha
        return repo.get_git_commit(sha_of_latest_commit)

    def get_base_tree(self, repo, sha_of_latest_commit):
        return repo.get_git_tree(sha_of_latest_commit)

    def create_blobs(self, repo, files, encoding):
        blobs = []
        for filename in files:
            filedata = filename.read()
            encoded_data = base64.b64encode(filedata).decode()
            first_slash = filename.name.find('/')
            blobs.append((repo.create_git_blob(encoded_data, encoding), filename.name[first_slash + 1:]))
        return blobs

    def create_tree(self, repo, base_tree, blobs):
        input_tree_elements = []
        for blob, filename in blobs:
            input_tree_elements.append(InputGitTreeElement(filename, '100644', 'blob', sha=blob.sha))
        return repo.create_git_tree(input_tree_elements, base_tree)

    def create_commit(self, repo, commit_message, tree, latest_commit):
        return repo.create_git_commit(commit_message, tree, latest_commit)

    def push_commit(self, repo, reference, sha_of_commit):
        ref = repo.get_git_ref(reference)
        return ref.edit(sha_of_commit)

    def add_linter(self, repo):
        linter_content = open(BASE_DIR.joinpath("api/include/megalinter.yml"), 'r').read()
        return repo.create_file(
                path=".github/workflows/megalinter.yml",
                message="initial commit: added megalinter",
                content=linter_content)

    def get_linter_log(self, repo_name):
        repo = self.get_repo(repo_name)
        
       
        #download_url = repo.get_contents('megalinter-reports/megalinter.log').decoded_content.decode()
        download_url = repo.get_contents('megalinter-reports/megalinter.log').raw_data.get("download_url")
        log = requests.get(download_url, stream=True).content
        return log.decode("utf-8")

    def get_linter_result(self, repo_name):
        decodedLinter = self.get_linter_log(repo_name)

        # ----SUMMARY ----
        linterStartIndex = decodedLinter.find("+----SUMMARY----+")
        linterSummary = decodedLinter[linterStartIndex:-1]
        linterEndIndex = linterSummary.find("\\n\\n")

        cleanSummary = linterSummary[:linterEndIndex]

        # replacing symbols and added padding for correct spacing
        # check
        cleanSummary = cleanSummary.replace(u"\u2705", u"\u2713")
        # cross
        cleanSummary = cleanSummary.replace(u"\u274c", u"\u2715")
        # question mark
        cleanSummary = cleanSummary.replace(u"\u25EC", "?")

        result = []
        for i, line in enumerate(cleanSummary.split("\\n")):
            if line.startswith("+"):
                pass
            else:
                row = []
                for element in line.split("|"):
                    if element:
                        row.append(element.strip())
                result.append(row)
        return result

    # Function that combines all prior API-calls
    def upload_files(self, files, repo_name, branch_name, commit_message):
        repo = self.get_repo(repo_name)
        added_megalinter = self.add_linter(repo)
        latest_git_commit = self.get_latest_git_commit(repo, branch_name)
        base_tree = self.get_base_tree(repo, latest_git_commit.sha)
        blobs = self.create_blobs(repo, files, "base64")
        tree = self.create_tree(repo, base_tree, blobs)
        commit = self.create_commit(repo, commit_message, tree, [latest_git_commit])
        ref = self.push_commit(repo, "heads/" + branch_name, commit.sha)
        if ref is None and added_megalinter:
            return True