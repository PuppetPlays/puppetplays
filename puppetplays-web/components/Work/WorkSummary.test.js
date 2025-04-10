import { render, screen, fireEvent } from '@testing-library/react';
import WorkSummary from './WorkSummary';

// Mock pour next/link
jest.mock('next/link', () => ({ children }) => children);

// Mock pour next-translate/useTranslation
jest.mock('next-translate/useTranslation', () => () => ({
  t: (key) => {
    const translations = {
      'common:note': 'Note',
      'common:otherTitles': 'Autres titres',
      'common:publications': 'Publications',
      'common:publication': 'Publication',
      'common:modernEdition': 'Édition moderne',
      'common:onlineCopy': 'Copie en ligne',
      'common:literaryTones': 'Tonalités littéraires',
      'common:animationTechniques': 'Techniques d\'animation',
      'common:audience': 'Public',
      'common:characters': 'Personnages',
      'common:actsCount': 'Nombre d\'actes',
      'common:license': 'Licence',
      'common:publicDomain': 'Domaine public',
      'common:expandNote': 'Afficher plus',
      'common:closeNote': 'Réduire',
      'common:pagesCount': '1 page'
    };
    return translations[key] || key;
  }
}));

// Mock pour @tippyjs/react
jest.mock('@tippyjs/react', () => ({
  __esModule: true,
  default: jest.fn(),
}));

describe('WorkSummary component', () => {
  test('renders with only the required props', () => {
    render(<WorkSummary id="1" title="My work" slug="my-work" />);
  
    const h1 = screen.getByRole('heading', { level: 1 });
    expect(h1).toHaveTextContent('My work');
    
    // Vérifier que les sections qui seraient vides ne sont pas rendues
    expect(screen.queryByText('Tonalités littéraires')).not.toBeInTheDocument();
    expect(screen.queryByText('Techniques d\'animation')).not.toBeInTheDocument();
    expect(screen.queryByText('Public')).not.toBeInTheDocument();
  });
  
  test('renders the expanded version with only the required props', () => {
    const { getByRole } = render(
      <WorkSummary id="1" title="My work" slug="my-work" />,
    );
  
    fireEvent.click(getByRole('button'));
  
    const h1 = screen.getByRole('heading', { level: 1 });
    expect(h1).toHaveTextContent('My work');
    
    // Dans l'état étendu, certaines sections devraient être rendues mêmes si vides
    expect(screen.queryByText('Note')).not.toBeInTheDocument(); // Pas rendu si vide
    expect(screen.queryByText('Autres titres')).not.toBeInTheDocument(); // Pas rendu si vide
    expect(screen.queryByText('Publications')).not.toBeInTheDocument(); // Pas rendu si les sous-propriétés sont vides
  });

  test('renders with empty arrays', () => {
    render(
      <WorkSummary 
        id="1" 
        title="My work" 
        slug="my-work"
        authors={[]}
        theatricalTechniques={[]}
        keywords={[]}
        literaryTones={[]}
        animationTechniques={[]}
        audience={[]}
      />
    );
    
    // Les sections avec des tableaux vides ne devraient pas être rendues
    expect(screen.queryByText('Tonalités littéraires')).not.toBeInTheDocument();
    expect(screen.queryByText('Techniques d\'animation')).not.toBeInTheDocument();
    expect(screen.queryByText('Public')).not.toBeInTheDocument();
  });

  test('renders with null values', () => {
    render(
      <WorkSummary 
        id="1" 
        title="My work" 
        slug="my-work"
        authors={null}
        theatricalTechniques={null}
        keywords={null}
        literaryTones={null}
        animationTechniques={null}
        audience={null}
        note={null}
        otherTitles={null}
        mainImage={null}
        abstract={null}
      />
    );
    
    // Les propriétés null ne devraient pas causer d'erreur et le composant devrait se rendre
    const h1 = screen.getByRole('heading', { level: 1 });
    expect(h1).toHaveTextContent('My work');
  });

  test('renders with empty coverImage', () => {
    render(
      <WorkSummary 
        id="1" 
        title="My work" 
        slug="my-work"
        mainImage={null}
        compositionMinDate={null}
      />
    );
    
    // Le composant devrait se rendre même sans image de couverture
    const h1 = screen.getByRole('heading', { level: 1 });
    expect(h1).toHaveTextContent('My work');
  });

  test('renders with empty formats and pages count', () => {
    render(
      <WorkSummary 
        id="1" 
        title="My work" 
        slug="my-work"
        formats={[]}
        pagesCount={null}
      />
    );
    
    // Le composant devrait se rendre sans information sur les formats et le nombre de pages
    const h1 = screen.getByRole('heading', { level: 1 });
    expect(h1).toHaveTextContent('My work');
  });
});
