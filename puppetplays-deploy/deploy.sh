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
    
    # Ensure sshpass is installed on the server - with better error handling
    if ! command -v sshpass &> /dev/null; then
      info "installing sshpass for database sync"
      # Try with sudo first, then without sudo if that fails
      if sudo apt-get update && sudo apt-get install -y sshpass; then
        info "sshpass installed successfully"
      elif apt-get update && apt-get install -y sshpass; then
        info "sshpass installed successfully (without sudo)"
      else
        # If both methods fail, try to continue if sshpass was already installed
        # This is to handle the case where apt-get fails but sshpass is already installed
        if command -v sshpass &> /dev/null; then
          info "sshpass was already installed, continuing despite apt error"
        else
          warn "failed to install sshpass, attempting to continue..."
        fi
      fi
    fi
    
    # Export environment variables needed by the sync script
    # This ensures that the script has access to the necessary variables
    # even if they are slightly differently named in the CircleCI environment
    export PROD_SERVER="${PROD_SERVER:-cchum-kvm-puppetplays.huma-num.fr}"
    export PROD_USER="${PROD_USER:-$PROD_DB_USER}"
    export PROD_PASSWORD="${PROD_PASSWORD:-$PROD_DB_PASSWORD}"
    
    # Debug output (with redacted password)
    info "Production server: $PROD_SERVER"
    info "Production user: $PROD_USER"
    info "Production password set: $(if [ -n "${PROD_PASSWORD:-}" ]; then echo "yes"; else echo "no"; fi)"
    
    # Run the database sync script
    if [ -f "./scripts/sync-db.sh" ]; then
      chmod +x ./scripts/sync-db.sh
      if ./scripts/sync-db.sh; then
        info "Database sync completed successfully"
      else
        warn "Database sync failed with exit code $?"
        # Continue deployment even if sync fails
        # to ensure that staging is deployed with at least a fresh database
      fi
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
