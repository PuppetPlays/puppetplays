# Puppetplays Admin Interface

This component contains the administration interface for the Puppetplays platform, built with [Craft CMS](https://craftcms.com/).

## 📋 Table of Contents

- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Development](#development)
- [Deployment](#deployment)
- [Database Synchronization](#database-synchronization)
- [Known Issues](#known-issues)

## Overview

The admin interface enables content management for the Puppetplays platform, including:
- Work catalog management
- Author management
- Animation technique documentation
- Media management
- User and permission management

It also provides a GraphQL API that is consumed by the frontend.

## Prerequisites

- PHP 7.4+
- Composer
- PostgreSQL database
- [DDEV](https://ddev.readthedocs.io/en/stable/) (recommended for local development)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/puppetplays.git
   cd puppetplays/puppetplays-admin
   ```

2. Copy the environment file:
   ```bash
   cp .env.example .env
   ```

3. Configure environment variables in the `.env` file (see [Environment Variables](#environment-variables) section)

4. Configure DDEV to use PostgreSQL:
   ```bash
   ddev config --database=postgres:13 --project-type=craftcms --docroot=web
   ```

5. Install dependencies using DDEV (recommended):
   ```bash
   ddev composer install
   ```

6. Start the Craft CMS application:
   ```bash
   ddev start
   ```
   
7. Access the Craft CMS installation interface:
   - With DDEV: https://puppetplays.ddev.site:7443/admin

## Environment Variables

The Craft CMS configuration requires several environment variables to be set. These are defined in the `.env` file. Here's an explanation of the key variables:

| Variable | Description | Example |
|----------|-------------|---------|
| `ENVIRONMENT` | Current environment (dev, staging, production) | `dev` |
| `APP_ID` | Application ID for session storage | `CraftCMS` |
| `SECURITY_KEY` | Secret key for hashing and encryption | `random-string` |
| `DB_DRIVER` | Database driver (required: pgsql) | `pgsql` |
| `DB_SERVER` | Database server hostname | `db` |
| `DB_PORT` | Database port | `5432` |
| `DB_DATABASE` | Database name | `db` |
| `DB_USER` | Database username | `db` |
| `DB_PASSWORD` | Database password | `your-password` |
| `DB_SCHEMA` | Database schema (PostgreSQL only) | `public` |
| `CP_URL` | URL for the Craft control panel | `https://puppetplays.ddev.site:7443` |
| `SITE_URL` | URL for the frontend website | `http://localhost:7000` |
| `COOKIE_DOMAIN` | Domain for session cookies | `.puppetplays.ddev.site` |
| `EMAIL_HOSTNAME` | SMTP server hostname | `mailhog.example` |
| `EMAIL_PORT` | SMTP server port | `1025` |
| `EMAIL_SENDER` | Sender email address | `no-reply@puppetplays.eu` |

For a complete list of environment variables, refer to the `.env.example` file.

## Development

When developing locally with DDEV, the environment variables in `.env` are automatically loaded. Make sure to properly configure all environment variables before starting the application.

**Important**: The project requires PostgreSQL as the database driver to match the production environment. MySQL is not supported.

### Migrations

The project includes PHP migration scripts in the `migrations` directory. These migrations are written to be database-agnostic and should work with PostgreSQL. However, if you encounter any issues with specific SQL syntax, you may need to modify the migration files for PostgreSQL compatibility.

To run migrations:
```bash
ddev exec php craft migrate/all
```

## Deployment

The application is deployed using Docker. Environment variables are passed to the container at runtime through the deployment configuration.

## Database Synchronization

To work with production data in your local environment, a database synchronization script is available in the `scripts` directory. This script downloads the latest database backup from the production server and imports it into your local PostgreSQL database.

1. Navigate to the scripts directory:
   ```bash
   cd ../scripts
   ```

2. Configure the synchronization script:
   ```bash
   cp .env.example .env
   # Edit .env with your production server credentials
   ```

3. Run the synchronization script:
   ```bash
   ./sync-production-db.sh
   ```

This will download the latest PostgreSQL backup from the production server and import it into your local DDEV environment.

⚠️ **Warning**: After synchronizing the database from production, you may encounter issues logging into your local Craft CMS admin. This is because user sessions and passwords from production may not work in your local environment. If you can't log in after synchronization, you can reset your admin access using one of these methods:

1. Create a new admin user:
   ```bash
   ddev exec php craft users/create --admin --email=your@email.com --username=newadmin
   ```

2. Reset an existing user's password:
   ```bash
   ddev exec php craft users/set-password admin your-new-password
   ```

3. As a last resort, you can reinstall Craft CMS while preserving your synced content:
   ```bash
   ddev exec php craft install/craft --username=admin --password=password --email=admin@example.com --siteName="Puppetplays" --siteUrl="$CP_URL"
   ```

## Known Issues

1. **Login Issues After Database Sync**: After synchronizing the database from production, you may not be able to log in to the Craft CMS admin panel with your local credentials. See the workarounds in the [Database Synchronization](#database-synchronization) section.

2. **Migration Compatibility**: While the PHP migration scripts should generally work with PostgreSQL, some MySQL-specific syntax might cause issues. If you encounter errors when running migrations, check the SQL statements for database-specific syntax. 