#!/usr/bin/env bash
# Usage: rollback.sh [--restore-db]
# Starts the release recorded in state/previous.env (the one running before the
# last deploy). With --restore-db it also restores the database dump recorded
# with that release, which is needed when the last deploy ran Craft
# migrations: an older Craft does not run on a migrated database. Content
# edited since the deploy is lost.
#
# The dump is restored into a separate database first. Production is only
# touched once that restore has succeeded, and the replaced database is kept.
set -Eeuo pipefail
# shellcheck source=lib.sh
. /root/puppetplays-deploy/lib.sh

restore=${1:-}
prev=$DIR/state/previous.env
[ -f "$prev" ] || { echo "no previous release recorded in $prev"; exit 1; }
admin=$(envget "$prev" ADMIN_VERSION)
web=$(envget "$prev" WEB_VERSION)
dump=$(envget "$prev" DUMP)
user=$(envget "$DIR/.env.base" POSTGRES_USER)
db=$(envget "$DIR/.env.base" POSTGRES_DB)
# Underscores only: the timestamp goes into a database name.
ts=$(date +%Y%m%d_%H%M%S)

say "roll back to admin $admin, web $web"
next=$DIR/.env.next
env_file_for "$admin" "$web" "$next"
trap 'unlink "$next" 2>/dev/null || true' EXIT
verify_env "$next"

psql_admin() { docker exec postgres psql -v ON_ERROR_STOP=1 -U "$user" -d postgres -qtAc "$1"; }

if [ "$restore" = "--restore-db" ]; then
  [ -s "$dump" ] || { echo "the dump recorded for this release is missing: $dump"; exit 1; }
  staging_db="${db}_restore"
  say "restore $(basename "$dump") into $staging_db (production untouched)"
  psql_admin "DROP DATABASE IF EXISTS $staging_db;"
  psql_admin "CREATE DATABASE $staging_db OWNER $user;"
  if ! docker exec -i postgres pg_restore -U "$user" -d "$staging_db" --no-owner \
         --exit-on-error --single-transaction < "$dump"; then
    psql_admin "DROP DATABASE IF EXISTS $staging_db;"
    echo "restore failed: production database and containers were not touched"
    exit 1
  fi

  say "swap databases"
  # If anything fails from here on, put the current release back.
  recover() {
    trap - ERR
    echo "rollback failed during the swap, restoring the previous state"
    if ! psql_admin "SELECT 1 FROM pg_database WHERE datname='$db'" | grep -q 1; then
      psql_admin "ALTER DATABASE ${db}_replaced_$ts RENAME TO $db;" || true
    fi
    psql_admin "DROP DATABASE IF EXISTS $staging_db;" || true
    dc_with "$DIR/.env" up -d || true
  }
  trap recover ERR
  docker stop puppetplays-web puppetplays-admin >/dev/null
  psql_admin "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname IN ('$db','$staging_db') AND pid <> pg_backend_pid();" >/dev/null
  psql_admin "ALTER DATABASE $db RENAME TO ${db}_replaced_$ts;"
  psql_admin "ALTER DATABASE $staging_db RENAME TO $db;"
  echo "  replaced database kept as ${db}_replaced_$ts (drop it once the rollback is confirmed)"
fi

say "start previous release"
mv "$next" "$DIR/.env"
dc_with "$DIR/.env" up -d
trap - ERR
sleep 10
write_running "$admin" "$web"
[ -f "$DIR/state/in-progress" ] && unlink "$DIR/state/in-progress"
docker ps --format '  {{.Names}}\t{{.Image}}\t{{.Status}}'
echo "ROLLBACK DONE"
