FROM ubuntu:20.04

# Replace shell with bash so we can source files
RUN rm /bin/sh && ln -s /bin/bash /bin/sh

# Set debconf to run non-interactively
RUN echo debconf debconf/frontend select Noninteractive | debconf-set-selections

RUN apt update && apt install -y curl
RUN curl -sL https://deb.nodesource.com/setup_12.x | bash -
RUN apt update && apt install -y nodejs libcairo2 libpangocairo-1.0-0 parallel libjpeg8 openssl krb5-user libkrb5-dev git build-essential rsync

RUN mkdir -p /app /app_dependencies

# Work around for source code volume overwriting dependencies
WORKDIR /app_dependencies/
COPY package*.json /app_dependencies/
RUN npm install -g yarn && yarn && ( yarn audit || exit 0 ) 

WORKDIR /app
COPY . /app
RUN ln -s -f /app_dependencies/node_modules node_modules

CMD yarn start
