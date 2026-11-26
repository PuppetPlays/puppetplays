#!/usr/bin/env bash
# Usage: deploy.sh ADMIN_VERSION WEB_VERSION [--dry-run]
# Run prepare.sh first. Recreates the containers with the given image tags,
# runs Craft migrations, then removes images that are neither running nor the
# rollback target. --dry-run checks everything and changes nothing.
set -euo pipefail
# shellcheck source=lib.sh
. /root/puppetplays-deploy/lib.sh

admin=$1 web=$2 dry=${3:-}

say "target release"
for pair in "puppetplays-admin:$admin" "puppetplays-web:$web"; do
  if docker image inspect "puppetplays/$pair" >/dev/null 2>&1; then
    echo "  puppetplays/$pair (present)"
  else
    echo "  puppetplays/$pair is not on the server: run 'ppdeploy ship' first"; exit 1
  fi
done

# The target configuration goes to .env.next; .env changes only on a real deploy.
next=$DIR/.env.next
env_file_for "$admin" "$web" "$next"
trap 'unlink "$next" 2>/dev/null || true' EXIT
say "check: compose resolves the same secrets as the running containers"
verify_env "$next"
dc_with "$next" config --images | sed 's/^/  /'

if [ "$dry" = "--dry-run" ]; then
  say "dry run: nothing changed"
  exit 0
fi

# Rollback target: the release that ran before, with the dump of its database.
# After an unfinished deploy, keep the last good target instead.
[ -f "$DIR/state/pending.env" ] || { echo "no state/pending.env: run prepare.sh first"; exit 1; }
if [ -f "$DIR/state/in-progress" ]; then
  echo "  last deploy did not finish: keeping state/previous.env as the rollback target"
  unlink "$DIR/state/pending.env"
else
  mv "$DIR/state/pending.env" "$DIR/state/previous.env"
fi
echo "$admin $web $(date +%Y%m%d-%H%M%S)" > "$DIR/state/in-progress"
mv "$next" "$DIR/.env"
trap - EXIT

dc() { dc_with "$DIR/.env" "$@"; }
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
write_running "$admin" "$web"
unlink "$DIR/state/in-progress"
docker ps --format '  {{.Names}}\t{{.Image}}\t{{.Status}}'
prune_images
echo "DEPLOY DONE"
