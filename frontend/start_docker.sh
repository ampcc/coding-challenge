#!/bin/sh
echo "Starting the container for the angular website!\n"
read -p "Do you want to build a new image? (This process could take a while) [Y/N]: " input

if [ $(input) = 'Y' ]; then
    docker build -t angular-website:latest .
fi
docker run -p 4200:4200 --name angular-website angular-website:latest
