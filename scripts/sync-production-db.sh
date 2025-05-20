#!/bin/bash

# Database Synchronization Script for PuppetPlays
# This script downloads the latest database backup and imports it into your local DDEV environment

# Set strict error handling
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"

# Check for .env file
if [ ! -f "$SCRIPT_DIR/.env" ]; then
  echo "ERROR: No .env file found!" >&2
  echo "Please copy $SCRIPT_DIR/.env.example to $SCRIPT_DIR/.env and update it with your credentials." >&2
  echo "Run: cp $SCRIPT_DIR/.env.example $SCRIPT_DIR/.env" >&2
  exit 1
fi

# Load environment variables from .env file
export $(grep -v '^#' "$SCRIPT_DIR/.env" | xargs)

# Validate required environment variables
if [ -z "${PROD_SERVER:-}" ] || [ -z "${PROD_USER:-}" ] || [ -z "${PROD_PASSWORD:-}" ]; then
  echo "ERROR: Missing required environment variables." >&2
  echo "Please check your .env file and ensure PROD_SERVER, PROD_USER, and PROD_PASSWORD are set." >&2
  exit 1
fi

# Logging function - sends output to stderr so it doesn't interfere with function returns
log() {
  local message="$1"
  local timestamp=$(date +"%Y-%m-%d %H:%M:%S")
  echo -e "[$timestamp] $message" >&2
}

log "Starting database synchronization from production to local environment"

# Temporary directory for database dump
TEMP_DIR="$SCRIPT_DIR/temp_db_sync"
mkdir -p $TEMP_DIR
log "Created temporary directory at $TEMP_DIR"

# Ensure we have sshpass installed
if ! command -v sshpass &> /dev/null; then
  log "sshpass is not installed. Attempting to install it..."
  if command -v brew &> /dev/null; then
    brew install hudochenkov/sshpass/sshpass
  elif command -v apt-get &> /dev/null; then
    sudo apt-get update && sudo apt-get install -y sshpass
  elif command -v yum &> /dev/null; then
    sudo yum install -y sshpass
  else
    log "ERROR: Could not install sshpass. Please install it manually and run the script again."
    exit 1
  fi
fi

# Check if pv (pipe viewer) is installed for progress bar
have_pv=false
if command -v pv &> /dev/null; then
  have_pv=true
  log "Pipe Viewer (pv) is already installed."
else
  log "Pipe Viewer (pv) is not installed. Attempting to install it..."
  if command -v brew &> /dev/null; then
    brew install pv
    have_pv=true
  elif command -v apt-get &> /dev/null; then
    sudo apt-get update && sudo apt-get install -y pv
    have_pv=true
  elif command -v yum &> /dev/null; then
    sudo yum install -y pv
    have_pv=true
  else
    log "WARNING: Could not install pv automatically. Using built-in progress bar instead."
  fi
  
  # Check if installation succeeded
  if command -v pv &> /dev/null; then
    have_pv=true
    log "Pipe Viewer (pv) installed successfully."
  fi
fi

# Function to display progress bar
display_progress() {
  local current=$1
  local total=$2
  local width=50
  local percentage=$((current * 100 / total))
  local completed=$((width * current / total))
  local remaining=$((width - completed))
  
  # Create the progress bar
  local bar="["
  for ((i=0; i<completed; i++)); do
    bar+="#"
  done
  for ((i=0; i<remaining; i++)); do
    bar+="."
  done
  bar+="] $percentage%"
  
  # Print the progress bar (overwrite the previous line)
  echo -ne "\r$bar" >&2
}

# Function to check SSH connection to server
check_server_connection() {
  log "Checking connection to the production server..."
  if sshpass -p "$PROD_PASSWORD" ssh -o StrictHostKeyChecking=no "$PROD_USER@$PROD_SERVER" "echo 'Connection successful'" &>/dev/null; then
    log "Connection to the server is successful."
    return 0
  else
    log "ERROR: Failed to connect to the server. Please check your credentials and network connection."
    return 1
  fi
}

