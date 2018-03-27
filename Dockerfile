FROM python:2.7-slim
MAINTAINER Dan Achim <dan@hostatic.ro>

ENV INSTALL_PATH /parnaie
RUN mkdir -p $INSTALL_PATH

WORKDIR $INSTALL_PATH

COPY requirements.txt requirements.txt
RUN pip install -r requirements.txt
RUN apt-get update && apt-get -y install redis-tools

COPY . .

CMD gunicorn -b 0.0.0.0:8000 --access-logfile - "parnaie.app:create_app()"
