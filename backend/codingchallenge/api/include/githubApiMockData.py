from textwrap import dedent


def getRepoUrl(repoName):
    return "https://api.github.com/repos/ampcc/" + repoName


getRepos = ['appl0001', 'appl0002', 'appl0003', 'appl0004']
# GitHub API returns empty string if successful
createRepo = ""
# GitHub API returns None if succesful
deleteRepo = None
# GitHub API returns objects containing two entries: content, commit
# Again, these entries contain objects that require GitHub connection. Therefore a empty object gets set.
pushFile = {
    "content": {},
    "commit": {},
}
addLinter = {
    "content": {},
    "commit": {},
}
getLinterLog = dedent(
    """\
        ----------------------------------------------------------------------------------------------------
        ------------------------------------ MegaLinter, by OX Security ------------------------------------
        ----------------------------------------------------------------------------------------------------
        - Image Creation Date: 2023-04-03T18:43:32Z
        - Image Revision: 93700f8c21c59ea784a32abe23896e49e54463b8
        - Image Version: v6.22.2
        ----------------------------------------------------------------------------------------------------
        The MegaLinter documentation can be found at:
         - https://megalinter.io/6.22.2
         ----------------------------------------------------------------------------------------------------
        ::group::MegaLinter initialization (expand for details)
        GITHUB_REPOSITORY: ampcc/TASC1227_1
        GITHUB_REF: refs/heads/main
        GITHUB_RUN_ID: 5068608663
        
        
        [Activation] EDITORCONFIG_EDITORCONFIG_CHECKER has been set inactive, as none of these files has been found: ['.editorconfig']
        [Activation] JAVASCRIPT_ES has been set inactive, as none of these files has been found: ['.eslintrc.json', '.eslintrc.yml', '.eslintrc.yaml', '.eslintrc.js', '.eslintrc.cjs', 'package.json:eslintConfig']
        [Activation] JSON_NPM_PACKAGE_JSON_LINT has been set inactive, as none of these files has been found: ['package.json']
        [Activation] JSX_ESLINT has been set inactive, as none of these files has been found: ['.eslintrc.json', '.eslintrc.yml', '.eslintrc.yaml', '.eslintrc.js', '.eslintrc.cjs', 'package.json:eslintConfig']
        [Activation] KUBERNETES_HELM has been set inactive, as none of these files has been found: ['Chart.yml', 'Chart.yaml']
        [Activation] REPOSITORY_GOODCHECK has been set inactive, as none of these files has been found: ['goodcheck.yml']
        [SemgrepLinter] Deactivated because no ruleset has been defined
        [Activation] SPELL_PROSELINT has been set inactive, as none of these files has been found: ['.proselintrc', 'proselint/config.json']
        [Activation] SQL_SQLFLUFF has been set inactive, as none of these files has been found: ['.sqlfluff']
        [Activation] SWIFT_SWIFTLINT has been set inactive, as none of these files has been found: ['.swiftlint.yml']
        [Activation] TSX_ESLINT has been set inactive, as none of these files has been found: ['.eslintrc.json', '.eslintrc.yml', '.eslintrc.yaml', '.eslintrc.js', '.eslintrc.cjs', 'package.json:eslintConfig']
        [Activation] TYPESCRIPT_ES has been set inactive, as none of these files has been found: ['.eslintrc.json', '.eslintrc.yml', '.eslintrc.yaml', '.eslintrc.js', '.eslintrc.cjs', 'package.json:eslintConfig']
        MARKDOWN_REMARK_LINT has been temporary disabled in MegaLinter, please use a previous MegaLinter version or wait for the next one !
        Skipped linters: ANSIBLE_ANSIBLE_LINT, EDITORCONFIG_EDITORCONFIG_CHECKER, JAVASCRIPT_ES, JAVASCRIPT_PRETTIER, JSON_NPM_PACKAGE_JSON_LINT, JSX_ESLINT, KUBERNETES_HELM, KUBERNETES_KUBECONFORM, KUBERNETES_KUBEVAL, MARKDOWN_REMARK_LINT, REPOSITORY_GOODCHECK, REPOSITORY_SEMGREP, SALESFORCE_SFDX_SCANNER_APEX, SALESFORCE_SFDX_SCANNER_AURA, SALESFORCE_SFDX_SCANNER_LWC, SPELL_PROSELINT, SQL_SQLFLUFF, SWIFT_SWIFTLINT, TSX_ESLINT, TYPESCRIPT_ES, TYPESCRIPT_PRETTIER
        To receive reports as email, please set variable EMAIL_REPORTER_EMAIL
        ::endgroup::
        ::group::MegaLinter now collects the files to analyse (expand for details)
        Listing all files in directory [/github/workspace], then filter with:
        - File extensions: , .R, .RMD, .Rmd, .bash, .bicep, .c, .c++, .cc, .cdxml, .clj, .cljc, .cljs, .coffee, .cpp, .cs, .css, .cu, .cuh, .cxx, .dart, .dash, .edn, .env, .feature, .go, .gradle, .graphql, .groovy, .gvy, .h, .h++, .hcl, .hh, .hpp, .htm, .html, .hxx, .java, .js, .json, .json5, .jsonc, .ksh, .kt, .kts, .lua, .md, .nf, .p6, .php, .pl, .pl6, .pm, .pm6, .pp, .proto, .ps1, .ps1xml, .psd1, .psm1, .psrc, .pssc, .py, .r, .raku, .rakumod, .rakutest, .rb, .rs, .rst, .saas, .scala, .scss, .sh, .smk, .sql, .t, .tex, .tf, .ts, .vb, .xml, .yaml, .yml
        - File names (regex): Dockerfile, Jenkinsfile, Makefile, Snakefile
        - Excluding .gitignored files [0]: 
        Kept [1] files on [2] found files
        
        +----MATCHING LINTERS-----+------------+----------------+------------+
        | Descriptor | Linter     | Criteria   | Matching files | Format/Fix |
        +------------+------------+------------+----------------+------------+
        | ACTION     | actionlint | .yml|.yaml | 1              | no         |
        | COPYPASTE  | jscpd      |            | project        | no         |
        | REPOSITORY | checkov    |            | project        | no         |
        | REPOSITORY | devskim    |            | project        | no         |
        | REPOSITORY | dustilock  |            | project        | no         |
        | REPOSITORY | git_diff   |            | project        | no         |
        | REPOSITORY | gitleaks   |            | project        | no         |
        | REPOSITORY | secretlint |            | project        | no         |
        | REPOSITORY | syft       |            | project        | no         |
        | REPOSITORY | trivy      |            | project        | no         |
        | SPELL      | misspell   |            | 1              | no         |
        | SPELL      | cspell     |            | 1              | no         |
        | YAML       | prettier   | .yml|.yaml | 1              | no         |
        | YAML       | yamllint   | .yml|.yaml | 1              | no         |
        | YAML       | v8r        | .yml|.yaml | 1              | no         |
        +------------+------------+------------+----------------+------------+
        ::endgroup::
        ::group::[32m✅ Linted [REPOSITORY] files with [devskim] successfully - (0.65s)[0m (expand for details)
        - Using [devskim v0.7.104] https://megalinter.io/6.22.2/descriptors/repository_devskim
        - MegaLinter key: [REPOSITORY_DEVSKIM]
        - Rules config: identified by [devskim]
        ::endgroup::
        ::group::[32m✅ Linted [REPOSITORY] files with [gitleaks] successfully - (0.11s)[0m (expand for details)
        - Using [gitleaks v8.16.1] https://megalinter.io/6.22.2/descriptors/repository_gitleaks
        - MegaLinter key: [REPOSITORY_GITLEAKS]
        - Rules config: [.gitleaks.toml]
        ::endgroup::
        ::group::[32m✅ Linted [COPYPASTE] files with [jscpd] successfully - (0.93s)[0m (expand for details)
        - Using [jscpd v3.5.4] https://megalinter.io/6.22.2/descriptors/copypaste_jscpd
        - MegaLinter key: [COPYPASTE_JSCPD]
        - Rules config: [.jscpd.json]
        ::endgroup::
        ::group::[32m✅ Linted [YAML] files with [v8r] successfully - (3.14s)[0m (expand for details)
        - Using [v8r v1.0.0] https://megalinter.io/6.22.2/descriptors/yaml_v8r
        - MegaLinter key: [YAML_V8R]
        - Rules config: identified by [v8r]
        - Number of files analyzed: [1]
        ::endgroup::
        ::group::[32m✅ Linted [REPOSITORY] files with [trivy] successfully - (3.41s)[0m (expand for details)
        - Using [trivy v0.39.0] https://megalinter.io/6.22.2/descriptors/repository_trivy
        - MegaLinter key: [REPOSITORY_TRIVY]
        - Rules config: identified by [trivy]
        ::endgroup::
        ::group::[32m✅ Linted [ACTION] files with [actionlint] successfully - (0.02s)[0m (expand for details)
        - Using [actionlint v1.6.23] https://megalinter.io/6.22.2/descriptors/action_actionlint
        - MegaLinter key: [ACTION_ACTIONLINT]
        - Rules config: identified by [actionlint]
        - Number of files analyzed: [1]
        ::endgroup::
        ::group::[32m✅ Linted [REPOSITORY] files with [dustilock] successfully - (0.02s)[0m (expand for details)
        - Using [dustilock v1.2.0] https://megalinter.io/6.22.2/descriptors/repository_dustilock
        - MegaLinter key: [REPOSITORY_DUSTILOCK]
        - Rules config: identified by [dustilock]
        ::endgroup::
        ::group::[32m✅ Linted [REPOSITORY] files with [secretlint] successfully - (0.65s)[0m (expand for details)
        - Using [secretlint v6.2.3] https://megalinter.io/6.22.2/descriptors/repository_secretlint
        - MegaLinter key: [REPOSITORY_SECRETLINT]
        - Rules config: [.secretlintrc.json]
        - Ignore file: [.secretlintignore]
        ::endgroup::
        ::group::[32m✅ Linted [REPOSITORY] files with [syft] successfully - (0.43s)[0m (expand for details)
        - Using [syft v0.76.0] https://megalinter.io/6.22.2/descriptors/repository_syft
        - MegaLinter key: [REPOSITORY_SYFT]
        - Rules config: identified by [syft]
        ::endgroup::
        ::group::[32m✅ Linted [SPELL] files with [misspell] successfully - (0.04s)[0m (expand for details)
        - Using [misspell v0.3.4] https://megalinter.io/6.22.2/descriptors/spell_misspell
        - MegaLinter key: [SPELL_MISSPELL]
        - Rules config: identified by [misspell]
        - Number of files analyzed: [1]
        ::endgroup::
        ::group::[31m❌ Linted [SPELL] files with [cspell]: Found 2 error(s) - (2.85s)[0m (expand for details)
        - Using [cspell v6.31.1] https://megalinter.io/6.22.2/descriptors/spell_cspell
        - MegaLinter key: [SPELL_CSPELL]
        - Rules config: identified by [cspell]
        - Number of files analyzed: [2]
        --Error detail:
        \r1/2 ./.github/workflows/megalinter.yml 1669.08ms X
        /github/workspace/.github/workflows/megalinter.yml:63:15     - Unknown word (Endbug)     -- uses: Endbug/add-and-commit@v9
        \t Suggestions: [Ending, Endue, Bedbug, Redbug, Enugu]
        /github/workspace/.github/workflows/megalinter.yml:65:25     - Unknown word (Megalint)   -- #author_name: Megalint Bot
        \t Suggestions: [Megalinter, MegaLinter, Megalith, Megabit, Metaling]
        \r2/2 ./37ad74db-c6bb-4832-8906-01869873db0c-megalinter_file_names_cspell.txt 5.69ms
        CSpell: Files checked: 2, Issues found: 2 in 1 files
        
        ::endgroup::
        ::group::[33m✅ Linted [YAML] files with [prettier]: Found 1 non blocking error(s) - (0.42s)[0m (expand for details)
        - Using [prettier v2.8.7] https://megalinter.io/6.22.2/descriptors/yaml_prettier
        - MegaLinter key: [YAML_PRETTIER]
        - Rules config: identified by [prettier]
        - Number of files analyzed: [1]
        --Error detail:
        Checking formatting...
        [warn] .github/workflows/megalinter.yml
        [warn] Code style issues found in the above file. Forgot to run Prettier?
        
        ::endgroup::
        ::group::[31m❌ Linted [YAML] files with [yamllint]: Found 1 error(s) - (0.22s)[0m (expand for details)
        - Using [yamllint v1.30.0] https://megalinter.io/6.22.2/descriptors/yaml_yamllint
        - MegaLinter key: [YAML_YAMLLINT]
        - Rules config: [.yamllint.yml]
        - Number of files analyzed: [1]
        --Error detail:
        ::group::/github/workspace/.github/workflows/megalinter.yml
        ::warning file=/github/workspace/.github/workflows/megalinter.yml,line=3,col=1::3:1 [document-start] missing document start \"---\"
        ::warning file=/github/workspace/.github/workflows/megalinter.yml,line=5,col=1::5:1 [truthy] truthy value should be one of [false, true]
        ::warning file=/github/workspace/.github/workflows/megalinter.yml,line=65,col=12::65:12 [comments] missing starting space in comment
        ::warning file=/github/workspace/.github/workflows/megalinter.yml,line=66,col=12::66:12 [comments] missing starting space in comment
        ::warning file=/github/workspace/.github/workflows/megalinter.yml,line=67,col=12::67:12 [comments] missing starting space in comment
        ::warning file=/github/workspace/.github/workflows/megalinter.yml,line=68,col=12::68:12 [comments] missing starting space in comment
        ::warning file=/github/workspace/.github/workflows/megalinter.yml,line=69,col=12::69:12 [comments] missing starting space in comment
        ::error file=/github/workspace/.github/workflows/megalinter.yml,line=71,col=31::71:31 [new-line-at-end-of-file] no new line character at the end of file
        ::endgroup::
        
        
        ::endgroup::
        ::group::[32m✅ Linted [REPOSITORY] files with [git_diff] successfully - (0.01s)[0m (expand for details)
        - Using [git_diff v2.38.4] https://megalinter.io/6.22.2/descriptors/repository_git_diff
        - MegaLinter key: [REPOSITORY_GIT_DIFF]
        - Rules config: identified by [git_diff]
        ::endgroup::
        ::group::[32m✅ Linted [REPOSITORY] files with [checkov] successfully - (12.79s)[0m (expand for details)
        - Using [checkov v2.3.149] https://megalinter.io/6.22.2/descriptors/repository_checkov
        - MegaLinter key: [REPOSITORY_CHECKOV]
        - Rules config: [.checkov.yml]
        ::endgroup::
        
        +----SUMMARY----+------------+---------------+-------+-------+--------+--------------+
        | Descriptor    | Linter     | Mode          | Files | Fixed | Errors | Elapsed time |
        +---------------+------------+---------------+-------+-------+--------+--------------+
        | ✅ ACTION     | actionlint | list_of_files |     1 |       |      0 |        0.02s |
        | ✅ COPYPASTE  | jscpd      | project       |   n/a |       |      0 |        0.93s |
        | ✅ REPOSITORY | checkov    | project       |   n/a |       |      0 |       12.79s |
        | ✅ REPOSITORY | devskim    | project       |   n/a |       |      0 |        0.65s |
        | ✅ REPOSITORY | dustilock  | project       |   n/a |       |      0 |        0.02s |
        | ✅ REPOSITORY | gitleaks   | project       |   n/a |       |      0 |        0.11s |
        | ✅ REPOSITORY | git_diff   | project       |   n/a |       |      0 |        0.01s |
        | ✅ REPOSITORY | secretlint | project       |   n/a |       |      0 |        0.65s |
        | ✅ REPOSITORY | syft       | project       |   n/a |       |      0 |        0.43s |
        | ✅ REPOSITORY | trivy      | project       |   n/a |       |      0 |        3.41s |
        | ❌ SPELL      | cspell     | list_of_files |     2 |       |      2 |        2.85s |
        | ✅ SPELL      | misspell   | list_of_files |     1 |       |      0 |        0.04s |
        | ◬ YAML        | prettier   | list_of_files |     1 |       |      1 |        0.42s |
        | ✅ YAML       | v8r        | list_of_files |     1 |       |      0 |        3.14s |
        | ❌ YAML       | yamllint   | list_of_files |     1 |       |      1 |        0.22s |
        +---------------+------------+---------------+-------+-------+--------+--------------+
        
        [34mYou could have same capabilities but better runtime performances if you use a MegaLinter flavor:[0m
        - [documentation] oxsecurity/megalinter/flavors/documentation@v6.22.2 (48 linters) https://megalinter.io/6.22.2/flavors/documentation/
        - [ruby] oxsecurity/megalinter/flavors/ruby@v6.22.2 (48 linters) https://megalinter.io/6.22.2/flavors/ruby/
        - [rust] oxsecurity/megalinter/flavors/rust@v6.22.2 (48 linters) https://megalinter.io/6.22.2/flavors/rust/
        - [swift] oxsecurity/megalinter/flavors/swift@v6.22.2 (48 linters) https://megalinter.io/6.22.2/flavors/swift/
        - [go] oxsecurity/megalinter/flavors/go@v6.22.2 (50 linters) https://megalinter.io/6.22.2/flavors/go/
        - [java] oxsecurity/megalinter/flavors/java@v6.22.2 (51 linters) https://megalinter.io/6.22.2/flavors/java/
        - [php] oxsecurity/megalinter/flavors/php@v6.22.2 (51 linters) https://megalinter.io/6.22.2/flavors/php/
        - [salesforce] oxsecurity/megalinter/flavors/salesforce@v6.22.2 (51 linters) https://megalinter.io/6.22.2/flavors/salesforce/
        - [terraform] oxsecurity/megalinter/flavors/terraform@v6.22.2 (53 linters) https://megalinter.io/6.22.2/flavors/terraform/
        - [javascript] oxsecurity/megalinter/flavors/javascript@v6.22.2 (57 linters) https://megalinter.io/6.22.2/flavors/javascript/
        - [python] oxsecurity/megalinter/flavors/python@v6.22.2 (59 linters) https://megalinter.io/6.22.2/flavors/python/
        - [dotnet] oxsecurity/megalinter/flavors/dotnet@v6.22.2 (60 linters) https://megalinter.io/6.22.2/flavors/dotnet/
        - [cupcake] oxsecurity/megalinter/flavors/cupcake@v6.22.2 (82 linters) https://megalinter.io/6.22.2/flavors/cupcake/
        """
)

getLinterResult = [
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