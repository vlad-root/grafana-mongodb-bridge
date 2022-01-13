FROM node:14-alpine as build-stage

RUN apk add git
RUN mkdir -p /app

WORKDIR /app
COPY package.json /app/.
RUN yarn

COPY . /app
RUN yarn build

FROM grafana/grafana

USER root
COPY --from=build-stage /app/dist/ /var/lib/grafana/plugins/grafana-mongodb-bridge
RUN sed -i 's/;allow_loading_unsigned_plugins =.*/allow_loading_unsigned_plugins = grafana-mongodb-bridge-datasource/g' $GF_PATHS_CONFIG
USER grafana