# Path to backups on the production server
BACKUP_PATH="/var/lib/puppetplays/database/postgres-backups/daily"

# Function to download the latest database backup
download_latest_backup() {
  log "Fetching list of available backups..."
  
  # Get the list of backup files and sort them by date (newest first)
  LATEST_BACKUP=$(sshpass -p "$PROD_PASSWORD" ssh -o StrictHostKeyChecking=no "$PROD_USER@$PROD_SERVER" "ls -t $BACKUP_PATH/*.tar.gz 2>/dev/null | head -1")
  
  if [ -z "$LATEST_BACKUP" ]; then
    log "ERROR: No backup files found in $BACKUP_PATH"
    return 1
  fi
  
  BACKUP_FILENAME=$(basename "$LATEST_BACKUP")
  log "Latest backup found: $BACKUP_FILENAME"
  
  # Get file size for progress calculation
  local FILE_SIZE=$(sshpass -p "$PROD_PASSWORD" ssh -o StrictHostKeyChecking=no "$PROD_USER@$PROD_SERVER" "stat -c %s $LATEST_BACKUP 2>/dev/null || stat -f %z $LATEST_BACKUP 2>/dev/null")
  
  # Download the latest backup file with progress
  log "Downloading the latest backup ($FILE_SIZE bytes)..."
  
  if $have_pv; then
    # Download with pv for progress indication
    sshpass -p "$PROD_PASSWORD" ssh -o StrictHostKeyChecking=no "$PROD_USER@$PROD_SERVER" "cat $LATEST_BACKUP" | pv -s "$FILE_SIZE" > "$TEMP_DIR/$BACKUP_FILENAME"
  else
    # Download with custom progress bar (for MacOS and Linux)
    local temp_file="$TEMP_DIR/download_temp"
    
    # Start download in background with progress tracking
    (
      sshpass -p "$PROD_PASSWORD" ssh -o StrictHostKeyChecking=no "$PROD_USER@$PROD_SERVER" "cat $LATEST_BACKUP" > "$temp_file"
      echo "DOWNLOAD_COMPLETE" > "$TEMP_DIR/download_status"
    ) &
    
    # Wait for download to complete while showing progress
    local download_pid=$!
    local download_complete=false
    
    echo "" >&2
    while ! $download_complete; do
      if [ -f "$TEMP_DIR/download_status" ] && grep -q "DOWNLOAD_COMPLETE" "$TEMP_DIR/download_status"; then
        download_complete=true
      fi
      
      if [ -f "$temp_file" ]; then
        local current_size=$(stat -c %s "$temp_file" 2>/dev/null || stat -f %z "$temp_file" 2>/dev/null)
        display_progress "$current_size" "$FILE_SIZE"
        sleep 0.5
      fi
    done
    
    # Move temp file to final location
    mv "$temp_file" "$TEMP_DIR/$BACKUP_FILENAME"
    rm -f "$TEMP_DIR/download_status"
    
    # Print newline after progress bar
    echo "" >&2
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
  
  # Return the path to the dump file - we'll keep it as is since it's a PostgreSQL dump
  echo "$DUMP_FILE"
  return 0
}

# Function to find DDEV project directory - output only the path, no logging
find_ddev_project_dir() {
  log "Looking for DDEV project directory..."
  
  # First check for puppetplays-admin (from ddev describe output, this seems most likely)
  if [ -d "$ROOT_DIR/puppetplays-admin" ]; then
    log "Found DDEV project in puppetplays-admin directory"
    echo "$ROOT_DIR/puppetplays-admin"
    return 0
  fi
  
  # Then check if we have a .ddev directory in the root directory
  if [ -d "$ROOT_DIR/.ddev" ]; then
    log "Found DDEV project in root directory"
    echo "$ROOT_DIR"
    return 0
  fi
  
  # Check additional common locations
  for dir in "puppetplays" "puppetplays-web"; do
    if [ -d "$ROOT_DIR/$dir" ] && [ -d "$ROOT_DIR/$dir/.ddev" ]; then
      log "Found DDEV project in $dir directory"
      echo "$ROOT_DIR/$dir"
      return 0
    fi
  done
  
  log "ERROR: Could not find a DDEV project directory"
  return 1
}

