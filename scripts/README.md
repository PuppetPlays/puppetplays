# PuppetPlays Database Sync Tool

This tool allows you to synchronize the production database with your local development environment. It downloads the latest database backup from the production server and imports it into your local Craft CMS installation.

## Important Prerequisites

- **SSH access to the production server** (does not require root access)
- Working DDEV installation with the project set up and running
- Local Craft CMS installation properly configured
- `sshpass` (installed automatically by the script if possible)

## Setup and Configuration

1. Make sure your local Craft CMS environment is properly set up and running with DDEV:
   - Refer to [Setup Documentation](../puppetplays-docs/1-Setup.md) for details on setting up the local environment
   - Ensure DDEV is running with `ddev start` in your project directory before running this script

2. Copy the environment example file and configure it:
   ```bash
   cp .env.example .env
   ```

3. Edit the `.env` file and add your SSH credentials for the production server:
   ```
   PROD_USER=your_username
   PROD_PASSWORD=your_password
   ```

4. Make the sync script executable:
   ```bash
   chmod +x sync-production-db.sh
   ```

## Usage

Run the script from the scripts directory:

```bash
cd scripts
./sync-production-db.sh
```

The script will:

1. Connect to the production server via SSH
2. Find the latest database backup in `/var/lib/puppetplays/database/postgres-backups/daily`
3. Download the backup file to your local machine
4. Extract the backup file
5. Automatically detect your DDEV project location
6. Import the database into your DDEV environment
7. Clean up temporary files

## Smart DDEV Project Detection

The script automatically searches for your DDEV project by:
1. Looking for `.ddev` directories in common locations
2. Finding your project even if it's in a subdirectory
3. Automatically using the correct directory for DDEV commands

## Error Handling

The script includes various checks to ensure everything is properly set up:

- Verifies SSH connection to the production server
- Automatically locates and confirms your DDEV installation is running
- Validates all required environment variables are set

If any issues are detected, the script will display an error message explaining what went wrong and how to fix it.

## Security Notes

- Store your `.env` file securely and do not commit it to version control
- Consider using SSH keys instead of password authentication for better security
- The script does not store or log any sensitive information 