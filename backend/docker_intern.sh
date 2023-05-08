#! /bin/sh
# This file is used to start the application inside the container
# It is not meant to be run outside the container

cd codingchallenge
python3 manage.py makemigrations
python3 manage.py migrate
python3 manage.py runserver 0.0.0.0:8000
