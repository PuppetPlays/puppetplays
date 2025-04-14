import { render, screen, fireEvent, act } from '@testing-library/react';
import React from 'react';

// Mock les composants importés par WorksFilters pour éviter les problèmes avec react-select
jest.mock('components/FilterSelect', () => () => (
  <div data-testid="filter-select">FilterSelect Mock</div>
));
jest.mock('components/FilterRange', () => () => (
  <div data-testid="filter-range">FilterRange Mock</div>
));
jest.mock('components/FilterCheckbox', () => ({ label, onChange }) => (
  <div data-testid="filter-checkbox">
    <label>
      <input
        type="checkbox"
        aria-label={label}
        onChange={() => onChange(true)}
      />
      {label}
    </label>
  </div>
));
jest.mock(
  'components/FiltersBar',
  () =>
    ({ children, onClearAll, disabled }) => (
      <div data-testid="filters-bar">
        {children}
        <button
          data-testid="clear-all-button"
          disabled={disabled}
          onClick={onClearAll}
        >
          Effacer tout
        </button>
      </div>
    ),
);

// Mock next/router
jest.mock('next/router', () => ({
  useRouter: () => ({
    locale: 'fr',
  }),
}));

// Mock next-i18next
jest.mock('next-i18next', () => ({
  useTranslation: () => ({
    t: key => {
      const translations = {
        'common:filterByLanguage': 'Filtrer par langue',
        'common:contentNotAvailable': 'Contenu non disponible',
      };
      return translations[key] || key;
    },
    i18n: {
      changeLanguage: jest.fn(),
    },
  }),
}));

// Mock pour les API de données
jest.mock('lib/api', () => ({
  getAllWorksKeywordsQuery: 'mock-query',
  getFetchAPIClient: jest.fn(() =>
    jest.fn().mockImplementation(() => {
      return Promise.resolve({
        tags: [],
        entries: [],
      });
    }),
  ),
}));

jest.mock('lib/filtersApi', () => ({
  getAllAnimationTechniquesQuery: 'mock-query',
  getAllTheatricalTechniquesQuery: 'mock-query',
  getAllAudiencesQuery: 'mock-query',
  getAllFormatsQuery: 'mock-query',
  getAllLanguagesQuery: jest.fn(() => 'mock-query'),
  getAllLiteraryTonesQuery: 'mock-query',
  getAllPlacesQuery: jest.fn(() => 'mock-query'),
  getPeriodBoundsQuery: 'mock-query',
  getFilterEntriesByIdsQuery: jest.fn(() => 'mock-query'),
  getSectionName: jest.fn(key => {
    const sections = {
      mainLanguage: 'languages',
      compositionPlace: 'places',
      authors: 'persons',
      literaryTones: 'literaryTones',
      animationTechniques: 'animationTechniques',
      theatricalTechniques: 'theatricalTechniques',
      audience: 'audiences',
      formats: 'formats',
      relatedToTags: 'tags',
    };
    return sections[key] || key;
  }),
  getAllWorksQuery: 'mock-query',
}));

// Mock lodash functions
jest.mock('lodash/uniqBy', () => arr => arr);
jest.mock(
  'lodash/get',
  () => (obj, path, defaultValue) =>
    path.split('.').reduce((acc, part) => acc && acc[part], obj) ||
    defaultValue,
);

// Mock lib/utils
jest.mock('lib/utils', () => ({
  hasAtLeastOneItem: arr => Array.isArray(arr) && arr.length > 0,
  identity: x => x,
}));

// Importer après les mocks
import WorksFilters from './WorksFilters';

describe('WorksFilters component', () => {
  const mockOnChange = jest.fn();
  const mockOnClearAll = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders basic structure', async () => {
    await act(async () => {
      render(
        <WorksFilters
          filters={{}}
          onChange={mockOnChange}
          onClearAll={mockOnClearAll}
        />,
      );
    });

    // Vérifier que les éléments de base sont rendus
    expect(screen.getByTestId('filters-bar')).toBeInTheDocument();
    expect(screen.getByTestId('clear-all-button')).toBeInTheDocument();

    // Vérifier que les filtres select sont rendus
    const filterSelects = screen.getAllByTestId('filter-select');
    expect(filterSelects.length).toBeGreaterThan(0);
  });

  test('calls onClearAll when clear button is clicked', async () => {
    await act(async () => {
      render(
        <WorksFilters
          filters={{ mainLanguage: ['1'] }}
          onChange={mockOnChange}
          onClearAll={mockOnClearAll}
        />,
      );
    });

    // Cliquer sur le bouton d'effacement
    await act(async () => {
      fireEvent.click(screen.getByTestId('clear-all-button'));
    });
    expect(mockOnClearAll).toHaveBeenCalledTimes(1);
  });

  test('renders checkbox filters', async () => {
    await act(async () => {
      render(
        <WorksFilters
          filters={{}}
          onChange={mockOnChange}
          onClearAll={mockOnClearAll}
        />,
      );
    });

    // Vérifier que les filtres checkbox sont rendus
    const filterCheckboxes = screen.getAllByTestId('filter-checkbox');
    expect(filterCheckboxes.length).toBeGreaterThan(0);
  });
});
