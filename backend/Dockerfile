FROM python:3.11.2-alpine

RUN apk update

RUN mkdir backend/
WORKDIR /backend
COPY . .

ENV PYTHONUNBUFFERED=1

# This is needed for django to communicate with postgreSQL 
RUN apk add libpq-dev
RUN apk add --no-cache --virtual .pynacl_deps build-base python3-dev libffi-dev
RUN pip install -r requirements.txt

RUN chmod +x docker_intern.sh
CMD [ "./docker_intern.sh" ]
