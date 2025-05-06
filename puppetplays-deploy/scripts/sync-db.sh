#!/bin/bash

# Database Synchronization Script for PuppetPlays Staging Environment
# This script downloads the latest database backup from production and imports it into staging
# It's designed to be run during the CI/CD pipeline deployment process

# Set strict error handling
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DEPLOY_DIR="$(dirname "$SCRIPT_DIR")"

# Logging function
log() {
  local message="$1"
  local timestamp=$(date +"%Y-%m-%d %H:%M:%S")
  echo -e "[$timestamp] $message" >&2
}

log "Starting database synchronization from production to staging environment"

# Print environment variables for debugging (redacting sensitive info)
log "Using production server: $PROD_SERVER"
log "Using production user: $PROD_USER"
log "Password defined: $(if [ -n "${PROD_PASSWORD:-}" ]; then echo "Yes"; else echo "No"; fi)"
log "Postgres variables: User=$POSTGRES_USER, DB=$POSTGRES_DB, Password defined=$(if [ -n "${POSTGRES_PASSWORD:-}" ]; then echo "Yes"; else echo "No"; fi)"

# Environment variables should be passed from CircleCI config
# PROD_SERVER, PROD_USER, PROD_PASSWORD, DB_PASSWORD (for staging)

# Validate required environment variables
if [ -z "${PROD_SERVER:-}" ] || [ -z "${POSTGRES_PASSWORD:-}" ]; then
  log "ERROR: Missing required environment variables."
  log "Please ensure PROD_SERVER and POSTGRES_PASSWORD are set."
  exit 1
fi

# If PROD_USER is not set, use the default (root for production server)
PROD_USER="${PROD_USER:-root}"

# Temporary directory for database dump
TEMP_DIR="/tmp/db_sync_staging"
mkdir -p $TEMP_DIR
log "Created temporary directory at $TEMP_DIR"

# Path to backups on the production server
BACKUP_PATH="/var/lib/puppetplays/database/postgres-backups/daily"

# Function to check SSH connection to server - with multiple methods
check_server_connection() {
  log "Checking connection to the production server..."
  
  # Method 1: Try using the CircleCI SSH key (should be added already)
  if ssh -o StrictHostKeyChecking=no "$PROD_USER@$PROD_SERVER" "echo 'Connection successful'" &>/tmp/ssh_debug.log; then
    log "Connection to the server successful using SSH key"
    export USE_SSH_KEY=true
    return 0
  fi
  
  log "SSH key authentication failed, trying password authentication..."
  
  # Method 2: Try using sshpass if available and password is provided
  if command -v sshpass &> /dev/null && [ -n "${PROD_PASSWORD:-}" ]; then
    # More verbose SSH command for troubleshooting
    if sshpass -p "$PROD_PASSWORD" ssh -v -o StrictHostKeyChecking=no "$PROD_USER@$PROD_SERVER" "echo 'Connection successful'" &>/tmp/ssh_debug.log; then
      log "Connection to the server successful using password"
      export USE_SSH_KEY=false
      return 0
    else
      log "ERROR: Failed to connect with password auth. Debug output:"
      cat /tmp/ssh_debug.log
    fi
  else
    log "ERROR: sshpass not available or password not provided"
  fi
  
  log "ERROR: All connection methods failed"
  return 1
}

