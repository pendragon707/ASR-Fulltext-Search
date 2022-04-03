#!/usr/bin/env bash

if [ ! -f /var/lib/postgres/data/postgresql.conf ]; then
  initdb --locale=en_US.UTF8 -E UTF8 -D /var/lib/postgres/data

  echo "password_encryption = scram-sha-256" >> /var/lib/postgres/data/postgresql.conf
  echo "listen_addresses = '*'" >> /var/lib/postgres/data/postgresql.conf

  pg_ctl -D "/var/lib/postgres/data" -o "-c listen_addresses=''" -w start

  psql -d postgres -c "CREATE USER db WITH PASSWORD '$(< /run/secrets/psql_password)';"
  psql -d postgres -c "CREATE DATABASE db OWNER 'db';"

  pg_ctl -D "/var/lib/postgres/data" -m fast -w stop

  echo "local all all scram-sha-256" > /var/lib/postgres/data/pg_hba.conf
  echo "host all all 0.0.0.0/0 scram-sha-256" >> /var/lib/postgres/data/pg_hba.conf
fi

exec postgres -D /var/lib/postgres/data
