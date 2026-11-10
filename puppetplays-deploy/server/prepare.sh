#!/usr/bin/env bash
# Usage: prepare.sh [--no-dump]
# Changes no running service. Records the running release, rebuilds
# .env.base from the running containers and takes a verified database dump.
set -euo pipefail
# shellcheck source=lib.sh
. /root/puppetplays-deploy/lib.sh

nodump=${1:-}
umask 077
ts=$(date +%Y%m%d-%H%M%S)
mkdir -p "$DIR/state" "$DIR/state/inspect" "$BACKUP_DIR"

say "running release"
for c in "${CONTAINERS[@]}"; do
  docker inspect "$c" > "$DIR/state/inspect/$c-$ts.json"
  printf '  %-18s %s\n' "$c" "$(docker inspect --format '{{.Config.Image}}' "$c")"
done
{
  q ADMIN_VERSION "$(image_tag puppetplays-admin)"
  q WEB_VERSION "$(image_tag puppetplays-web)"
  q SAVED_AT "$ts"
} > "$DIR/state/running.env"

say ".env.base from the running containers"
val() {
  docker inspect --format '{{range .Config.Env}}{{println .}}{{end}}' "$1" | grep -m1 "^$2=" | cut -d= -f2-
}
{
  q POSTGRES_PASSWORD "$(val postgres POSTGRES_PASSWORD)"
  q POSTGRES_USER "$(val postgres POSTGRES_USER)"
  q POSTGRES_DB "$(val postgres POSTGRES_DB)"
  q PUPPETPLAYS_HOST_DIR /var/lib/puppetplays
  for k in SECURITY_KEY PLUGIN_WORKFLOW_KEY ENVIRONMENT SITE_URL CP_URL COOKIE_DOMAIN EMAIL_HOSTNAME EMAIL_PORT EMAIL_SENDER; do
    q "$k" "$(val puppetplays-admin "$k")"
  done
  q NEXT_PUBLIC_API_URL "$(val puppetplays-web NEXT_PUBLIC_API_URL)"
} > "$DIR/.env.base"
if grep -qE "=''$" "$DIR/.env.base"; then
  grep -E "=''$" "$DIR/.env.base" | cut -d= -f1 | sed 's/^/  EMPTY: /'
  exit 1
fi
[ "$(val puppetplays-admin DB_PASSWORD)" = "$(val postgres POSTGRES_PASSWORD)" ] \
  || { echo "  admin DB_PASSWORD differs from postgres POSTGRES_PASSWORD"; exit 1; }
echo "  $(wc -l < "$DIR/.env.base") values, none empty"

if [ "$nodump" = "--no-dump" ]; then
  echo "PREPARE OK $ts (no dump)"
  exit 0
fi

say "pre-deploy database dump"
user=$(envget "$DIR/.env.base" POSTGRES_USER)
db=$(envget "$DIR/.env.base" POSTGRES_DB)
dump="$BACKUP_DIR/puppetplays_predeploy_$ts.dump"
docker exec postgres pg_dump -U "$user" -Fc "$db" > "$dump"
tables=$(docker exec -i postgres pg_restore --list < "$dump" | grep -c 'TABLE DATA')
echo "  $dump ($(du -h "$dump" | cut -f1), $tables tables with data)"
[ "$tables" -gt 50 ] || { echo "  dump looks wrong"; exit 1; }
ln -sfn "$dump" "$BACKUP_DIR/latest-predeploy.dump"
find "$BACKUP_DIR" -name 'puppetplays_predeploy_*.dump' -mtime +60 -delete
echo "PREPARE OK $ts"
