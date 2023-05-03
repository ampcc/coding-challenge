FROM python:3.11.2-alpine

# Since the development team partially uses Windows pcs, some files use the DOS specific newline encoding of CRLF
# But Linux (alpine) has a problem with those line endings, hence a conversion to Unix specific encoding is needed
# For this purpose, dos2unix is used to conveniently convert the encoding 
RUN apk update
RUN apk add dos2unix

RUN mkdir backend/
WORKDIR /backend
COPY . .

ENV PYTHONUNBUFFERED=1

EXPOSE 8000

RUN pip install -r requirements.txt

RUN dos2unix docker_intern.sh
RUN chmod +x docker_intern.sh

CMD [ "./docker_intern.sh" ]
