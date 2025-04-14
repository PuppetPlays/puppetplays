import { render } from '@testing-library/react';

import Work from './Work';

jest.mock('@tippyjs/react', () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock('next/router', () => ({
  useRouter() {
    return {
      locale: 'fr',
    };
  },
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

test('renders with only the required props', () => {
  render(<Work title="My work" />);
});
