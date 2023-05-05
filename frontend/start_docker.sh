#! /bin/sh
# This script starts the frontend container and gives the possibility to delete all outdated images 

read -p "Before the process starts: Do you want to delete all prior, unassociated images? (You can build a new image later) [Y/N]: " remove_input
if [ $remove_input = 'Y' ]; then
    docker image prune -a
fi

read -p "Do you want to build a new image? (This process could take a while) [Y/N]: " build_input
if [ $build_input = 'Y' ]; then
    docker build -t angular-website:latest .
fi
docker run -p 4200:4200 --name angular-website angular-website:latest
