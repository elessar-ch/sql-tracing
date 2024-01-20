# Description

This image allows logging in JSON format to `stdout`.

## Usage

Should use the following settings in `postgresql.conf`.

```
logging_collector = on		# Enable capturing of stderr, jsonlog,
log_destination = 'jsonlog'
log_directory = '/var/log/postgresql'
log_filename = 'pg_log'
```

Use the following command and volume to use the `postgresql.conf`.
```
    command:
      - "postgres"
      - "-c"
      - "config_file=/etc/postgresql/postgresql.conf"
    volumes:
      - "./your-postgresql.conf:/etc/postgresql/postgresql.conf"
      - ...
```

## Caveats
Some non-json log messages will also be written to `stdout`.