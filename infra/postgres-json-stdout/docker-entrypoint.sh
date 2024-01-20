#!/usr/bin/env bash

source docker-entrypoint-orig.sh

touch /var/log/postgresql/pg_log.json && chmod 666 /var/log/postgresql/pg_log.json
ln -sf /proc/1/fd/1 /var/log/postgresql/pg_log.json

if ! _is_sourced; then
	_main "$@"
fi