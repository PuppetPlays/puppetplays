# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

PuppetPlays is a multilingual platform for puppet theater research, consisting of three main components:
- **puppetplays-web**: Next.js 15 frontend (React 19) consuming GraphQL API
- **puppetplays-admin**: Craft CMS 4.x backend providing content management and GraphQL API
- **puppetplays-deploy**: Docker deployment configurations

## Development Commands

### Frontend (puppetplays-web)
```bash
cd puppetplays-web
yarn install                # Install dependencies
yarn dev                    # Start dev server (port 7000)
yarn build                  # Build for production
yarn lint                   # Run ESLint
yarn lint:fix               # Fix ESLint issues
yarn format                 # Format with Prettier
yarn format:check           # Check formatting

# Testing
yarn test                   # Jest in watch mode
yarn test:no-watch          # Jest single run
yarn test:ci                # Jest with coverage for CI
yarn cypress                # Open Cypress runner
yarn cypress:run            # Headless Cypress
```

### Backend (puppetplays-admin)
```bash
cd puppetplays-admin
ddev start                           # Start DDEV environment
ddev composer install                # Install PHP dependencies
ddev exec php craft migrate/all      # Run migrations
ddev craft project-config/apply      # Apply project config
ddev craft project-config/write      # Export project config
```

### Deployment
```bash
cd puppetplays-deploy
./deploy.sh staging         # Deploy to staging
./deploy.sh production      # Deploy to production
```

## Architecture

### Frontend (Next.js Pages Router)

**Data Flow Pattern:**
1. User interaction triggers filter/search state change
2. State updates trigger GraphQL query via SWR
3. `lib/api.js` builds dynamic queries using filter state from `lib/filters.js`
4. Data flows through props to display components
5. Modals/detail views fetch additional data on demand

**Key Files:**
- `lib/api.js` - GraphQL client, query builders, and fragment definitions
- `lib/filters.js` - Filter state management and GraphQL query argument builders
- `lib/nakala.js` - Nakala video archive integration
- `hooks/useHalMetadata.js` - HAL archive metadata fetching with retry logic
- `hooks/useErrorHandler.js` - Centralized error handling with classification

**Filter System:**
The filter system transforms URL query params → filter state → GraphQL variables:
- `worksQueryParamsToState()` - Parse URL params
- `worksStateToGraphqlVariables()` - Transform to GraphQL variables
- `worksStateToGraphqlEntriesParams()` - Build query parameters

**Internationalization:**
- Uses next-i18next with fr/en locales
- Translations in `public/locales/{lang}/{namespace}.json`
- Use `useTranslation(namespace)` hook in components

### Backend (Craft CMS)

**GraphQL API:** Available at `/graphql`

**Content Types:**
- Works (works_works_Entry)
- Authors/Persons (persons_persons_Entry, persons_companies_Entry)
- Animation Techniques (animationTechniques_animationTechniques_Entry)
- Places/Countries
- Scientific Publications
- Educational Resources
- Discovery Paths

**Database:** PostgreSQL in production, MySQL in DDEV development

## Environment Configuration

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://puppetplays.ddev.site:7080
PORT=7000
NODE_ENV=development
```

### Backend (.env)
```
ENVIRONMENT=dev
DB_DRIVER=mysql
DB_SERVER=db
DB_DATABASE=db
DB_USER=db
DB_PASSWORD=db
SECURITY_KEY=[generated]
CP_URL=https://puppetplays.ddev.site:7443/admin
SITE_URL=http://localhost:7000
```

## Common Tasks

### Adding GraphQL Fields
1. Add field in Craft CMS admin
2. Export: `ddev craft project-config/write`
3. Update queries in `lib/api.js` using fragment pattern
4. Commit `puppetplays-admin/config/project/` changes

### Adding Filters
1. Add to `worksAllowedFilters` or `authorsAllowedFilters` in `lib/filters.js`
2. Add query param mapper in `worksQueryParamsToState`
3. Update query builder in `lib/api.js` if needed

### Running Single Test
```bash
cd puppetplays-web
yarn test -- --testPathPattern="ComponentName"
```

### Database Sync (Production → Local)
```bash
cd puppetplays-deploy/scripts
./sync-db.sh
```

After sync, if login fails:
```bash
ddev exec php craft users/create --admin --email=you@example.com --username=admin
```

## Troubleshooting

### CORS Issues
- HAL/Nakala resources use proxy routes in `pages/api/`
- Check `next.config.js` for headers configuration

### GraphQL Errors
- Check query construction in `lib/api.js`
- API logs query details to console with full request/response
- Verify schema permissions in Craft CMS admin

### Translation Missing
- Add missing keys to `public/locales/{lang}/{namespace}.json`
- Verify namespace in component's `useTranslation(namespace)` call
