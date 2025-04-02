# Installation and Configuration Guide for Puppetplays

This document provides detailed instructions for installing and configuring the different components of the Puppetplays platform.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Frontend Configuration (puppetplays-web)](#frontend-configuration-puppetplays-web)
- [Admin Configuration (puppetplays-admin)](#admin-configuration-puppetplays-admin)
- [Complete Development Configuration](#complete-development-configuration)
- [Common Troubleshooting](#common-troubleshooting)

## Prerequisites

### Required Tools

- **Git**: For cloning the repository
- **Node.js 22.14.0+**: For frontend development
- **Yarn**: Package manager for the frontend
- **DDEV**: For the admin local environment (Docker-based)
- **Docker & Docker Compose**: For deployment and container execution

### Installing Prerequisites

**Node.js and Yarn**:

```bash
# For macOS with Homebrew
brew install node@22 yarn

# For Ubuntu/Debian
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt-get install -y nodejs
npm install -g yarn
```

**DDEV**:

```bash
# For macOS with Homebrew
brew tap drud/ddev
brew install ddev

# For other systems, see: https://ddev.readthedocs.io/en/stable/
```

## Frontend Configuration (puppetplays-web)

### 1. Clone the Repository and Access the Frontend Folder

```bash
git clone https://github.com/PuppetPlays/puppetplays
cd puppetplays/puppetplays-web
```

### 2. Install Dependencies

```bash
yarn install
```

### 3. Environment Configuration

Create a `.env.local` file at the root of the `puppetplays-web` folder with the following content:

```
NEXT_PUBLIC_API_URL=http://puppetplays.ddev.site:7080
```

This variable points to the Craft CMS GraphQL API that will be launched with DDEV.

### 4. Start the Development Server

```bash
yarn run dev
```

The site should now be accessible at [http://localhost:7000](http://localhost:7000).

## Admin Configuration (puppetplays-admin)

### 1. Access the Admin Folder

```bash
cd puppetplays/puppetplays-admin
```

### 2. Environment Configuration

Create a `.env` file at the root of the `puppetplays-admin` folder by copying the `.env.example` file:

```bash
cp .env.example .env
```

The default values should work for a DDEV environment. If needed, you can modify the variables according to your configuration.

### 3. Install Dependencies and Start DDEV

```bash
ddev composer install
ddev start
```

### 4. Access the Craft CMS Installation Interface

Open a browser and go to [https://puppetplays.ddev.site:7443/admin](https://puppetplays.ddev.site:7443/admin) to start the Craft CMS installation.

Follow the installation steps:
1. Create an administrator account
2. Configure the site
3. Complete the installation

### 5. Migrate the database

```bash
ddev craft migrate
```

## Complete Development Configuration

For a complete development environment, you need to have both components (frontend and admin) running simultaneously:

1. **Admin Craft CMS**:
```bash
cd puppetplays-admin
ddev start
```

2. **Frontend NextJS**:
```bash
cd puppetplays-web
yarn run dev
```

This will allow you to develop the frontend while having access to the data provided by the Craft CMS API.

## Common Troubleshooting

### Craft API Not Accessible from Frontend

1. Check that DDEV is properly started:
```bash
ddev status
```

2. Check that the API URL in `.env.local` matches your DDEV configuration:
```
NEXT_PUBLIC_API_URL=http://puppetplays.ddev.site:7080
```

3. Make sure DDEV domains are correctly configured in your hosts file:
```bash
ddev hostname --add-hosts
```

### Dependency Errors in Frontend

If you encounter dependency errors in the frontend, try:

```bash
yarn cache clean
rm -rf node_modules
yarn install
```

### Issues with DDEV

If you encounter issues with DDEV:

```bash
ddev poweroff
ddev start
```

For more information on troubleshooting DDEV, see the [official documentation](https://ddev.readthedocs.io/en/stable/users/troubleshooting/).

## Additional Resources

- [Official NextJS Documentation](https://nextjs.org/docs)
- [Official Craft CMS Documentation](https://craftcms.com/docs/3.x/)
- [DDEV Documentation](https://ddev.readthedocs.io/en/stable/) 