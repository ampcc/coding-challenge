#!/bin/sh

cd codingchallenge
python3 manage.py makemigrations
python3 manage.py migrate
python3 manage.py runserver
# echo moin moin
