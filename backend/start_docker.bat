echo "Starting the container for the django server!"
set /P input="Do you want to build a new image? (This process could take a while) [Y/N]: "
IF %input% == Y (
    docker build -t django-server:latest .
) 
docker run -p 8000:8000 --name django-server django-server:latest
