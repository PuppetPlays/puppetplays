import { render, screen } from '@testing-library/react';
import { useRouter } from 'next/router';

import WorkPageHeader from './WorkPageHeader';

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));
const push = jest.fn();
useRouter.mockImplementation(() => ({
  push,
  pathname: '/',
  route: '/',
  asPath: '/',
  query: '',
}));

// Mock pour next-i18next
jest.mock('next-i18next', () => ({
  useTranslation: () => ({
    t: key => {
      const translations = {
        'common:note': 'Note',
        'common:contentNotAvailable': 'Contenu non disponible',
      };
      return translations[key] || key;
    },
    i18n: {
      changeLanguage: jest.fn(),
    },
  }),
}));

const authors = [
  { id: '1', firstName: 'Raymond', lastName: 'Poisson', typeHandle: 'persons' },
  { id: '2', firstName: 'Claude', lastName: 'Garbut', typeHandle: 'persons' },
];

const place = [
  {
    title: 'Paris',
    country: [{ title: 'France' }],
  },
];

test('renders the work page header', () => {
  render(
    <WorkPageHeader
      id="100"
      slug="my-work"
      title="My work"
      authors={authors}
      compositionPlace={place}
    />,
  );

  const backButton = screen.getByRole('button');
  const content = screen.getByTestId('work-page-header-content');

  expect(backButton).toBeInTheDocument();
  expect(content).toHaveTextContent(
    'My work - Raymond Poisson, Claude Garbut - Paris, France',
  );
});

test('renders the work page header without a writing place', () => {
  render(
    <WorkPageHeader
      id="101"
      slug="my-work"
      title="My work"
      authors={authors}
    />,
  );

  const backButton = screen.getByRole('button');
  const content = screen.getByTestId('work-page-header-content');

  expect(backButton).toBeInTheDocument();
  expect(content).toHaveTextContent('My work - Raymond Poisson, Claude Garbut');
});
