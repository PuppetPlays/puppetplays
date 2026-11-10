#!/usr/bin/env bash
# Usage: deploy.sh ADMIN_VERSION WEB_VERSION [--dry-run]
# Run prepare.sh first. Recreates the containers with the given image tags,
# runs Craft migrations and keeps old images for rollback.
set -euo pipefail
# shellcheck source=lib.sh
. /root/puppetplays-deploy/lib.sh

admin=$1 web=$2 dry=${3:-}
[ -f "$DIR/state/running.env" ] || { echo "run prepare.sh first"; exit 1; }

say "target release"
for pair in "puppetplays-admin:$admin" "puppetplays-web:$web"; do
  if docker image inspect "puppetplays/$pair" >/dev/null 2>&1; then
    echo "  puppetplays/$pair (present)"
  else
    echo "  puppetplays/$pair is not on the server: run 'ppdeploy ship' first"; exit 1
  fi
done

env_for "$admin" "$web"
say "check: compose resolves the same secrets as the running containers"
verify_env "$DIR/.env"
dc() { dc_with "$DIR/.env" "$@"; }
dc config --images | sed 's/^/  /'

if [ "$dry" = "--dry-run" ]; then
  say "dry run: nothing changed"
  exit 0
fi

# What to roll back to if this deploy is bad.
cp "$DIR/state/running.env" "$DIR/state/previous.env"

user=$(envget "$DIR/.env" POSTGRES_USER)
say "recreate containers"
dc up -d postgres
wait_postgres "$user"
dc up -d puppetplays-admin
sleep 5
say "craft up (migrations + project config)"
dc exec -T puppetplays-admin php craft up --interactive=0 --noBackup=1
dc up -d puppetplays-web
sleep 10

{ q ADMIN_VERSION "$admin"; q WEB_VERSION "$web"; q SAVED_AT "$(date +%Y%m%d-%H%M%S)"; } > "$DIR/state/running.env"
docker ps --format '  {{.Names}}\t{{.Image}}\t{{.Status}}'
echo "DEPLOY DONE"
