import { render, screen } from '@testing-library/react';
import { ModalProvider } from 'components/modalContext';
import WorkHeader from './WorkHeader';

const renderWithinModalProvider = (component) =>
  render(<ModalProvider>{component}</ModalProvider>);

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

const mainLanguage = [{ title: 'French' }];

test('renders the work header', () => {
  renderWithinModalProvider(
    <WorkHeader
      title="My work"
      subtitle="Is this a work?"
      authors={authors}
      mostRelevantDate="1926"
      compositionPlace={place}
      mainLanguage={mainLanguage}
    />,
  );

  const h1 = screen.getByRole('heading', { level: 1 });
  const h2 = screen.getByRole('heading', { level: 2 });
  const h3 = screen.getByRole('heading', { level: 3 });

  expect(h1).toHaveTextContent('My work');
  expect(h2).toHaveTextContent('Is this a work?');
  expect(h3).toHaveTextContent(
    'Raymond Poissoncommon:openNote, Claude Garbutcommon:openNote|1926|Paris, France|French',
  );
});

test('renders the work header without a subtitle', () => {
  renderWithinModalProvider(<WorkHeader title="My work" />);

  const h2 = screen.queryByRole('heading', { level: 2 });

  expect(h2).not.toBeInTheDocument();
});

test('renders the work header without a date', () => {
  renderWithinModalProvider(
    <WorkHeader
      title="My work"
      subtitle="Is this a work?"
      authors={authors}
      compositionPlace={place}
      mainLanguage={mainLanguage}
    />,
  );

  const h3 = screen.getByRole('heading', { level: 3 });

  expect(h3).toHaveTextContent(
    'Raymond Poissoncommon:openNote, Claude Garbutcommon:openNote|Paris, France|French',
  );
});

test('renders the work header without a place', () => {
  renderWithinModalProvider(
    <WorkHeader
      title="My work"
      subtitle="Is this a work?"
      authors={authors}
      mostRelevantDate="1926"
      mainLanguage={mainLanguage}
    />,
  );

  const h3 = screen.getByRole('heading', { level: 3 });

  expect(h3).toHaveTextContent(
    'Raymond Poissoncommon:openNote, Claude Garbutcommon:openNote|1926|French',
  );
});

test('renders the work header without a language', () => {
  renderWithinModalProvider(
    <WorkHeader
      title="My work"
      subtitle="Is this a work?"
      authors={authors}
      mostRelevantDate="1926"
      compositionPlace={place}
    />,
  );

  const h3 = screen.getByRole('heading', { level: 3 });

  expect(h3).toHaveTextContent(
    'Raymond Poissoncommon:openNote, Claude Garbutcommon:openNote|1926|Paris, France',
  );
});

test('renders the work header without a language and a date', () => {
  renderWithinModalProvider(
    <WorkHeader
      title="My work"
      subtitle="Is this a work?"
      authors={authors}
      compositionPlace={place}
    />,
  );

  const h3 = screen.getByRole('heading', { level: 3 });

  expect(h3).toHaveTextContent(
    'Raymond Poissoncommon:openNote, Claude Garbutcommon:openNote|Paris, France',
  );
});
