FROM alpine:latest

RUN apk update
RUN apk add nodejs npm

RUN npm install -g @angular/cli

RUN mkdir frontend/

WORKDIR /frontend

COPY ./coding-challenge/ .

CMD [ "ng", "serve" ]
