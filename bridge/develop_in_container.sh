#!/bin/bash -x

# This script provides a way to develop within docker container,
# elimnating the need to setup project-specific development environment 

# This script assumes that source code was mounted as docker volume,
# to do that you need to specify:
# volumes:
#   - ./server:/app/
#  in the docker-compose.yml file

echo "Synchronizing node_modules with docker host..."

rsync -av --info=progress2 --info=name0 /app_dependencies/node_modules/ node_modules

echo "Launching development environment..."

npm run develop