# Function to check if Docker is running
check_docker_running() {
  log "Checking if Docker is running..."
  if ! docker info &>/dev/null; then
    log "ERROR: Docker is not running. Please start Docker and try again."
    return 1
  fi
  log "Docker is running."
  return 0
}

# Function to check if the puppetplays-admin container is running
check_container_running() {
  log "Checking if puppetplays-admin container is running..."
  
  # First, check if Docker is running at all
  if ! check_docker_running; then
    return 1
  fi
  
  # Method 1: check using docker ps
  if docker ps --format '{{.Names}}' | grep -q "puppetplays-admin" || docker ps --format '{{.Names}}' | grep -q "puppetplays"; then
    local container_name=$(docker ps --format '{{.Names}}' | grep -E 'puppetplays-admin|puppetplays' | head -1)
    log "Found running container: $container_name"
    return 0
  fi
  
  # Method 2: If the DDEV container naming might be different, try a more generic approach
  if docker ps | grep -E 'ddev.*db|puppetplays.*db|db.*puppetplays' >/dev/null 2>&1; then
    local container_name=$(docker ps | grep -E 'ddev.*db|puppetplays.*db|db.*puppetplays' | awk '{print $NF}' | head -1)
    log "Found running database container: $container_name"
    return 0
  fi
  
  log "ERROR: Could not find a running puppetplays-admin container or database container."
  log "Please start the containers with: cd $DDEV_PROJECT_DIR && ddev start"
  return 1
}

