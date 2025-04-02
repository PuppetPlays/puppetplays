# Puppetplays Admin Interface

This component contains the administration interface for the Puppetplays platform, built with [Craft CMS](https://craftcms.com/).

## 📋 Table of Contents

- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Development](#development)
- [Deployment](#deployment)

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
- PostgreSQL or MySQL database
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

4. Install dependencies using DDEV (recommended):
   ```bash
   ddev composer install
   ```

5. Start the Craft CMS application:
   ```bash
   ddev start
   ```
   
6. Access the Craft CMS installation interface:
   - With DDEV: https://puppetplays.ddev.site:7443/admin

## Environment Variables

The Craft CMS configuration requires several environment variables to be set. These are defined in the `.env` file. Here's an explanation of the key variables:

| Variable | Description | Example |
|----------|-------------|---------|
| `ENVIRONMENT` | Current environment (dev, staging, production) | `dev` |
| `APP_ID` | Application ID for session storage | `CraftCMS` |
| `SECURITY_KEY` | Secret key for hashing and encryption | `random-string` |
| `DB_DRIVER` | Database driver (mysql or pgsql) | `mysql` |
| `DB_SERVER` | Database server hostname | `db` |
| `DB_PORT` | Database port | `3306` |
| `DB_DATABASE` | Database name | `db` |
| `DB_USER` | Database username | `db` |
| `DB_PASSWORD` | Database password | `your-password` |
| `CP_URL` | URL for the Craft control panel | `https://puppetplays.ddev.site:7443` |
| `SITE_URL` | URL for the frontend website | `http://localhost:7000` |
| `COOKIE_DOMAIN` | Domain for session cookies | `.puppetplays.ddev.site` |
| `EMAIL_HOSTNAME` | SMTP server hostname | `mailhog.example` |
| `EMAIL_PORT` | SMTP server port | `1025` |
| `EMAIL_SENDER` | Sender email address | `no-reply@puppetplays.eu` |

For a complete list of environment variables, refer to the `.env.example` file.

## Development

When developing locally with DDEV, the environment variables in `.env` are automatically loaded. Make sure to properly configure all environment variables before starting the application.

## Deployment

The application is deployed using Docker. Environment variables are passed to the container at runtime through the deployment configuration. 