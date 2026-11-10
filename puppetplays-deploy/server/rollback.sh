#!/usr/bin/env bash
# Usage: rollback.sh [--restore-db]
# Starts the release recorded in state/previous.env (the one running before the
# last deploy). With --restore-db it first restores latest-predeploy.dump,
# which is needed when the last deploy ran Craft migrations: an older Craft
# does not run on a migrated database. Restoring loses content edited since.
set -euo pipefail
# shellcheck source=lib.sh
. /root/puppetplays-deploy/lib.sh

restore=${1:-}
prev=$DIR/state/previous.env
[ -f "$prev" ] || { echo "no previous release recorded in $prev"; exit 1; }
admin=$(envget "$prev" ADMIN_VERSION)
web=$(envget "$prev" WEB_VERSION)
dump=$BACKUP_DIR/latest-predeploy.dump

say "roll back to admin $admin, web $web"
env_for "$admin" "$web"
verify_env "$DIR/.env"
dc() { dc_with "$DIR/.env" "$@"; }
user=$(envget "$DIR/.env" POSTGRES_USER)
db=$(envget "$DIR/.env" POSTGRES_DB)

if [ "$restore" = "--restore-db" ]; then
  [ -s "$dump" ] || { echo "no pre-deploy dump at $dump"; exit 1; }
  say "restore database from $(readlink -f "$dump")"
  docker stop puppetplays-web puppetplays-admin || true
  docker exec postgres psql -U "$user" -d postgres -qc "DROP DATABASE IF EXISTS $db;" -c "CREATE DATABASE $db OWNER $user;"
  docker exec -i postgres pg_restore -U "$user" -d "$db" --no-owner < "$dump"
fi

say "start previous release"
dc up -d
sleep 10
{ q ADMIN_VERSION "$admin"; q WEB_VERSION "$web"; q SAVED_AT "$(date +%Y%m%d-%H%M%S)"; } > "$DIR/state/running.env"
docker ps --format '  {{.Names}}\t{{.Image}}\t{{.Status}}'
echo "ROLLBACK DONE"