# Function to check if DDEV is installed and check database type
check_ddev_and_db() {
  if ! command -v ddev &> /dev/null; then
    log "ERROR: DDEV is not installed."
    return 1
  fi
  
  log "DDEV is installed."
  
  # Find the DDEV project directory
  local project_dir
  project_dir=$(find_ddev_project_dir)
  if [ $? -ne 0 ] || [ -z "$project_dir" ]; then
    log "ERROR: Could not find a DDEV project directory."
    return 1
  fi
  
  # Make sure the directory exists
  if [ ! -d "$project_dir" ]; then
    log "ERROR: The detected DDEV project directory does not exist: $project_dir"
    return 1
  fi
  
  # Save the project directory for later use
  export DDEV_PROJECT_DIR="$project_dir"
  
  # Check if .env exists in the project directory
  if [ -f "$DDEV_PROJECT_DIR/.env" ]; then
    # Check if DB_DRIVER is set to pgsql - improved extraction to handle quotes and whitespace
    DB_DRIVER=$(grep "DB_DRIVER" "$DDEV_PROJECT_DIR/.env" | cut -d= -f2 | tr -d ' "'\'' ')
    
    if [ "$DB_DRIVER" != "pgsql" ]; then
      log "ERROR: Database driver in $DDEV_PROJECT_DIR/.env is not set to PostgreSQL (pgsql)."
      log "The production database uses PostgreSQL but your local environment is configured to use $DB_DRIVER."
      log ""
      log "Please update your configuration manually by editing $DDEV_PROJECT_DIR/.env:"
      log "1. Change DB_DRIVER to 'pgsql'"
      log "2. Change DB_PORT to '5432'"
      log "3. Set DB_SCHEMA to 'public'"
      log ""
      log "Then restart DDEV with: cd $DDEV_PROJECT_DIR && ddev restart"
      return 1
    else
      log "Database driver is correctly set to PostgreSQL (pgsql)."
    fi
  else
    log "WARNING: No .env file found in $DDEV_PROJECT_DIR. Unable to check database type."
  fi
  
  # Check if Docker containers are running
  if ! check_container_running; then
    log "ERROR: Please start the DDEV project with: cd $DDEV_PROJECT_DIR && ddev start"
    return 1
  fi
  
  log "Found running DDEV project in $DDEV_PROJECT_DIR"
  return 0
}

# Function to import the database into DDEV
import_to_ddev() {
  local dump_file="$1"
  log "Importing database to DDEV environment..."
  
  # Detect database container
  local db_container=$(docker ps --format '{{.Names}}' | grep -E 'ddev.*db|puppetplays.*db|db.*puppetplays' | head -1)
  if [ -z "$db_container" ]; then
    log "ERROR: Could not find database container."
    return 1
  fi
  log "Using database container: $db_container"
  
  # Check if it's a PostgreSQL container
  if docker exec $db_container bash -c "command -v psql" &>/dev/null; then
    log "PostgreSQL database detected."
    
    # Import PostgreSQL dump directly
    log "Importing PostgreSQL dump file: $dump_file"
    
    # Drop and recreate the database - This will clean the database completely
    log "Dropping and recreating schema..."
    if ! docker exec $db_container bash -c "psql -U db -d db -c 'DROP SCHEMA IF EXISTS public CASCADE; CREATE SCHEMA public;'" &>/dev/null; then
      log "ERROR: Failed to drop and recreate database schema."
      return 1
    fi
    
    # Use pg_restore for PostgreSQL dump with additional options
    if docker exec $db_container bash -c "command -v pg_restore" &>/dev/null; then
      log "Using pg_restore to import the database..."
      
      # Add options:
      # -O/--no-owner: Don't try to match the original database owner
      # -x/--no-privileges: Don't restore access privileges (grant/revoke)
      # --no-comments: Don't restore comments
      # --clean: Clean (drop) database objects before recreating them
      # --if-exists: Use IF EXISTS when dropping objects
      log "This may take a few minutes and show some harmless errors..."
      if ! docker exec -i $db_container bash -c "pg_restore -O -x --no-comments --clean --if-exists -U db -d db 2>/dev/null" < "$dump_file"; then
        log "WARNING: pg_restore reported errors but this is normal. Continuing with import..."
      else
        log "Database import completed successfully."
      fi
      
      # Fix permissions to ensure the local 'db' user has access to everything
      log "Fixing permissions for local database user..."
      docker exec $db_container bash -c "psql -U db -d db -c 'GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO db;'"
      docker exec $db_container bash -c "psql -U db -d db -c 'GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO db;'"
      docker exec $db_container bash -c "psql -U db -d db -c 'GRANT ALL PRIVILEGES ON SCHEMA public TO db;'"
      
      # Verify that we have data in the database
      local table_count=$(docker exec $db_container bash -c "psql -U db -d db -t -c 'SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = '\''public'\'';'" | tr -d ' ')
      log "Verified database contains $table_count tables."
      
      if [ "$table_count" -gt 0 ]; then
        log "Database import was successful! You can now access your Craft CMS installation."
      else
        log "WARNING: Database appears to be empty after import. Please check for errors."
      fi
    else
      log "ERROR: pg_restore not found in database container."
      return 1
    fi
  else
    log "ERROR: PostgreSQL not found in database container."
    log "The production database uses PostgreSQL but your local environment is not configured correctly."
    log ""
    log "Please update your configuration manually by editing $DDEV_PROJECT_DIR/.env:"
    log "1. Change DB_DRIVER to 'pgsql'"
    log "2. Change DB_PORT to '5432'"
    log "3. Set DB_SCHEMA to 'public'"
    log ""
    log "Then restart DDEV with: cd $DDEV_PROJECT_DIR && ddev restart"
    return 1
  fi
  
  log "Database import completed successfully"
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
  
  if ! check_ddev_and_db; then
    log "ERROR: Cannot proceed without a properly configured DDEV project."
    exit 1
  fi
  
  # Download the latest backup
  DUMP_FILE=$(download_latest_backup)
  if [ $? -ne 0 ] || [ -z "$DUMP_FILE" ]; then
    log "ERROR: Failed to download and extract the latest backup."
    exit 1
  fi
  
  # Import the backup
  if ! import_to_ddev "$DUMP_FILE"; then
    log "ERROR: Failed to import database to DDEV environment."
    exit 1
  fi
  
  cleanup
  
  log "Database synchronization completed successfully!"
  log "Your local DDEV database now contains the production data from the latest backup."
}

# Execute the main function
main 