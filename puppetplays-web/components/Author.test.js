import { render } from '@testing-library/react';
import Author from './Author';

import { ModalProvider } from 'components/modalContext';

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

const renderWithinModalProvider = component =>
  render(<ModalProvider>{component}</ModalProvider>);

test('renders an author with a common name', () => {
  const { container } = renderWithinModalProvider(
    <Author id="1" usualName="Fish" firstName="Raymond" lastName="Poisson" />,
  );
  expect(container).toHaveTextContent('Fish (Raymond Poisson)');
});

test('renders an author without a common name', () => {
  const { container } = renderWithinModalProvider(
    <Author id="1" firstName="Raymond" lastName="Poisson" />,
  );
  expect(container).toHaveTextContent('Raymond Poisson');
});

test('renders an author with a common name and a nickname', () => {
  const { container } = renderWithinModalProvider(
    <Author
      id="1"
      usualName="Fish"
      firstName="Raymond"
      lastName="Poisson"
      nickname="Ray"
    />,
  );
  expect(container).toHaveTextContent(
    'Fish (Raymond Poisson, common:alias Ray)',
  );
});

test('renders an author with a nickname but without a common name', () => {
  const { container } = renderWithinModalProvider(
    <Author id="1" firstName="Raymond" lastName="Poisson" nickname="Ray" />,
  );
  expect(container).toHaveTextContent('Raymond Poisson (common:alias Ray)');
});

test('renders an author with only a nickname and a common name', () => {
  const { container } = renderWithinModalProvider(
    <Author id="1" usualName="Fishy" nickname="Ray" />,
  );
  expect(container).toHaveTextContent('Fishy (common:alias Ray)');
});

test('renders an author with only a common name', () => {
  const { container } = renderWithinModalProvider(
    <Author id="1" usualName="Fishy" />,
  );
  expect(container).toHaveTextContent('Fishy');
});

test('renders an author with only a first name', () => {
  const { container } = renderWithinModalProvider(
    <Author id="1" firstName="Raymond" />,
  );
  expect(container).toHaveTextContent('Raymond');
});

test('renders an author with the lastName first', () => {
  const { container } = renderWithinModalProvider(
    <Author id="1" firstName="Raymond" lastName="Poisson" lastNameFirst />,
  );
  expect(container).toHaveTextContent('Poisson Raymond');
});

test('renders an author with a common name and with the lastName first', () => {
  const { container } = renderWithinModalProvider(
    <Author
      id="1"
      usualName="Fishy"
      firstName="Raymond"
      lastName="Poisson"
      lastNameFirst
    />,
  );
  expect(container).toHaveTextContent('Fishy (Raymond Poisson)');
});
