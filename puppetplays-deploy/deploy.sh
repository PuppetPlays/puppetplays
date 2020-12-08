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
  printf "%s[DEPLOY] $message$nc" "$color";
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

# -----------------------------------------------------------------------------
# ---- MAIN -------------------------------------------------------------------
# -----------------------------------------------------------------------------
main() {
  pullImages
  stopExistingContainers
  startContainer "postgres"
  startContainer "console"
  startContainer "puppetplays-web"

  info "$PROJECT deployed"
  exit 0;
}

main
