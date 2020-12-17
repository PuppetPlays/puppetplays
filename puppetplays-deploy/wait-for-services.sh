#!/bin/sh

set -e
  
until PGPASSWORD=$DB_PASSWORD psql -h "$DB_SERVER" -U "$DB_USER" -c '\q'; do
  >&2 echo "Postgres is unavailable - sleeping"
  sleep 1
done

req="curl --output /dev/null --silent --head --fail http://puppetplays-admin:8080/admin/login"

until eval "$req"; do
  >&2 echo "CraftCMS is unavailable - sleeping"
  sleep 1
done
  
>&2 echo "Postgres & craft are up"
