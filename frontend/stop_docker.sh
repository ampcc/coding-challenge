#! /bin/sh
# This script stops the frontend container and gives the possibility to delete all outdated container

echo "Shutting down the container for the angular website!" 
docker stop angular-website

read -p "Do you want to delete that container? (All prior containers will also be deleted) [Y/N]: " remove_input
if [ $remove_input = 'Y' ]; then
    docker container prune
fi 
