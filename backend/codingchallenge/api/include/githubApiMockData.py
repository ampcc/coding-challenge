def get_repo_url(repoName):
    return "https://api.github.com/repos/ampcc/" + repoName


get_repos = ['appl0001', 'appl0002', 'appl0003', 'appl0004']
# GitHub API returns empty string if successful
create_repo = ""
# GitHub API returns None if succesful
delete_repo = None
# GitHub API returns objects containing two entries: content, commit
# Again, these entries contain objects that require GitHub connection. Therefore a empty object gets set.
push_file = {
    "content": {},
    "commit": {},
}

get_linter_result = [
    ['Descriptor', 'Linter', 'Mode', 'Files', 'Fixed', 'Errors', 'Elapsed time'],
    ['✓ ACTION', 'actionlint', 'list_of_files', '1', '', '0', '0.02s'],
    ['✓ COPYPASTE', 'jscpd', 'project', 'n/a', '', '0', '0.93s'],
    ['✓ REPOSITORY', 'checkov', 'project', 'n/a', '', '0', '12.79s'],
    ['✓ REPOSITORY', 'devskim', 'project', 'n/a', '', '0', '0.65s'],
    ['✓ REPOSITORY', 'dustilock', 'project', 'n/a', '', '0', '0.02s'],
    ['✓ REPOSITORY', 'gitleaks', 'project', 'n/a', '', '0', '0.11s'],
    ['✓ REPOSITORY', 'git_diff', 'project', 'n/a', '', '0', '0.01s'],
    ['✓ REPOSITORY', 'secretlint', 'project', 'n/a', '', '0', '0.65s'],
    ['✓ REPOSITORY', 'syft', 'project', 'n/a', '', '0', '0.43s'],
    ['✓ REPOSITORY', 'trivy', 'project', 'n/a', '', '0', '3.41s'],
    ['✕ SPELL', 'cspell', 'list_of_files', '2', '', '2', '2.85s'],
    ['✓ SPELL', 'misspell', 'list_of_files', '1', '', '0', '0.04s'],
    ['? YAML', 'prettier', 'list_of_files', '1', '', '1', '0.42s'],
    ['✓ YAML', 'v8r', 'list_of_files', '1', '', '0', '3.14s'],
    ['✕ YAML', 'yamllint', 'list_of_files', '1', '', '1', '0.22s']
]
