# Database Synchronization for Staging Environment

This script automates the synchronization of the production database to the staging environment during the CI/CD deployment process.

## How It Works

During the staging deployment process, the `sync-db.sh` script will:

1. Connect to the production server
2. Download the latest database backup
3. Import it into the staging PostgreSQL container
4. Fix permissions and ensure data integrity

## Required Environment Variables

The following environment variables must be set in CircleCI:

- `PROD_DB_USER`: SSH username for the production server
- `PROD_DB_PASSWORD`: SSH password for the production server 
- `POSTGRES_PASSWORD_STAGING`: Password for the staging database

## Setup Instructions

### 1. Set Up CircleCI Environment Variables

In the CircleCI project settings, add the following environment variables:

- `PROD_DB_USER`: Your production server username
- `PROD_DB_PASSWORD`: Your production server password 

### 2. Deploy to Staging

The database sync will automatically run as part of the staging deployment process.

## Troubleshooting

### SSH Connection Issues

If you encounter SSH connection issues, verify:
- The production server is accessible from the CI/CD environment
- The credentials are correct
- The SSH port is open and available

### Database Import Failures

If the database import fails:
- Check the CircleCI logs for specific error messages
- Verify the database backup format is compatible
- Ensure the staging database has enough disk space

## Manual Execution

To run the database sync manually on the staging server:

```bash
cd /path/to/puppetplays-deploy
export PROD_SERVER=cchum-kvm-puppetplays.huma-num.fr
export PROD_USER=your_username
export PROD_PASSWORD=your_password
export POSTGRES_USER=puppetplays
export POSTGRES_DB=puppetplays
export POSTGRES_PASSWORD=your_staging_db_password
./scripts/sync-db.sh
``` 