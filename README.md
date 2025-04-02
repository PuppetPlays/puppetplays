# Puppetplays Platform

## 📋 Description

Puppetplays is a platform dedicated to the collection, preservation, and presentation of works related to puppet theater. The platform offers public access to a repository of works, authors, and animation techniques, as well as an administration interface to manage this content.

## 🏗️ Project Architecture

The project is organized into three main components:

```
puppetplays/
├── puppetplays-web/       # Public website frontend (NextJS)
├── puppetplays-admin/     # Administration interface (Craft CMS)
└── puppetplays-deploy/    # Deployment scripts and configurations
```

### Main Components

1. **Public Website** (`puppetplays-web`):
   - Built with NextJS (React)
   - Retrieves data via the GraphQL API provided by Craft CMS
   - Multilingual interface (2 languages supported)
   - [See frontend README](./puppetplays-web/README.md)

2. **Admin Interface** (`puppetplays-admin`):
   - Based on Craft CMS
   - Provides a GraphQL API for the frontend
   - Manages all platform content
   - [See custom module README](./puppetplays-admin/README.md)

3. **Deployment** (`puppetplays-deploy`):
   - Contains Docker scripts and configurations
   - Manages deployments to staging and production environments
   - [See deployment README](./puppetplays-deploy/README.md)

## 🚀 Development Workflow

The development workflow follows these steps:

1. **Local Development**:
   - Setting up local environments (see [SETUP.md](./SETUP.md))
   - Development and local testing

2. **Continuous Integration**:
   - Using CircleCI for automated tests
   - Building Docker images for each commit

3. **Deployment**:
   - Deploying `develop` branches to the staging environment
   - Deploying `master` branches to the production environment
   - Orchestrated via CircleCI

## 🔧 Installation and Configuration

For detailed documentation on installation and configuration, please see [SETUP.md](./SETUP.md).

In summary:

1. **Prerequisites**:
   - Node.js 14.17.0+ and Yarn for the frontend
   - DDEV (Docker-based) for the local admin environment
   - Docker for deployment

2. **Frontend Configuration**:
   ```bash
   cd puppetplays-web
   yarn install
   # Configure .env.local
   yarn run dev
   ```

3. **Admin Configuration**:
   ```bash
   cd puppetplays-admin
   # Configure .env
   ddev composer install
   ddev start
   # Access https://puppetplays.ddev.site:7443/admin
   ```

## 🌐 Environment Variables

The project uses environment variables for configuration across all components. Each component has its own `.env.example` file as a template:

### Frontend Environment Variables
Key variables for the frontend (`puppetplays-web/.env.example`):
- `NEXT_PUBLIC_API_URL`: URL for the GraphQL API (e.g., `http://puppetplays.ddev.site:7080`)
- `PORT`: Express server port (default: 7000)
- `NODE_ENV`: Node environment (development, production)

### Admin Environment Variables
Key variables for the admin (`puppetplays-admin/.env.example`):
- `ENVIRONMENT`: Current environment (dev, staging, production)
- `DB_DRIVER`, `DB_SERVER`, `DB_USER`, etc.: Database configuration
- `SECURITY_KEY`: Secret key for Craft CMS security
- `CP_URL`: URL for the Craft control panel
- `SITE_URL`: URL for the frontend website

### Deployment Environment Variables
Key variables for deployment (`puppetplays-deploy/.env.example`):
- `POSTGRES_PASSWORD`, `POSTGRES_USER`, `POSTGRES_DB`: Database configuration
- `PUPPETPLAYS_VERSION`: Version tag for Docker images
- `PUPPETPLAYS_HOST_DIR`: Host directory for data storage
- `SITE_URL`, `CP_URL`, `NEXT_PUBLIC_API_URL`: Component URLs

For complete information on environment variables for each component, refer to the respective README files and `.env.example` templates.

## 📚 Detailed Documentation

For more details, consult the following documents:

- [SETUP](./puppetplays-docs/1-SETUP.md)
- [Development Guide](./puppetplays-docs/2-Développement.md)
- [Server Configuration](./puppetplays-docs/3-Configuration-serveur.md)
- [Deployment](./puppetplays-docs/4-Déploiement.md)

## 🔄 CI/CD

The project uses CircleCI for continuous integration and continuous deployment. For each commit:

1. Tests are executed
2. Code is built
3. Docker images are generated
4. Code can be manually deployed from the CircleCI interface

## 📱 Main Features

- Works repository with advanced filters (language, location, period, etc.)
- Database of authors and animation techniques
- Visualization of works on a map
- Full-text search
- Multilingual interface
- Complete content management via Craft CMS admin

## 🧪 Tests

```bash
# Frontend tests
cd puppetplays-web
yarn run test
```

## 📝 Versions

See [CHANGELOG.md](./CHANGELOG.md) for version history and features.

## 📄 License

See [LICENSE.md](./LICENSE.md) for more information.