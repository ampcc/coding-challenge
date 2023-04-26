
docker build -t django-server:latest .
docker run --net=host django-server:latest

