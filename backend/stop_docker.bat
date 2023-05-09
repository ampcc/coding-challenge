@REM This script stops the backend container and gives the possibility to delete all outdated container

echo "Shutting down the container for the django server!" 
docker stop django-server

set /P remove_input="Do you want to delete that container? (All prior containers will also be deleted) [Y/N]: "
IF %remove_input% == Y (
    docker container prune
) 
