echo "Starting the container for the angular website!"
set /P input="Do you want to build a new image? (This process could take a while) [Y/N]: "
IF %input% == Y (
    docker build -t angular-website:latest .
) 
docker run -p 4200:4200 --name angular-website angular-website:latest
