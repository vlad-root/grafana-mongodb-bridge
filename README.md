# Grafana MongoDB Bridge - MongoDB Datasource for Grafana 

### - [Plugin usage instructions and examples](/plugin/README.md)

This is a rewrite based on [JamesOsgood/mongodb-grafana](https://github.com/JamesOsgood/mongodb-grafana), including new features, docker deployment and fixes.

Features:
- Improved query substitutions
- Proper code editor widget for writing queries 
- Extended MongoDB query syntax using EJSON

Motivations:
- Insanely overpriced [45k$/year](https://stackoverflow.com/a/64655623) enterprise [official datasource](https://grafana.com/grafana/plugins/grafana-mongodb-datasource/)   
- JamesOsgood's MongoDB plugin is no longer maintained and missing some crucial functionality 


## Installation

- Create `docker-compose.yml` file:

```yml
version: "3"
services:

  grafana-mongodb-bridge:
    image: ghcr.io/vlad-root/grafana-mongodb-bridge:latest
    networks:
      - common
    ports:
      - 127.0.0.1:3333:3333

  # Either use a container with pre-built plugin
  grafana-mongodb-bridge-plugin:
    image: ghcr.io/vlad-root/grafana-mongodb-bridge-plugin:latest
    networks:
      - common
    ports:
      - 127.0.0.1:3001:3000

  # Or if you want to use official image - download the plugin from
  # the releases section and extract it in the ./_data/grafana/plugins folder
  
  # grafana:
  #   image: grafana/grafana:latest
  #   environment:
  #      # The plugin is unsigned, it needs to be allowed to run
  #     - GF_PLUGINS_ALLOW_LOADING_UNSIGNED_PLUGINS=grafana-mongodb-bridge
  #   volumes: 
  #     - ./_data/grafana/plugins:/var/lib/grafana/plugins/

networks:
  common:
```
- Run `docker-compose up -d`

## Development

- Run `docker-compose up --build` to start developing inside container (changes will be reflected in the real-time )

- See `docker-compose.yml` file for more information on development setup







