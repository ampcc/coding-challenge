#! /bin/sh
echo "Starting the container for the django server!\n"
read -p "Do you want to build a new image? (This process could take a while) [Y/N]: " input

if [ $input = 'Y' ]; then
    docker build -t django-server:latest .
fi
docker run -p 8000:8000 --name django-server django-server:latest
