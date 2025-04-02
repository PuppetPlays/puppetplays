# Puppetplays Web Frontend

[![Next.js](https://img.shields.io/badge/Next.js-12.1.6-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18.1.0-blue)](https://reactjs.org/)
[![Jest](https://img.shields.io/badge/Jest-27.0.0-red)](https://jestjs.io/)
[![Cypress](https://img.shields.io/badge/Cypress-9.7.0-green)](https://www.cypress.io/)

This repository contains the public-facing website for the Puppetplays platform, built with Next.js. The site consumes data from a Craft CMS GraphQL API to display puppet theater works, authors, and animation techniques.

## 📋 Table of Contents

- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
- [Available Scripts](#-available-scripts)
- [Internationalization](#-internationalization)
- [Testing](#-testing)
- [Adding New Features](#-adding-new-features)
- [Deployment](#-deployment)
- [Best Practices](#-best-practices)

## 🛠 Tech Stack

The frontend is built with the following technologies:

- **Next.js (v12.1.6)**: React framework for server-rendered applications
- **React (v18.1.0)**: UI library
- **SWR (v0.3.9)**: React Hooks for data fetching
- **next-translate (v1.4.0)**: Internationalization library
- **SASS**: CSS preprocessor for styling components
- **OpenLayers (ol v6.5.0)**: For map visualizations
- **Jest & React Testing Library**: For unit and integration testing
- **Cypress (v9.7.0)**: For end-to-end testing

## 📂 Project Structure

The project follows a standard Next.js structure with some custom organization:

```
puppetplays-web/
├── components/            # Reusable UI components
│   ├── Author/            # Author-related components
│   ├── AnimationTechnique/# Animation technique components
│   ├── Work/              # Work-related components
│   ├── Home/              # Homepage components
│   └── Map/               # Map visualization components
├── pages/                 # Next.js pages and routes
│   ├── _app.js            # Custom App component
│   ├── index.js           # Homepage
│   ├── auteurs.js         # Authors listing page
│   ├── auteurs/           # Author details pages
│   ├── oeuvres/           # Work details pages
│   ├── techniques-d-animation.js   # Animation techniques listing
│   └── techniques-d-animation/     # Technique details pages
├── public/                # Static assets
├── styles/                # Global styles
├── lib/                   # Utility functions and API clients
├── hooks/                 # Custom React hooks
├── locales/               # Translation files
│   ├── en/                # English translations
│   └── fr/                # French translations
├── cypress/               # End-to-end tests
├── __mocks__/             # Jest mock files
├── server.js              # Custom Express server
├── next.config.js         # Next.js configuration
└── i18n.js                # Internationalization config
```

### Key Directories

- **components/**: Contains all React components used throughout the application, organized by feature or domain.
- **pages/**: Contains all routes for the application following Next.js routing conventions.
- **lib/**: Contains utility functions, API client code, and other helper functions.
- **locales/**: Contains JSON files for each supported language with translations.
- **hooks/**: Contains custom React hooks for shared logic across components.

## 🚀 Getting Started

### Prerequisites

- Node.js 22.14.0 or later
- Yarn package manager

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/PuppetPlays/puppetplays.git
   cd puppetplays/puppetplays-web
   ```

2. Install dependencies:
   ```bash
   yarn install
   ```

### Environment Variables

Create a `.env.local` file in the root directory by copying the provided `.env.example`:

```bash
cp .env.example .env.local
```

Adjust the values as needed:

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | **Required**. Craft CMS GraphQL API endpoint. Should be different from the Craft admin domain. | `http://puppetplays.ddev.site:7080` |
| `PORT` | Port for the Express server | `7000` |
| `NODE_ENV` | Node environment | `development` |
| `REACT_EDITOR` | Editor for error links (optional) | - |

> **Note**: The `NEXT_PUBLIC_API_URL` must point to your Craft CMS GraphQL API endpoint. It should be on a different domain than the Craft admin interface so that Craft can differentiate between them.

4. Start the development server:
   ```bash
   yarn run dev
   ```

5. Open [http://localhost:7000](http://localhost:7000) to view the application in your browser.

## 📜 Available Scripts

The project includes the following scripts in the `package.json`:

- **`yarn dev`**: Starts the development server with Express.
- **`yarn proxy-ssl`**: Creates an SSL proxy for local development.
- **`yarn start`**: Starts the Next.js production server.
- **`yarn build`**: Builds the application for production.
- **`yarn test`**: Runs Jest tests in watch mode.
- **`yarn test:ci`**: Runs Jest tests for CI environments with coverage.
- **`yarn cypress:open`**: Opens the Cypress test runner.
- **`yarn cypress:run`**: Runs Cypress tests in headless mode.
- **`yarn lint`**: Lints the codebase using ESLint.

## 🌐 Internationalization

The project supports multiple languages using `next-translate`. Configuration is defined in `i18n.js`.

Currently supported languages:
- French (fr) - Default
- English (en)

Translation files are stored in the `locales/` directory and are organized by language and namespace.

To add a new translation:
1. Add your translation key/value pair to the appropriate namespace file (e.g., `locales/en/common.json`).
2. Use the translation in your component:
   ```jsx
   import useTranslation from 'next-translate/useTranslation';

   function MyComponent() {
     const { t } = useTranslation('common');
     return <div>{t('your.translation.key')}</div>;
   }
   ```

## 🧪 Testing

The project uses two testing frameworks:

### Jest and React Testing Library

For unit and integration tests of components and utilities:

```bash
# Run tests in watch mode
yarn test

# Run tests for CI with coverage
yarn test:ci
```

Test files are typically co-located with the code they test and follow the naming conventions:
- `*.test.js` for Jest tests
- `*.spec.js` for specific component tests

### Cypress

For end-to-end testing:

```bash
# Open Cypress Test Runner
yarn cypress:open

# Run Cypress tests headlessly
yarn cypress:run
```

Cypress tests are located in the `cypress/integration/` directory.

## 🧩 Adding New Features

When adding new features to the application, follow these guidelines:

1. **Create necessary components** in the `components/` directory, organized by feature.
2. **Add translations** for any user-facing text in the appropriate locale files.
3. **Write tests** for your components and functionality.
4. **Update pages** to include your new components.
5. **Test thoroughly** using both Jest and Cypress to ensure quality.

## 📦 Deployment

The application is deployed using Docker. The `Dockerfile` in the root directory defines the build process.

Deployment is handled through CircleCI, which builds Docker images and deploys them to the appropriate environment based on the branch:
- `develop` branch is deployed to staging
- `master` branch is deployed to production

## 💡 Best Practices

Follow these best practices when working on the codebase:

### Code Style

- Use ESLint and Prettier for code formatting (configured in `.eslintrc.js` and `.prettierrc.json`).
- Follow React Hooks patterns for state management.
- Use functional components with hooks instead of class components.

### Component Structure

- Keep components small and focused on a single responsibility.
- Use CSS modules (`.module.scss` files) for component-scoped styling.
- Extract reusable logic into custom hooks in the `hooks/` directory.

### Data Fetching

- Use SWR for data fetching with proper caching and revalidation.
- Handle loading and error states for all data fetching operations.

```jsx
import useSWR from 'swr';
import { fetcher } from 'lib/api';

function MyComponent() {
  const { data, error } = useSWR('/api/endpoint', fetcher);
  
  if (error) return <div>Error loading data</div>;
  if (!data) return <div>Loading...</div>;
  
  return <div>{/* Render data */}</div>;
}
```

### Performance Optimization

- Use `React.memo()` for components that render often but with the same props.
- Use `useMemo()` and `useCallback()` for expensive computations and callback functions.
- Use Next.js Image component for optimized image loading.
- Implement dynamic imports for code splitting where appropriate.

### Accessibility

- Ensure all interactive elements are keyboard accessible.
- Use semantic HTML elements.
- Include proper ARIA attributes where necessary.
- Maintain sufficient color contrast.
- Test with screen readers.

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://reactjs.org/docs)
- [SWR Documentation](https://swr.vercel.app/)
- [next-translate Documentation](https://github.com/vinissimus/next-translate)