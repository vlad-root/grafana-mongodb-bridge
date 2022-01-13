FROM grafana/grafana

USER root
RUN sed -i 's/;allow_loading_unsigned_plugins =.*/allow_loading_unsigned_plugins = grafana-mongodb-bridge-datasource/g' $GF_PATHS_CONFIG
USER grafana
