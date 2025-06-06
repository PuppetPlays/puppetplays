#!/usr/bin/env bash

# Script to update nginx configurations on remote server via SSH
# This script is called from CircleCI after docker deployment

set -euo pipefail

# Get server from DOCKER_HOST
if [[ "$DOCKER_HOST" =~ ssh://[^@]+@([^:]+) ]]; then
    SERVER_HOST="${BASH_REMATCH[1]}"
else
    echo "Error: Cannot extract host from DOCKER_HOST"
    exit 1
fi

# Determine environment
if [[ "$ENVIRONMENT" == "production" ]]; then
    NGINX_PREFIX="prod"
else
    NGINX_PREFIX="staging"
fi

echo "Updating nginx configurations on $SERVER_HOST for $ENVIRONMENT environment..."

# Create temporary directory for nginx configs
TEMP_DIR=$(mktemp -d)
trap "rm -rf $TEMP_DIR" EXIT

# Copy nginx configs to temp directory
cp nginx/${NGINX_PREFIX}-web.conf "$TEMP_DIR/web"
cp nginx/${NGINX_PREFIX}-admin.conf "$TEMP_DIR/admin"
[ -f nginx/${NGINX_PREFIX}-default.conf ] && cp nginx/${NGINX_PREFIX}-default.conf "$TEMP_DIR/default"
[ -f nginx/${NGINX_PREFIX}-ip.conf ] && cp nginx/${NGINX_PREFIX}-ip.conf "$TEMP_DIR/ip"

# Copy files to server and update nginx
ssh -o StrictHostKeyChecking=no root@$SERVER_HOST << 'ENDSSH'
set -e

# Create backup of current configs
echo "Backing up current nginx configurations..."
sudo cp -a /etc/nginx/sites-available /etc/nginx/sites-available.backup.$(date +%Y%m%d-%H%M%S)

echo "Testing nginx configuration..."
if sudo nginx -t; then
    echo "Nginx configuration is valid"
else
    echo "Error: Current nginx configuration is invalid"
    exit 1
fi
ENDSSH

# Copy new configs to server
echo "Copying new configurations to server..."
scp -o StrictHostKeyChecking=no $TEMP_DIR/* root@$SERVER_HOST:/tmp/

# Apply new configs on server
ssh -o StrictHostKeyChecking=no root@$SERVER_HOST << ENDSSH
set -e

# Move new configs to nginx directory
echo "Installing new configurations..."
[ -f /tmp/web ] && sudo mv /tmp/web /etc/nginx/sites-available/web
[ -f /tmp/admin ] && sudo mv /tmp/admin /etc/nginx/sites-available/admin
[ -f /tmp/default ] && sudo mv /tmp/default /etc/nginx/sites-available/default
[ -f /tmp/ip ] && sudo mv /tmp/ip /etc/nginx/sites-available/ip

# Test new configuration
echo "Testing new nginx configuration..."
if sudo nginx -t; then
    echo "New configuration is valid, reloading nginx..."
    sudo systemctl reload nginx
    echo "Nginx successfully reloaded with new configuration"
else
    echo "Error: New nginx configuration is invalid, reverting..."
    sudo rm -rf /etc/nginx/sites-available
    sudo mv /etc/nginx/sites-available.backup.* /etc/nginx/sites-available
    sudo nginx -t && sudo systemctl reload nginx
    echo "Reverted to previous configuration"
    exit 1
fi

# Clean up backup if successful
sudo rm -rf /etc/nginx/sites-available.backup.*
echo "Nginx configuration update completed successfully"
ENDSSH 