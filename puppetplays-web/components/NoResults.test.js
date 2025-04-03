import React from 'react';
import { render, screen } from '@testing-library/react';
import NoResults from './NoResults';

// Mock next-translate
jest.mock('next-translate/useTranslation', () => () => ({
  t: (key) => {
    const translations = {
      'common:contentNotAvailable': 'Contenu non disponible',
      'common:error.noResultsFound': 'Aucun résultat trouvé'
    };
    return translations[key] || key;
  }
}));

describe('NoResults component', () => {
  test('renders with default props', () => {
    render(<NoResults />);
    
    expect(screen.getByText('Contenu non disponible')).toBeInTheDocument();
    expect(screen.getByText('Aucun résultat trouvé')).toBeInTheDocument();
    // Should render the default clock icon
    expect(document.querySelector('svg circle')).toBeInTheDocument();
  });

  test('renders with custom title and message', () => {
    const customTitle = 'Pas de résultats';
    const customMessage = 'Veuillez modifier vos critères de recherche';
    
    render(<NoResults title={customTitle} message={customMessage} />);
    
    expect(screen.getByText(customTitle)).toBeInTheDocument();
    expect(screen.getByText(customMessage)).toBeInTheDocument();
  });

  test('renders with search icon', () => {
    render(<NoResults icon="search" />);
    
    // Search icon has a path with different attributes
    const searchPath = document.querySelector('svg path[stroke][d="M20 20L16 16"]');
    expect(searchPath).toBeInTheDocument();
  });

  test('renders with info icon', () => {
    render(<NoResults icon="info" />);
    
    // Info icon has a specific circle element
    const infoCircle = document.querySelector('svg circle[fill="var(--color-brand)"]');
    expect(infoCircle).toBeInTheDocument();
  });

  test('applies custom styles', () => {
    const customStyles = { 
      backgroundColor: 'red',
      padding: '20px'
    };
    
    const { container } = render(<NoResults customStyles={customStyles} />);
    
    const noResultsDiv = container.firstChild;
    expect(noResultsDiv).toHaveStyle('background-color: red');
    expect(noResultsDiv).toHaveStyle('padding: 20px');
  });
}); 