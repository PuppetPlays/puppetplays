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
- `ppdeploy`, the tool that builds, verifies and deploys from a local machine
- Server scripts that `ppdeploy` installs on the VM
- Database backup scripts
- Nginx configuration

CircleCI runs the tests and builds images, but does not deploy.
There is no staging server: `ppdeploy verify` checks a release against a local copy of production.

## Prerequisites

- Docker with `docker compose`, `jq`, `sshpass` (`brew install hudochenkov/sshpass/sshpass`)
- The VPN: the server accepts SSH only from allowlisted IPs
- A personal account on the server with sudo (`mbernet` today)

## Directory Structure

```
puppetplays-deploy/
├── ppdeploy               # local CLI: build, verify, ship, deploy, rollback
├── docker-compose.yml     # services; image tags come from ADMIN_VERSION and WEB_VERSION
├── server/                # scripts installed in /root/puppetplays-deploy on the VM
│   ├── lib.sh             # shared helpers, secrets check
│   ├── prepare.sh         # records the running release, .env from the containers, DB dump
│   ├── deploy.sh          # recreates containers, runs `craft up`
│   ├── rollback.sh        # previous release, optional DB restore
│   ├── smoke.sh           # pages, admin login and API through nginx
│   └── check.sh           # certificate, assets, CORS, outbound access
├── replica/               # local copy of production for `ppdeploy verify`
│   ├── compose.yml
│   └── queries/           # GraphQL queries compared with production
├── nginx/                 # Nginx configuration files
└── scripts/               # db-backup.sh and its cron file
```

## Deployment Process

```bash
cd puppetplays-deploy
./ppdeploy login                 # once: stores the SSH/sudo password in the macOS keychain
./ppdeploy status                # what runs now
./ppdeploy build admin           # images are tagged with the HEAD commit (clean tree required)
./ppdeploy verify                # optional: fresh prod dump in a local replica, `craft up`,
                                 # GraphQL answers compared with production
./ppdeploy ship admin            # copies the image over SSH
./ppdeploy deploy --web current --dry-run
./ppdeploy deploy --web current  # dump, recreate, `craft up`, smoke test
```

`deploy` takes `--admin TAG|current` and `--web TAG|current` (default: HEAD for both).
Before it changes anything it checks that the secrets compose resolves are the same as in the running containers.

If the smoke test fails:

```bash
./ppdeploy rollback              # previous images
./ppdeploy rollback --restore-db # also restores the pre-deploy dump: needed after Craft
                                 # migrations, loses content edited since the deploy
```

Notes:
- The production `.env` lives only on the server (`/root/puppetplays-deploy/.env`, root only).
  `prepare.sh` rebuilds it from the running containers on every deploy. Its values are literal
  and single-quoted because two secrets start with `$`.
- The web build renders static pages from the public API, so `build web` needs
  `https://api.puppetplays.eu` to answer.
- Craft answers 503 until `craft up` runs. Migrations that change project config must be run
  first with `allowAdminChanges` enabled (dev or staging environment) and the YAML committed.

## Database Backups

The `scripts/db-backup.sh` script handles automatic database backups. On the server it runs from cron:

```bash
install -m 0700 scripts/db-backup.sh /usr/local/sbin/puppetplays-db-backup
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