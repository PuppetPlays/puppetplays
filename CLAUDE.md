# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

PuppetPlays is a multilingual platform for puppet theater research, consisting of three main components:
- **puppetplays-web**: Next.js frontend (React) consuming GraphQL API
- **puppetplays-admin**: Craft CMS backend providing content management and GraphQL API
- **puppetplays-deploy**: Docker deployment configurations

## Development Commands

### Frontend Development (puppetplays-web)
```bash
cd puppetplays-web
yarn install                # Install dependencies
yarn dev                    # Start dev server (port 7000)
yarn test                   # Run Jest tests in watch mode
yarn test:no-watch          # Run tests once
yarn cypress                # Open Cypress test runner
yarn lint                   # Run ESLint
yarn format                 # Format code with Prettier
yarn build                  # Build for production
```

### Backend Development (puppetplays-admin)
```bash
cd puppetplays-admin
ddev start                  # Start DDEV environment
ddev composer install       # Install PHP dependencies
ddev craft migrate/all      # Run database migrations
ddev craft project-config/apply  # Apply project config
```

### Deployment
```bash
cd puppetplays-deploy
./deploy.sh staging         # Deploy to staging
./deploy.sh production      # Deploy to production
```

## Architecture & Patterns

### Frontend Architecture (Next.js)
- **Pages Router**: Uses Next.js pages router (not app router)
- **Data Fetching**: SWR for client-side fetching with GraphQL
- **Internationalization**: next-i18next with fr/en locales
- **Styling**: SCSS modules for component-scoped styles
- **State Management**: React hooks and context
- **API Communication**: GraphQL queries to Craft CMS backend

### Backend Architecture (Craft CMS)
- **CMS**: Craft CMS 4.x with custom modules
- **API**: GraphQL endpoint at `/graphql`
- **Database**: PostgreSQL in production, MySQL in development
- **Content Types**: Works, Authors, Places, Characters, Animation Techniques
- **Migrations**: Database migrations in `migrations/` directory

### Key Files & Directories
- **API Client**: `puppetplays-web/lib/api.js` - GraphQL client and query fragments
- **Filters**: `puppetplays-web/lib/filters.js` - Filter state management
- **Components**: `puppetplays-web/components/` - Organized by feature (Work/, Author/, etc.)
- **Translations**: `puppetplays-web/public/locales/` - i18n JSON files
- **Craft Config**: `puppetplays-admin/config/` - Craft CMS configuration
- **Entry Types**: `puppetplays-admin/config/project/entryTypes/` - Content type definitions

## Environment Configuration

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://puppetplays.ddev.site:7080  # GraphQL endpoint
PORT=7000                                                # Dev server port
NODE_ENV=development
```

### Backend (.env)
```
ENVIRONMENT=dev
DB_DRIVER=mysql
DB_SERVER=db
DB_PORT=3306
DB_DATABASE=db
DB_USER=db
DB_PASSWORD=db
SECURITY_KEY=[generated]
CP_URL=https://puppetplays.ddev.site:7443/admin
SITE_URL=http://localhost:7000
```

## Testing Strategy
- **Unit Tests**: Jest + React Testing Library for components
- **E2E Tests**: Cypress for user flows
- **Test Files**: Co-located with components (*.test.js, *.spec.js)

## Important Patterns

### GraphQL Queries
- Queries are built dynamically based on filter state
- Fragment reuse for common data structures (placeInfo, authorInfo)
- Variables passed for pagination and filtering

### Component Structure
- Functional components with hooks
- Component-specific subdirectories for complex features
- Separate modal/note components for detailed views

### Data Flow
1. User interaction triggers filter/search change
2. State updates trigger new GraphQL query via SWR
3. Data flows down through props to display components
4. Modals/details fetch additional data on demand

## Common Tasks

### Adding a New Page
1. Create page file in `puppetplays-web/pages/`
2. Add translations in `puppetplays-web/public/locales/`
3. Update navigation if needed in `components/MainNav.js`

### Adding a New Component
1. Create component in appropriate `components/` subdirectory
2. Add SCSS module file alongside component
3. Write tests in same directory
4. Use translations via `useTranslation` hook

### Modifying Content Types
1. Update in Craft CMS admin interface
2. Export project config: `ddev craft project-config/write`
3. Commit changes in `puppetplays-admin/config/project/`

### Database Sync
```bash
cd puppetplays-deploy/scripts
./sync-db.sh  # Pull production database to local DDEV
```

## Troubleshooting

### CORS Issues
- HAL/Nakala resources use proxy routes defined in `pages/api/`
- Check `next.config.js` for CORS headers configuration

### GraphQL Errors
- Check `puppetplays-web/lib/api.js` for query construction
- Verify Craft CMS GraphQL schema permissions
- Check browser console for detailed error messages

### Translation Missing
- Run `yarn run scripts/check-translations.sh` to audit
- Add missing keys to locale JSON files
- Verify namespace configuration in components