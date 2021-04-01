#!/bin/bash

# '-e' stop on the first failure
# '-u' prevent using an undefined variable
# '-o pipefail' force pipelines to fail on the first non-zero status code
set -euo pipefail

readonly BACKUP_DATE_DIR="$1"
readonly PUPPETPLAYS_HOST_DIR='/var/lib/puppetplays'
readonly BACKUP_HOST_DIR="$PUPPETPLAYS_HOST_DIR/database/postgres-backups/$BACKUP_DATE_DIR"

case $BACKUP_DATE_DIR in
  'daily')
    FILE_DELETE_DELAY=+6
    ;;
  *)
    FILE_DELETE_DELAY=+21
    ;;
esac

echo " Start postgres db backup "

now=$(date +"%m_%d_%Y")
postgresContainerId=$(docker ps --format "{{.ID}}" --filter "name=postgres")

mkdir -p "$BACKUP_HOST_DIR"

docker exec "$postgresContainerId" bash -c 'pg_dump -Fc -U puppetplays > /db.dump'
docker cp "$postgresContainerId":/db.dump "$BACKUP_HOST_DIR/puppetplays_backup_$now.dump"

cd "$BACKUP_HOST_DIR" && tar -vczf puppetplays_backup_$now.tar.gz puppetplays_backup_$now.dump
rm ./puppetplays_backup_$now.dump
find "$BACKUP_HOST_DIR" -mtime $FILE_DELETE_DELAY -type f -delete

echo " Postgres db backup done! "