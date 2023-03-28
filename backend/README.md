# Virual Environment Setup

## Installation

1. Make sure you are running on the latest python3-version (initial version: 3.11.2)
   
   ```
   python3 --version
   ```
2. Change to backend directory and create virtual environment.
   
    ```
   cd backend
   python3 -m venv env
   ```
3. Source virtual environment
   
   ```
   source env/bin/activate
   ```

4. Make sure that you are now in the virtual environment (indicated by `(env)` before the username in your shell). Afterwards, install the required dependencies from the **requirements.txt** with:
    ```
    pip install -r requirements.txt
    ```

5. If you are developing in VS-Code you should create a launch.json. You can do this by selecting the `Run and Debug`-tab (Play icon with the bug on the left handside). Then press `create a launch.json file` and choose `Python` followed by `Django` <br>Enter the following path `${workspaceFolder}/backend/codingchallenge/manage.py`.

6. Select the virtual-environment as your python-interpreter. Open the Command Pallette by hitting `CMD/CTRL + SHIFT + P`.<br>Now type `Python: Select Interpreter` and choose the virtual-environment located at `./backend/env/bin/python`.

7. Now you are ready to run the backend-server by starting the VS-Code debugger (e.g. `FN + F5`).

<br>

## Problems you might face with Windows


1. The Python-CLI might only work with `py` instead of `python`
2. You <u>won't</u> be able to source in Windows shells
   <br>
   <br>
   > **Solution:** <br> When you create a virtualenv under Windows, python creates a subfolder called 'Scripts' in the 'env' directory which contains a `activate.bat` file. You will have to run this script file. Afterwards, there is the `(env)` before your path in the shell confirming the activation of the virtualenv.
   <br>
   <br>
   If you stil have trouble activating the virtualenv, consider switching from PowerShell (PS) to ComandPrompt (CMD). We recommend selecting the Command Prompt as your default shell in VS Code. To do this, go to the Command Pallette (`CMD/CTRL + SHIFT + P`) and type `Terminal: Select Default Profile`, then choose `Command Prompt`.
3. VS Code might not identify your virtualenv as another interpreter option (see 6.). You will have to specify the path to the python.exe manually: `.backend\env\Scripts\python.exe`


---

# Unittests

Django’s unit tests use a Python standard library module: [unittest](https://docs.python.org/3/library/unittest.html#module-unittest).

1. The folder structure of testcases looks like the following:
   ```
   demo
   └── tests
       ├── __init__.py         # for discovery
       ├── component1
       │   ├── __init__.py     # for discovery
       │   ├── test_case2.py
       │   └── test_case3.py
       └──test_case1.py
   ```

2. To write a Testcase just use `django.test.TestCase`:
   ```
   from django.test import TestCase
   
   class NewTestCase(TestCase):
   ```

2. Make sure you are in the same directory as the `manage.py` file.


3. To execute **just** the method `method1()` in the test located in `backend/demo/tests/component1/test1.py`, type:
   ```
   python3 manage.py test demo.tests.component1.test_case1.method1
   ```

4. To execute **just** the test located in `backend/demo/tests/component1/test1.py`, type:
   ```
   python3 manage.py test demo.tests.component1.test_case1
   ```

5. To execute **all** tests located beyond `backend/demo/tests/component1/*`, type:
   ```
   python3 manage.py test demo.tests.component1
   ```

6. To execute **all** tests type:
   ```
   python3 manage.py test
   ```
