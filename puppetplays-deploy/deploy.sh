#!/usr/bin/env bash

# Exit script if you try to use an uninitialized variable.
set -o nounset
# Exit script if a statement returns a non-true return value.
set -o errexit
# Use the error status of the first failure, rather than that of the last item in a pipeline.
set -o pipefail

readonly PROJECT=puppetplays


# -----------------------------------------------------------------------------
# ---- UTILS ------------------------------------------------------------------
# -----------------------------------------------------------------------------
log() {
  message=$1; shift
  color=$1; shift
  nc='\033[0m\n'
  echo -e "$color(DEPLOY) $message$nc";
}

info() {
  message=$1; shift
  green='\033[0;32m'
  log "$message" "$green"
}

warn() {
  message=$1; shift
  red='\033[0;31m'
  log "$message" "$red"
}

# -----------------------------------------------------------------------------
# ---- STEPS ------------------------------------------------------------------
# -----------------------------------------------------------------------------
pullImages() {
  info "pull service images"
  docker-compose -p "$PROJECT" pull
}

stopExistingContainers() {
  info "stop existing containers"
  docker-compose -p "$PROJECT" stop
}

startContainer() {
  container=$1
  info "start container: $container"
  docker-compose -p "$PROJECT" up -d "$container"
}

# Run pending Craft migrations and apply project config. Without this, Craft
# answers 503 to every API request after an update. The image has no pg_dump,
# so Craft's own pre-migration backup is skipped; rely on the daily db backup.
migrateCraft() {
  info "run craft migrations and apply project config"
  docker-compose -p "$PROJECT" exec -T puppetplays-admin php craft up --interactive=0 --noBackup=1
}

removeUnusedImages() {
  info "remove images not used by any container"
  docker image prune -a -f
}

# -----------------------------------------------------------------------------
# ---- MAIN -------------------------------------------------------------------
# -----------------------------------------------------------------------------
main() {
  # Note: Nginx configs must be updated manually on the server
  # The CI/CD environment cannot directly access the server filesystem
  
  pullImages
  stopExistingContainers
  startContainer "postgres"
  startContainer "puppetplays-admin"
  migrateCraft
  startContainer "puppetplays-web"
  removeUnusedImages

  info "$PROJECT deployed"
  exit 0;
}

main