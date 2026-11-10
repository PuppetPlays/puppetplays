# Puppetplays Deployment

This component contains the deployment scripts and configurations for the Puppetplays platform.

## 📋 Table of Contents

- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Directory Structure](#directory-structure)
- [Deployment Process](#deployment-process)
- [Database Backups](#database-backups)
- [Server Configuration](#server-configuration)

## Overview

The deployment component provides:
- Docker Compose configuration for running the platform
- Deployment scripts for CI/CD
- Database backup scripts
- Nginx configuration

## Prerequisites

- Docker and Docker Compose
- Access to the target server via SSH

## Directory Structure

```
puppetplays-deploy/
├── docker-compose.yml     # Docker Compose configuration
├── deploy.sh              # Main deployment script
├── nginx/                 # Nginx configuration files
│   ├── admin.conf         # Admin site configuration
│   ├── admin.staging.conf # Admin site configuration for staging
│   ├── web.conf           # Web frontend configuration
│   └── conf/              # Shared configurations
└── scripts/               # Utility scripts
    └── db-backup.sh       # Database backup script
```

## Deployment Process

The deployment process is handled by CircleCI, which builds Docker images and deploys them to the appropriate environment based on the branch:
- `develop` branch deploys to staging
- `master` branch deploys to production

### Manual Deployment

1. SSH into the server

2. Copy the deployment files to the server:
   ```bash
   scp -r puppetplays-deploy user@server:/path/to/deploy
   ```

3. Run the deployment script:
   ```bash
   ./deploy.sh
   ```

## Database Backups

The `scripts/db-backup.sh` script handles automatic database backups. On the server it runs from cron:

```bash
install -m 0755 scripts/db-backup.sh /usr/local/sbin/puppetplays-db-backup
install -m 0644 scripts/puppetplays-db-backup.cron /etc/cron.d/puppetplays-db-backup
```

The cron file name must not contain a dot: cron ignores files in `/etc/cron.d` whose name has one.
Output goes to `/var/log/puppetplays-db-backup.log`.

Backups are stored in `${PUPPETPLAYS_HOST_DIR}/database/postgres-backups/{daily,weekly,monthly}/`
and kept for 7 days, 3 weeks and 1 year.

## Server Configuration

Server Nginx configuration files are provided in the `nginx/` directory. These should be:
1. Copied to `/etc/nginx/sites-available/`
2. Symlinked to `/etc/nginx/sites-enabled/`
3. Verified with `nginx -t`
4. Applied with `systemctl reload nginx`

For detailed server configuration information, refer to the [Server Configuration Documentation](../puppetplays-docs/3-Configuration-serveur.md). 