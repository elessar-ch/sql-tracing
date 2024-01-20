FROM postgres:16.1-bookworm

RUN mv /usr/local/bin/docker-entrypoint.sh /usr/local/bin/docker-entrypoint-orig.sh
COPY docker-entrypoint.sh /usr/local/bin/
