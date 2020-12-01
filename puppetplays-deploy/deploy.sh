#!/bin/sh

# '-e' stop on the first failure
# '-u' prevent using an undefined variable
# '-o pipefail' force pipelines to fail on the first non-zero status code
set -euo pipefail

readonly ARGS=$*
readonly PROJECT=puppetplays


# -----------------------------------------------------------------------------
# ---- UTILS ------------------------------------------------------------------
# -----------------------------------------------------------------------------
log() {
  message=$1; shift
  color=$1; shift
  nc='\033[0m\n'
  printf "${color}[DEPLOY] $message$nc";
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
  startContainer "puppetplays-web"

  info "$PROJECT deployed"
  exit 0;
}

main
