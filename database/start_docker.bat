@REM This script starts the backend container and gives the possibility to delete all outdated images

set /P remove_input="Before the process starts: Do you want to delete all prior, unassociated images? (You can build a new image later) [Y/N]: "
IF %remove_input% == Y (
    docker image prune -a
) 

set /P build_input="Do you want to build a new image? (This process could take a while) [Y/N]: "
IF %build_input% == Y (
    docker build -t database:latest .
) 
docker run -p 5432:5432 --name database database:latest
