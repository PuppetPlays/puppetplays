import { render, screen } from '@testing-library/react';
import { useRouter } from 'next/router';

import WorkPageHeader from './WorkPageHeader';

// Mock process.env.NEXT_PUBLIC_API_URL
process.env.NEXT_PUBLIC_API_URL = 'http://localhost:8080';

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
  locale: 'fr',
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

  const buttons = screen.getAllByRole('button');
  const backButton = buttons[0]; // First button is the back button
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

  const buttons = screen.getAllByRole('button');
  const backButton = buttons[0]; // First button is the back button
  const content = screen.getByTestId('work-page-header-content');

  expect(backButton).toBeInTheDocument();
  expect(content).toHaveTextContent('My work - Raymond Poisson, Claude Garbut');
});

// Add test for PDF button
test('renders the PDF download button', () => {
  render(
    <WorkPageHeader
      id="102"
      slug="my-work"
      title="My work"
      authors={authors}
    />,
  );

  const buttons = screen.getAllByRole('button');
  const pdfButton = buttons[buttons.length - 1]; // Last button is the PDF button

  expect(pdfButton).toBeInTheDocument();
  expect(pdfButton).toHaveTextContent('PDF');
});
