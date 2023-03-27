# Backend Virtual Environment Setup
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