# Function to download the latest database backup
download_latest_backup() {
  log "Fetching list of available backups from production..."
  
  # Command to list backup files on remote server
  local ssh_cmd
  if [ "${USE_SSH_KEY:-false}" = true ]; then
    ssh_cmd="ssh -o StrictHostKeyChecking=no $PROD_USER@$PROD_SERVER"
  else
    ssh_cmd="sshpass -p \"$PROD_PASSWORD\" ssh -o StrictHostKeyChecking=no $PROD_USER@$PROD_SERVER"
  fi
  
  # Get the list of backup files and sort them by date (newest first)
  LATEST_BACKUP=$(eval "$ssh_cmd \"ls -t $BACKUP_PATH/*.tar.gz 2>/dev/null | head -1\"")
  
  if [ -z "$LATEST_BACKUP" ]; then
    log "ERROR: No backup files found in $BACKUP_PATH"
    return 1
  fi
  
  BACKUP_FILENAME=$(basename "$LATEST_BACKUP")
  log "Latest backup found: $BACKUP_FILENAME"
  
  # Download the latest backup file
  log "Downloading the latest backup..."
  
  if [ "${USE_SSH_KEY:-false}" = true ]; then
    ssh -o StrictHostKeyChecking=no "$PROD_USER@$PROD_SERVER" "cat $LATEST_BACKUP" > "$TEMP_DIR/$BACKUP_FILENAME"
  else
    sshpass -p "$PROD_PASSWORD" ssh -o StrictHostKeyChecking=no "$PROD_USER@$PROD_SERVER" "cat $LATEST_BACKUP" > "$TEMP_DIR/$BACKUP_FILENAME"
  fi
  
  if [ ! -f "$TEMP_DIR/$BACKUP_FILENAME" ]; then
    log "ERROR: Failed to download the backup file."
    return 1
  fi
  
  log "Backup file downloaded to $TEMP_DIR/$BACKUP_FILENAME"
  
  # Extract the backup
  log "Extracting the backup file..."
  tar -xzf "$TEMP_DIR/$BACKUP_FILENAME" -C "$TEMP_DIR"
  
  # Find the extracted .dump file
  DUMP_FILE=$(find "$TEMP_DIR" -name "*.dump" | head -1)
  
  if [ -z "$DUMP_FILE" ]; then
    log "ERROR: Could not find .dump file in the extracted backup."
    return 1
  fi
  
  log "Backup extracted successfully: $DUMP_FILE"
  
  # Return the path to the dump file
  echo "$DUMP_FILE"
  return 0
}

# Function to import the database into staging PostgreSQL
import_to_staging_db() {
  local dump_file="$1"
  log "Importing database to staging environment..."
  
  # Run inside the staging PostgreSQL container
  log "Dropping and recreating schema in staging database..."
  docker exec postgres psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" -c 'DROP SCHEMA IF EXISTS public CASCADE; CREATE SCHEMA public;'
  
  log "Using pg_restore to import the database..."
  # Import with proper options to handle ownership differences
  cat "$dump_file" | docker exec -i postgres pg_restore -O -x --no-comments --clean --if-exists -U "$POSTGRES_USER" -d "$POSTGRES_DB" 2>/dev/null || true
  
  # Fix permissions to ensure the staging user has access to everything
  log "Fixing permissions for staging database user..."
  docker exec postgres psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" -c "GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO $POSTGRES_USER;"
  docker exec postgres psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" -c "GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO $POSTGRES_USER;"
  docker exec postgres psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" -c "GRANT ALL PRIVILEGES ON SCHEMA public TO $POSTGRES_USER;"
  
  # Verify that we have data in the database
  local table_count=$(docker exec postgres psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" -t -c 'SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = '"'"'public'"'"';' | tr -d ' ')
  log "Verified database contains $table_count tables."
  
  if [ "$table_count" -gt 0 ]; then
    log "Database import was successful!"
  else
    log "WARNING: Database appears to be empty after import. Please check for errors."
    return 1
  fi
  
  return 0
}

# Function to clean up temporary files
cleanup() {
  log "Cleaning up temporary files..."
  rm -rf "$TEMP_DIR"
  log "Cleanup completed"
}

# Main execution
main() {
  log "Starting main execution..."
  
  # Check prerequisites
  if ! check_server_connection; then
    log "ERROR: Cannot connect to the production server."
    exit 1
  fi
  
  # Ensure sshpass is installed
  if ! command -v sshpass &> /dev/null; then
    log "ERROR: sshpass is required but not installed."
    log "Please install sshpass first: apt-get install -y sshpass"
    exit 1
  fi
  
  # Download the latest backup
  DUMP_FILE=$(download_latest_backup)
  if [ $? -ne 0 ] || [ -z "$DUMP_FILE" ]; then
    log "ERROR: Failed to download and extract the latest backup."
    exit 1
  fi
  
  # Wait for PostgreSQL to be ready
  log "Waiting for PostgreSQL to be ready..."
  docker exec postgres pg_isready -U "$POSTGRES_USER" -d "$POSTGRES_DB" -t 60
  
  # Import the backup
  if ! import_to_staging_db "$DUMP_FILE"; then
    log "ERROR: Failed to import database to staging environment."
    exit 1
  fi
  
  cleanup
  
  log "Database synchronization completed successfully!"
  log "Your staging database now contains the production data from the latest backup."
}

# Execute the main function
main 