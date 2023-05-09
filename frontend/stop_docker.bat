@REM This script stops the frontend container and gives the possibility to delete all outdated container

echo "Shutting down the container for the angular website!" 
docker stop angular-website

set /P remove_input="Do you want to delete that container? (All prior containers will also be deleted) [Y/N]: "
IF %remove_input% == Y (
    docker container prune
) 
