FROM alpine:latest

RUN apk update
RUN apk add nodejs npm

RUN npm install -g @angular/cli

RUN mkdir frontend/

WORKDIR /frontend

COPY ./coding-challenge/ .

# Install project dependencies
RUN npm install package.json

CMD [ "ng", "serve", "--host", "0.0.0.0", "--poll", "500"]
