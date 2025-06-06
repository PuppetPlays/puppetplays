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
updateNginxConfig() {
  info "update nginx configuration"
  
  # Déterminer l'environnement
  if [[ "$ENVIRONMENT" == "production" ]]; then
    NGINX_PREFIX="prod"
  else
    NGINX_PREFIX="staging"
  fi
  
  # Copier les configurations nginx
  sudo cp "nginx/${NGINX_PREFIX}-web.conf" /etc/nginx/sites-available/web
  sudo cp "nginx/${NGINX_PREFIX}-admin.conf" /etc/nginx/sites-available/admin
  sudo cp "nginx/${NGINX_PREFIX}-default.conf" /etc/nginx/sites-available/default 2>/dev/null || true
  sudo cp "nginx/${NGINX_PREFIX}-ip.conf" /etc/nginx/sites-available/ip 2>/dev/null || true
  
  # Tester la configuration
  if sudo nginx -t; then
    info "nginx configuration is valid, reloading..."
    sudo systemctl reload nginx
  else
    warn "nginx configuration test failed, skipping reload"
    exit 1
  fi
}

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
  updateNginxConfig
  pullImages
  stopExistingContainers
  startContainer "postgres"
  startContainer "puppetplays-admin"
  startContainer "puppetplays-web"

  info "$PROJECT deployed"
  exit 0;
}

main