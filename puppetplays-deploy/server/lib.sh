#!/usr/bin/env bash
# Shared helpers for the server scripts. Sourced, not executed.
# The scripts run as root on the production VM from /root/puppetplays-deploy,
# where `ppdeploy` installs them together with docker-compose.yml.
#
# .env files hold literal, single-quoted values: some production secrets start
# with '$', so these files must never be sourced by a shell.

# shellcheck disable=SC2034 # used by the scripts that source this file
readonly DIR=/root/puppetplays-deploy
readonly PROJECT=puppetplays
readonly BACKUP_DIR=/var/lib/puppetplays/database/postgres-backups/predeploy
readonly CONTAINERS=(postgres puppetplays-admin puppetplays-web)

# envget FILE KEY -> value without the surrounding single quotes
envget() { grep -m1 "^$2=" "$1" | cut -d= -f2- | sed "s/^'//; s/'\$//"; }

# q KEY VALUE -> KEY='VALUE' (literal for docker compose)
q() {
  case $2 in *"'"*) echo "value of $1 contains a single quote" >&2; return 1;; esac
  printf "%s='%s'\n" "$1" "$2"
}

dc_with() {
  local envfile=$1; shift
  docker compose -p "$PROJECT" --env-file "$envfile" -f "$DIR/docker-compose.yml" "$@"
}

# image_tag CONTAINER -> tag of the image the container runs
image_tag() { docker inspect --format '{{.Config.Image}}' "$1" | sed 's/.*://'; }

# env_file_for ADMIN_VERSION WEB_VERSION FILE -> FILE = .env.base + image tags
env_file_for() {
  (umask 077; { cat "$DIR/.env.base"; q ADMIN_VERSION "$1"; q WEB_VERSION "$2"; } > "$3")
}

# write_running ADMIN_VERSION WEB_VERSION -> state/running.env
write_running() {
  { q ADMIN_VERSION "$1"; q WEB_VERSION "$2"; q SAVED_AT "$(date +%Y%m%d-%H%M%S)"; } > "$DIR/state/running.env"
}

# Remove puppetplays images that are neither running nor the rollback target,
# then dangling layers. Old releases filled the disk before.
prune_images() {
  local keep=() repo tag
  keep+=("puppetplays/puppetplays-admin:$(image_tag puppetplays-admin)")
  keep+=("puppetplays/puppetplays-web:$(image_tag puppetplays-web)")
  if [ -f "$DIR/state/previous.env" ]; then
    keep+=("puppetplays/puppetplays-admin:$(envget "$DIR/state/previous.env" ADMIN_VERSION)")
    keep+=("puppetplays/puppetplays-web:$(envget "$DIR/state/previous.env" WEB_VERSION)")
  fi
  say "remove images that are neither running nor the rollback target"
  while read -r repo tag; do
    local ref="$repo:$tag"
    if printf '%s\n' "${keep[@]}" | grep -qxF "$ref"; then
      echo "  keep   $ref"
    else
      echo "  remove $ref"
      docker rmi "$ref" >/dev/null
    fi
  done < <(docker images --format '{{.Repository}} {{.Tag}}' | grep -E '^puppetplays/puppetplays-(admin|web) ')
  docker image prune -f >/dev/null
}

# verify_env FILE: fail unless compose resolves the same secrets and URLs that
# the running containers use today.
verify_env() {
  local envfile=$1 resolved
  resolved=$(umask 077; mktemp "$DIR/.compose-XXXXXX.json")
  dc_with "$envfile" config --format json > "$resolved"
  python3 - "$resolved" <<'PY'
import json, os, subprocess, sys
cfg = json.load(open(sys.argv[1]))["services"]
os.remove(sys.argv[1])
checks = {
    "postgres": ["POSTGRES_PASSWORD", "POSTGRES_USER", "POSTGRES_DB"],
    "puppetplays-admin": ["DB_PASSWORD", "DB_USER", "DB_DATABASE", "SECURITY_KEY",
        "PLUGIN_WORKFLOW_KEY", "ENVIRONMENT", "SITE_URL", "CP_URL", "COOKIE_DOMAIN", "EMAIL_HOSTNAME"],
    "puppetplays-web": ["NEXT_PUBLIC_API_URL"],
}
bad = 0
for service, keys in checks.items():
    out = subprocess.run(["docker", "inspect", "--format", "{{json .Config.Env}}", service],
                         capture_output=True, text=True, check=True).stdout
    running = dict(e.split("=", 1) for e in json.loads(out))
    env = cfg[service].get("environment") or {}
    for k in keys:
        # `compose config` prints a literal "$" as "$$"; containers get one "$".
        same = (env.get(k) or "").replace("$$", "$") == running.get(k)
        if not same:
            print(f"  {service} {k}: DIFFERENT from the running container")
        bad += not same
print(f"  secrets and URLs: {'all match the running containers' if not bad else f'{bad} differ'}")
sys.exit(1 if bad else 0)
PY
}

wait_postgres() {
  local user=$1
  for _ in $(seq 1 30); do
    docker exec postgres pg_isready -U "$user" >/dev/null 2>&1 && return 0
    sleep 2
  done
  echo "postgres did not become ready" >&2
  return 1
}

say() { printf '\n== %s\n' "$*"; }
