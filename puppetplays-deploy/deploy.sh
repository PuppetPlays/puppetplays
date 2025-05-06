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

syncProductionDatabase() {
  # Only run this for staging environment
  if [ "${ENVIRONMENT:-}" == "staging" ]; then
    info "syncing production database to staging"
    
    # Ensure sshpass is installed on the server
    if ! command -v sshpass &> /dev/null; then
      info "installing sshpass for database sync"
      apt-get update && apt-get install -y sshpass
    fi
    
    # Run the database sync script
    if [ -f "./scripts/sync-db.sh" ]; then
      chmod +x ./scripts/sync-db.sh
      ./scripts/sync-db.sh
    else
      warn "database sync script not found at ./scripts/sync-db.sh"
    fi
  else
    info "skipping database sync (not staging environment)"
  fi
}

# -----------------------------------------------------------------------------
# ---- MAIN -------------------------------------------------------------------
# -----------------------------------------------------------------------------
main() {
  pullImages
  stopExistingContainers
  startContainer "postgres"
  
  # Sync database only for staging environment
  if [ "${ENVIRONMENT:-}" == "staging" ]; then
    syncProductionDatabase
  fi
  
  startContainer "puppetplays-admin"
  startContainer "puppetplays-web"

  info "$PROJECT deployed"
  exit 0;
}

main
