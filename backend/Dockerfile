FROM python:3.11.2-alpine

RUN mkdir backend/
WORKDIR /backend
COPY . .

ENV PYTHONUNBUFFERED=1

RUN pip install -r requirements.txt

# RUN chmod +x docker_intern.sh
RUN chmod +x d.sh

CMD [ "./d.sh" ]
# CMD [ "./docker_intern.sh" ]
# CMD [ "/bin/sh", "docker_intern.sh" ]

